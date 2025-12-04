import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../Context/AppContext";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ShowAllHistoryOfUsers } from "../../Admin/AdminServices/AdminServices";
import { IoChatboxEllipses } from "react-icons/io5";

const Sidebar = ({ isOpen }) => {
  const [usersData, setUsersData] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [openUser, setOpenUser] = useState(null);
  const [activeTab, setActiveTab] = useState("customerDetails");
  const [openTransactions, setOpenTransactions] = useState(null);
  const [openIssues, setOpenIssues] = useState(null);
  const [openRestrictions, setOpenRestrictions] = useState(null);
  const [openResolution, setOpenResolution] = useState(null);
  const [openFileId, setOpenFileId] = useState(null);
  const { user, handleLogout } = useAppContext();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const res = await ShowAllHistoryOfUsers();
      setUsersData(res || {});
    } catch (error) {
      console.log("Error loading users", error);
    }
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
    setOpenUser(null);
    setActiveTab("customerDetails");
  };

  const toggleUser = (username) => {
    if (openUser === username) {
      setOpenUser(null);
      setOpenFileId(null);
    } else {
      setOpenUser(username);
      setActiveTab("customerDetails"); // fixed
      setOpenFileId(null);
    }
  };

  const toggleFileHistory = (fileId) => {
    setOpenFileId((prev) => (prev === fileId ? null : fileId));
  };

  return (
    <div
      className={`bg-white sidebar-wrapper ${isOpen ? "" : ""}`}
      id="sidebar-wrapper"
      style={{
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      {/* SuperAdmin */}
      {user?.role === "SuperAdmin" && (
        <div className="list-group list-group-flush">
          <Link
            to="/super-admin-dashboard"
            className={`list-group-item list-group-item-action p-3 ${
              currentPath === "/super-admin-dashboard" ? "active-link" : ""
            }`}
          >
            <i className="bi bi-person-lines-fill me-2"></i> Admins
          </Link>
        </div>
      )}

      {/* Admin */}
      {user?.role === "admin" && (
        <>
          <div className="list-group list-group-flush">
            <Link
              to="/admin-dashboard"
              className={`list-group-item list-group-item-action p-3 ${
                currentPath === "/admin-dashboard" ? "active-link" : ""
              }`}
            >
              <i className="bi bi-person-lines-fill me-2"></i> Customers
            </Link>
          </div>

          <div className="list-group list-group-flush">
            <Link
              to="/resolutions"
              className={`list-group-item list-group-item-action p-3 ${
                currentPath === "/resolutions" ? "active-link" : ""
              }`}
            >
              <i className="bi bi-person-lines-fill me-2"></i> Resolutions
            </Link>
          </div>

          {/* HISTORY */}
          <div className="list-group list-group-flush">
            <div
              className="list-group-item list-group-item-action p-3 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={toggleHistory}
            >
              <div>
                <i className="bi bi-clock-history me-2"></i> History
              </div>
              <i
                className={`bi ${
                  showHistory ? "bi-chevron-up" : "bi-chevron-down"
                }`}
              />
            </div>

            {showHistory && (
              <div className="ps-3">
                {Object.keys(usersData).map((username) => (
                  <div key={username} className="mt-3">
                    {/* Username */}
                    <div
                      onClick={() => toggleUser(username)}
                      className="d-flex justify-content-between align-items-center py-2 px-2 rounded bg-light"
                      style={{
                        cursor: "pointer",
                        fontWeight: 500,
                        border: "1px solid #e9e9e9",
                      }}
                    >
                      <span>
                        <i className="bi bi-person-circle me-2"></i>
                        {username}
                      </span>
                      <i
                        className={`bi ${
                          openUser === username
                            ? "bi-chevron-up"
                            : "bi-chevron-down"
                        }`}
                      ></i>
                    </div>

                    {/* USER CONTENT */}
                    {openUser === username && (
                      <div className="mt-2">
                        {/* Customer Details */}
                        <div
                          onClick={() =>
                            setActiveTab((prev) =>
                              prev === "customerDetails"
                                ? null
                                : "customerDetails"
                            )
                          }
                          className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          <span>Customer Details</span>
                          <i
                            className={`bi ${
                              activeTab === "customerDetails"
                                ? "bi-chevron-up"
                                : "bi-chevron-down"
                            }`}
                          ></i>
                        </div>

                        {activeTab === "customerDetails" && (
                          <div className="card mb-2">
                            <div className="card-body">
                              <p>
                                <b>Name:</b>{" "}
                                {
                                  usersData[username].customer_details
                                    .customer_name
                                }
                              </p>
                              <p>
                                <b>Email:</b>{" "}
                                {usersData[username].customer_details.email}
                              </p>
                              <p>
                                <b>Account ID:</b>{" "}
                                {
                                  usersData[username].customer_details
                                    .account_id
                                }
                              </p>
                              <p>
                                <b>Services:</b>{" "}
                                {usersData[
                                  username
                                ].customer_details.services.join(", ")}
                              </p>

                              {/* TRANSACTIONS */}
                              <div
                                onClick={() =>
                                  setOpenTransactions((prev) =>
                                    prev === username ? null : username
                                  )
                                }
                                className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer", fontWeight: 600 }}
                              >
                                <span>Transactions</span>
                                <i
                                  className={`bi ${
                                    openTransactions === username
                                      ? "bi-chevron-up"
                                      : "bi-chevron-down"
                                  }`}
                                ></i>
                              </div>

                              {openTransactions === username &&
                                usersData[
                                  username
                                ].customer_details.transactions.map(
                                  (txn, idx) => (
                                    <div
                                      key={idx}
                                      className="border p-2 mb-2 rounded bg-light"
                                      style={{ border: "1px solid #e9e9e9" }}
                                    >
                                      <p>
                                        <b>Date:</b>{" "}
                                        {new Date(txn.date).toLocaleString()}
                                      </p>
                                      <p>
                                        <b>Type:</b> {txn.type}
                                      </p>
                                      {txn.notes && (
                                        <p>
                                          <b>Notes:</b> {txn.notes}
                                        </p>
                                      )}
                                      <p>
                                        <b>Amount:</b> {txn.currency}{" "}
                                        {txn.amount}
                                      </p>
                                      <p>
                                        <b>Method:</b> {txn.method}
                                      </p>
                                      <p>
                                        <b>Status:</b> {txn.status}
                                      </p>
                                      <p>
                                        <b>Transaction ID:</b>{" "}
                                        {txn.transactionId}
                                      </p>
                                      <p>
                                        <b>Related Service ID:</b>{" "}
                                        {txn.relatedServiceId}
                                      </p>
                                    </div>
                                  )
                                )}

                              {/* ISSUES */}
                              <div
                                onClick={() =>
                                  setOpenIssues((prev) =>
                                    prev === username ? null : username
                                  )
                                }
                                className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer", fontWeight: 600 }}
                              >
                                <span>Issues</span>
                                <i
                                  className={`bi ${
                                    openIssues === username
                                      ? "bi-chevron-up"
                                      : "bi-chevron-down"
                                  }`}
                                ></i>
                              </div>

                              {openIssues === username &&
                                usersData[username].customer_details.issues.map(
                                  (issue, idx) => (
                                    <div
                                      key={idx}
                                      className="border p-2 mb-2 rounded bg-light"
                                    >
                                      <p>
                                        <b>Reason:</b> {issue.reason}
                                      </p>
                                      <p>
                                        <b>Status:</b> {issue.status}
                                      </p>
                                      <p>
                                        <b>Start:</b>{" "}
                                        {new Date(
                                          issue.startTime
                                        ).toLocaleString()}
                                      </p>
                                      <p>
                                        <b>End:</b>{" "}
                                        {issue.endTime
                                          ? new Date(
                                              issue.endTime
                                            ).toLocaleString()
                                          : "Ongoing"}
                                      </p>
                                    </div>
                                  )
                                )}

                              {/* RESTRICTIONS */}
                              <div
                                onClick={() =>
                                  setOpenRestrictions((prev) =>
                                    prev === username ? null : username
                                  )
                                }
                                className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer", fontWeight: 600 }}
                              >
                                <span>Restrictions</span>
                                <i
                                  className={`bi ${
                                    openRestrictions === username
                                      ? "bi-chevron-up"
                                      : "bi-chevron-down"
                                  }`}
                                ></i>
                              </div>

                              {openRestrictions === username &&
                                usersData[
                                  username
                                ].customer_details.restrictions.map(
                                  (rest, idx) => (
                                    <div
                                      key={idx}
                                      className="border p-2 mb-2 rounded bg-light"
                                    >
                                      <p>
                                        <b>Type:</b> {rest.type}
                                      </p>
                                      <p>
                                        <b>Description:</b> {rest.description}
                                      </p>
                                      <p>
                                        <b>Start:</b>{" "}
                                        {new Date(
                                          rest.startDate
                                        ).toLocaleString()}
                                      </p>
                                      <p>
                                        <b>End:</b>{" "}
                                        {rest.endDate
                                          ? new Date(
                                              rest.endDate
                                            ).toLocaleString()
                                          : "N/A"}
                                      </p>
                                      <p>
                                        <b>Active:</b>{" "}
                                        {rest.isActive ? "Yes" : "No"}
                                      </p>
                                    </div>
                                  )
                                )}

                              <div
                                onClick={() =>
                                  setOpenResolution((prev) =>
                                    prev === username ? null : username
                                  )
                                }
                                className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer", fontWeight: 600 }}
                              >
                                <span>Resolution Steps</span>
                                <i
                                  className={`bi ${
                                    openResolution === username
                                      ? "bi-chevron-up"
                                      : "bi-chevron-down"
                                  }`}
                                ></i>
                              </div>

                              {openResolution === username && (
                                <div className="border p-2 mb-2 rounded bg-light">
                                  {usersData[
                                    username
                                  ].customer_details.resolution_steps.map(
                                    (step, idx) => (
                                      <p key={idx}>• {step}</p>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* FILES */}
                        <div
                          onClick={() =>
                            setActiveTab((prev) =>
                              prev === "files" ? null : "files"
                            )
                          }
                          className="py-2 px-3 rp-history-header mb-1 d-flex justify-content-between align-items-center"
                          style={{ cursor: "pointer", fontWeight: 600 }}
                        >
                          <span>Chat History Files</span>
                          <i
                            className={`bi ${
                              activeTab === "files"
                                ? "bi-chevron-up"
                                : "bi-chevron-down"
                            }`}
                          ></i>
                        </div>

                        {activeTab === "files" && (
                          <div className="card mb-2">
                            <div className="card-body">
                              {usersData[username].chat_history.map((file) => (
                                <div key={file.fileId} className="mb-2">
                                  <div
                                    onClick={() =>
                                      toggleFileHistory(file.fileId)
                                    }
                                    className="d-flex justify-content-between align-items-center py-1 px-2 rounded border"
                                    style={{
                                      cursor: "pointer",
                                      fontWeight:
                                        openFileId === file.fileId
                                          ? "bold"
                                          : "normal",
                                    }}
                                  >
                                    <span>
                                      <i className="bi bi-file-earmark-text me-2"></i>
                                      {file.fileName}
                                    </span>
                                    <i
                                      className={`bi ${
                                        openFileId === file.fileId
                                          ? "bi-chevron-up"
                                          : "bi-chevron-down"
                                      }`}
                                    ></i>
                                  </div>

                                  {openFileId === file.fileId &&
                                    file.details.map((d, i) => (
                                      <div
                                        key={i}
                                        className="border ps-3 my-1 p-2 rounded bg-light"
                                      >
                                        <p>
                                          <b>Question:</b>{" "}
                                          <ReactMarkdown>
                                            {d.title}
                                          </ReactMarkdown>
                                        </p>
                                        <p className="text-muted">
                                          <b>Answer:</b>{" "}
                                          <ReactMarkdown>
                                            {d.description}
                                          </ReactMarkdown>
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="list-group list-group-flush">
            <Link
              to="/admin-chatBot"
              className={`list-group-item list-group-item-action p-3 ${
                currentPath === "/admin-chatBot" ? "active-link" : ""
              }`}
            >
              <IoChatboxEllipses className="me-2" />
              Chat Assistant
            </Link>
          </div>
        </>
      )}

      {/* Logout */}
      <div className="list-group list-group-flush mt-3">
        <Link
          to="#"
          onClick={() => handleLogout()}
          className="list-group-item list-group-item-action p-3"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Log Out
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
