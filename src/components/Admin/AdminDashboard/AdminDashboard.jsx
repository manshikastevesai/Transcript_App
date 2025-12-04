import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../CommonComponent/Navbar/Navbar";
import {
  Admin,
  GetCustomer,
  editCustomer,
  deleteCustomer,
  inviteCustomer,
  UploadAndProcessFile,
} from "../AdminServices/AdminServices";
import { toast } from "react-toastify";
import Loading from "../../CommonComponent/Loading/Loading";
import Sidebar from "../../CommonComponent/SideBar/SideBar";
import { useAppContext } from "../../Context/AppContext";
import CreateFormModal from "../../CommonComponent/CreateFormModal/CreateFormModal";
import ConfirmDeleteModal from "../../CommonComponent/ConfirmDeleteModal/ConfirmDeleteModal";

function AdminDashboard() {
  const { handleLogout } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customer_name, setCustomerName] = useState("");
  const [customer_email, setCustomerEmail] = useState("");
  const [customers, setCustomers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [deleteCustomerModal, setCustomerDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const fileInputRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const GetCustomerDetail = async () => {
    try {
      setIsLoading(true);
      const res = await GetCustomer();
      if (res.status === 200 || res.status === 201) {
        console.log(res.data, "res");
        const result = res?.data?.customers || [];

        const sortedCustomers = Array.isArray(result)
          ? [...result].sort((a, b) => a.id - b.id)
          : [];

        setCustomers(sortedCustomers);
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
    GetCustomerDetail();
  }, []);

  const handleSaveCustomer = async () => {
    const payload = {
      name: customer_name,
      email: customer_email,
    };

    if (!customer_name || !customer_email) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (isEditMode && editData) {
        const res = await editCustomer({
          ...payload,
          customer_id: editData.id,
        });
        if (res.status === 200 || res.status === 201) {
          toast.success("Customer updated successfully!");
        }
      } else {
        const res = await Admin(payload);
        if (res.status === 200 || res.status === 201) {
          toast.success("Customer created successfully!");
        }
      }
      await GetCustomerDetail();
      resetForm();
    } catch (error) {
      console.error("Error saving admin:", error);
      if (error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setShowModal(false);
    setIsEditMode(false);
    setEditData(null);
  };

  const openEditModal = (item) => {
    setEditData(item);
    setCustomerName(item.name);
    setCustomerEmail(item.email);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      console.log(id, customers, "customers");
      const res = await deleteCustomer({ customer_id: id });
      if (res.status === 200 || res.status === 201) {
        setCustomers((prev) => prev.filter((x) => x.id !== id));
        toast.success("Customer deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      if (error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleAddFileClick = (userId) => {
    setSelectedUserId(userId);
    fileInputRef.current.click();
  };

  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setIsLoadingFile((prev) => ({ ...prev, [selectedUserId]: true }));
    try {
      const res = await UploadAndProcessFile(selectedUserId, formData);
      if (res.status === 200 || res.status === 201) {
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      toast.error("File upload failed!");
      console.error(error);
    } finally {
      setIsLoadingFile((prev) => ({ ...prev, [selectedUserId]: false }));
    }
    event.target.value = "";
  };

  return (
    <div id="wrapper" className={`d-flex ${isOpen ? "toggled" : ""}`}>
      {isLoading && <Loading />}
      <Sidebar isOpen={isOpen} />

      <Navbar onToggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper">
        <div className="container-fluid px-4 pt-4">
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="admin_head">Create Customer</h3>
              <button
                className="add_btn01"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                Add Customer
              </button>
            </div>
            <div className="table-responsive">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelected}
              />

              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        Customer details not found
                      </td>
                    </tr>
                  ) : (
                    customers?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          <button
                            className="add-file"
                            onClick={() => handleAddFileClick(item.id)}
                            disabled={isLoadingFile[item.id]}
                          >
                            {isLoadingFile[item.id] ? (
                              <span className="button-spinner"></span>
                            ) : null}
                            {isLoadingFile[item.id] ? "Wait..." : "Add File"}
                          </button>

                          <button
                            className="delete"
                            onClick={() => {
                              setDeleteId(item.id);
                              setCustomerDeleteModal(true);
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
              title={isEditMode ? "Edit Customer" : "Add New Customer"}
              Save="Save Customer"
              show={showModal}
              onClose={() => setShowModal(false)}
              handleSave={handleSaveCustomer}
              company_name={customer_name}
              setCompanyName={setCustomerName}
              email={customer_email}
              setEmail={setCustomerEmail}
              isEditMode={isEditMode}
            />

            <ConfirmDeleteModal
              show={deleteCustomerModal}
              message="Are you sure you want to delete this customer?"
              onConfirm={async () => {
                await handleDeleteCustomer(deleteId);
                setCustomerDeleteModal(false);
                setDeleteId(null);
              }}
              onCancel={() => setCustomerDeleteModal(false)}
            />
          </>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
