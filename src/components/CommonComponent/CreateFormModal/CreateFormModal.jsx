import React from "react";

const CreateFormModal = ({
  title,
  Save,
  show,
  onClose,
  handleSave,
  company_name,
  setCompanyName,
  email,
  setEmail,
  isEditMode,
}) => {
  if (!show) return null;

  return (
    <div>
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewAdminModalLabel">
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <form className="modal_form">
                <div className="mb-3">
                  <label htmlFor="adminFname" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="adminFname"
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="adminEmail" className="form-label">
                    Email Id
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="adminEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEditMode}
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="add_btn01" onClick={handleSave}>
                {Save}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormModal;
