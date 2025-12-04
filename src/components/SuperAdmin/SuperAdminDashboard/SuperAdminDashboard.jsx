import React, { useEffect, useState } from "react";
import Navbar from "../../CommonComponent/Navbar/Navbar";
import {
  editAdmin,
  SuperAdmin,
  deleteAdmin,
  inviteAdmin,
  GetAdmin,
} from "../SuperAdminServices/SuperAdminServices";
import { toast } from "react-toastify";
import Loading from "../../CommonComponent/Loading/Loading";

import { useAppContext } from "../../Context/AppContext";
import Sidebar from "../../CommonComponent/SideBar/SideBar";
import CreateFormModal from "../../CommonComponent/CreateFormModal/CreateFormModal";
import ConfirmDeleteModal from "../../CommonComponent/ConfirmDeleteModal/ConfirmDeleteModal";

function SuperAdminDashboard() {
  const { handleLogout } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [company_name, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const GetAdminDetail = async () => {
    try {
      setIsLoading(true);
      const res = await GetAdmin();
      if (res.status === 200 || res.status === 201) {
        const companies = res?.data?.data?.companies || [];

        const sortedData = Array.isArray(companies)
          ? [...companies].sort((a, b) => a.id - b.id)
          : [];

        setAdmins(sortedData);
      }
    } catch (error) {
      if (error.response.status === 401) {
        handleLogout();
      }
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GetAdminDetail();
  }, []);

  const handleSave = async () => {
    const payload = { company_name, email };

    if (!company_name || !email) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (isEditMode && editData) {
        const res = await editAdmin({ ...payload, company_id: editData.id });
        if (res.status === 200 || res.status === 201) {
          toast.success("Admin updated successfully!");
        }
      } else {
        const res = await SuperAdmin(payload);
        if (res.status === 200 || res.status === 201) {
          toast.success("Admin created successfully!");
        }
      }
      await GetAdminDetail();
      resetForm();
    } catch (error) {
      console.error("Error saving admin:", error);
      if (error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setEmail("");
    setShowModal(false);
    setIsEditMode(false);
    setEditData(null);
  };

  const openEditModal = (item) => {
    setEditData(item);
    setCompanyName(item.company_name);
    setEmail(item.company_email);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAdmin({ company_id: id });
      if (res.status === 200 || res.status === 201) {
        setAdmins((prev) => prev.filter((x) => x.id !== id));
        toast.success("Admin deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      if (error.response.status === 401) {
        handleLogout();
      }
    }
  };

  return (
    <div id="wrapper" className={`d-flex ${isOpen ? "toggled" : ""}`}>
      {isLoading && <Loading />}
      <Sidebar isOpen={isOpen} />

      <Navbar onToggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper">
        <div className="container-fluid px-4 pt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="admin_head">Create Admin</h3>
            <button
              className="add_btn01"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              Add Admin
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      Admin details not found
                    </td>
                  </tr>
                ) : (
                  admins.map((item) => (
                    <tr key={item.id}>
                      <td>{item.company_name}</td>
                      <td>{item.company_email}</td>
                      <td>
                        <button
                          className="delete"
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteModal(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <CreateFormModal
            title={isEditMode ? "Edit Admin" : "Add New Admin"}
            Save="Save Admin"
            show={showModal}
            onClose={() => setShowModal(false)}
            handleSave={handleSave}
            company_name={company_name}
            setCompanyName={setCompanyName}
            email={email}
            setEmail={setEmail}
            isEditMode={isEditMode}
          />

          <ConfirmDeleteModal
            show={deleteModal}
            message="Are you sure you want to delete this admin?"
            onConfirm={async () => {
              await handleDelete(deleteId);
              setDeleteModal(false);
              setDeleteId(null);
            }}
            onCancel={() => setDeleteModal(false)}
          />
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
