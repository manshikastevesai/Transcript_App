import React, { useEffect, useState } from "react";
import Navbar from "../../CommonComponent/Navbar/Navbar";
import { GetAllResolutionList } from "../AdminServices/AdminServices";

import Loading from "../../CommonComponent/Loading/Loading";
import Sidebar from "../../CommonComponent/SideBar/SideBar";
import { useAppContext } from "../../Context/AppContext";
import ResolutionsFormModal from "./ResolutionsFormModal/ResolutionsFormModal";

function Resolutions() {
  const { handleLogout } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [issueName, setIssueName] = useState("");
  const [steps, setSteps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOptionsState, setCategoryOptionsState] = useState([]);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const getCategories = async () => {
    try {
      setIsLoading(true);
      const res = await GetAllResolutionList();
      console.log(res.data, "GetAllResolutionList");
      if (res.status === 200) {
        const sortedCategories = [...(res.data || [])].reverse();

        setCategories(sortedCategories);

        const formatted = sortedCategories.map((cat) => ({
          value: cat.id,
          label: cat.name,
          issues: cat.issues,
        }));
        setCategoryOptionsState(formatted);
      }
    } catch (err) {
      if (err?.response?.status === 401) handleLogout();
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const handleSaveResolution = async () => {
    getCategories();
    setShowModal(false);
  };

  const resetForm = () => {
    setCategoryName("");
    setIssueName("");
    setSteps([]);
    setSelectedCategory(null);
    setShowModal(false);
  };

  return (
    <div id="wrapper" className={`d-flex ${isOpen ? "toggled" : ""}`}>
      {isLoading && <Loading />}

      <Sidebar isOpen={isOpen} />

      <Navbar onToggleSidebar={toggleSidebar} />

      <div id="page-content-wrapper">
        <div className="container-fluid px-4 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="admin_head">Create Resolutions</h3>

            <button
              className="add_btn01"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Resolutions
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table_resolution">
              <thead className="table-dark">
                <tr>
                  <th>Category</th>
                  <th>Issues</th>
                  <th>Steps</th>
                </tr>
              </thead>

              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No resolutions found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) =>
                    cat.issues?.map((issue) => (
                      <tr key={`${cat.id}-${issue.id}`}>
                        <td>{cat.name}</td>
                        <td>{issue.issue}</td>

                        <td style={{ whiteSpace: "normal", maxWidth: "600px" }}>
                          <ol
                            style={{
                              margin: 0,
                              paddingLeft: "18px",
                              textAlign: "left",
                            }}
                          >
                            {issue.steps?.map((s, idx) => (
                              <li key={idx}>
                                {typeof s === "object" && s !== null
                                  ? ` ${s.description}`
                                  : String(s)}
                              </li>
                            )) || <span className="text-muted">No steps</span>}
                          </ol>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          <ResolutionsFormModal
            title="Add Resolution"
            show={showModal}
            onClose={() => setShowModal(false)}
            handleSave={handleSaveResolution}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            setSteps={setSteps}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            handleLogout={handleLogout}
            categoryOptionsState={categoryOptionsState}
            setCategoryOptionsState={setCategoryOptionsState}
          />
        </div>
      </div>
    </div>
  );
}

export default Resolutions;
