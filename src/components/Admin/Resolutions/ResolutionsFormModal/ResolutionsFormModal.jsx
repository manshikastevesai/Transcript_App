import React, { useState, useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  CreateResolutions,
  ListCategories,
} from "../../AdminServices/AdminServices";
import { toast } from "react-toastify";
import Loading from "../../../CommonComponent/Loading/Loading";

const ResolutionsFormModal = ({
  title,
  show,
  onClose,
  handleSave,
  categoryName,
  setCategoryName,

  setSteps,
  selectedCategory,
  setSelectedCategory,

  handleLogout,
  categoryOptionsState,
  setCategoryOptionsState,
}) => {
  if (!show) return null;

  const animatedComponents = makeAnimated();

  const [issueOptionsState, setIssueOptionsState] = useState([]);
  const [issueInput, setIssueInput] = useState("");
  const [stepsOptions, setStepsOptions] = useState([]);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStep, setSelectedStep] = useState([]);

  const [stepInput, setStepInput] = useState("");
  const [manualSteps, setManualSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchCategories = async () => {
    try {
      const res = await ListCategories();
      const data = res.data || [];

      const formatted = data.map((cat) => ({
        value: cat.id,
        label: cat.name,
        issues: cat.issues,
      }));

      setCategoryOptionsState(formatted);
    } catch (err) {
      if (err?.response?.status === 401) handleLogout();
      console.log("Category API Error", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySelect = (selected) => {
    setSelectedCategory(selected);
    setCategoryName("");

    const issues = selected?.issues || [];

    setIssueOptionsState(
      issues.map((i) => ({
        value: i.id,
        label: i.issue,
        steps: i.steps,
      }))
    );

    setSelectedIssue(null);
    setSelectedStep([]);
    setStepsOptions([]);
  };

  const handleCategoryInput = (e) => {
    setCategoryName(e.target.value);

    if (e.target.value !== "") {
      setSelectedCategory(null);
    }
    setIssueOptionsState([]);
    setSelectedIssue(null);
    setSelectedStep([]);
    setStepsOptions([]);
    setIssueInput("");
  };

  const handleIssueInput = (e) => {
    setIssueInput(e.target.value);

    setStepsOptions([]);
    if (e.target.value !== "") {
      setSelectedIssue(null);
    }
  };

  const handleStepsSelect = (selected) => {
    setSelectedStep(selected);
    setSteps(selected);
  };

  const handleStepInputKey = (e) => {
    if (e.key === "Enter" && stepInput.trim() !== "") {
      setManualSteps([...manualSteps, stepInput.trim()]);
      setStepInput("");
    }
  };

  const deleteManualStep = (i) => {
    setManualSteps(manualSteps.filter((_, idx) => idx !== i));
  };

  const handleCreateSave = async () => {
    if (!categoryName && !selectedCategory) {
      toast.error("Please enter or select a category!");
      return;
    }

    if (!issueInput && !selectedIssue) {
      toast.error("Please enter or select an issue!");
      return;
    }

    let finalSteps = [...selectedStep.map((s) => s.label), ...manualSteps];

    if (stepInput.trim() !== "") {
      finalSteps.push(stepInput.trim());
    }

    if (finalSteps.length === 0) {
      toast.error("Please add steps or select steps!");
      return;
    }

    const stepString = finalSteps.join(", ");

    const payload = {
      category: categoryName || selectedCategory.label,
      issues: [
        {
          issue: issueInput || selectedIssue.label,
          steps: stepString,
        },
      ],
    };

    setIsLoading(true);

    try {
      const res = await CreateResolutions(payload);
      // setIsLoading(false);
      if (res.status === 200 || res.status === 201) {
        toast.success("Resolution Added Successfully!");
        handleSave();
      }
    } catch (err) {
      if (err?.response?.status === 401) handleLogout();
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category</label>

                <div className="equal-row">
                  <div className="equal-box">
                    <input
                      type="text"
                      className="form-control h-100"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={handleCategoryInput}
                    />
                  </div>

                  <div className="or-center">OR</div>

                  <div className="equal-box">
                    <Select
                      options={categoryOptionsState}
                      value={selectedCategory}
                      onChange={handleCategorySelect}
                      placeholder="Select Category"
                      components={animatedComponents}
                      className="full-width-select"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Issue</label>

                <div className="equal-row">
                  <div className="equal-box">
                    <input
                      type="text"
                      className="form-control h-100"
                      placeholder="Enter issue name"
                      value={issueInput}
                      onChange={handleIssueInput}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label>Manual Steps</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Type step and press Enter"
                  value={stepInput}
                  onChange={(e) => setStepInput(e.target.value)}
                  onKeyDown={handleStepInputKey}
                />

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "8px",
                    gap: "8px",
                  }}
                >
                  {manualSteps.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f1f1f1",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {s}
                      <span
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                        onClick={() => deleteManualStep(i)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer">
                <button
                  className="add_btn01"
                  onClick={handleCreateSave}
                  disabled={isLoading}
                >
                  Save
                </button>
              </div>
              {isLoading && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionsFormModal;
