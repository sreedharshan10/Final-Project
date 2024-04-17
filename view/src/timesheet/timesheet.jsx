import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import Axios library
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

function Timesheet() {
  const { userId } = useParams();
  const [projectAllocations, setProjectAllocations] = useState([]);
  const [rows, setRows] = useState([
    {
      selectedProject: "",
      selectedTask: "",
      hoursBAU: Array(7).fill(0),
      hoursSales: Array(7).fill(0),
      isNew: true,
    },
  ]);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    getStartOfWeek(new Date())
  );

  useEffect(() => {
    const fetchProjectAllocations = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/project-allocations"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project allocations data");
        }
        const data = await response.json();
        setProjectAllocations(data);
      } catch (error) {
        console.error("Error fetching project allocations:", error);
      }
    };

    fetchProjectAllocations();
  }, []);

  const handleProjectChange = (e, rowIndex) => {
    const projectName = e.target.value;
    const newRows = [...rows];
    newRows[rowIndex].selectedProject = projectName;
    setRows(newRows);
  };

  const handleTaskSelection = (e, rowIndex) => {
    const task = e.target.value;
    const newRows = [...rows];
    newRows[rowIndex].selectedTask = task;
    setRows(newRows);
  };

  const handleInputChangeBAU = (rowIndex, dayIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex].hoursBAU[dayIndex] = parseFloat(value) || 0;
    setRows(newRows);
  };

  const addRow = (event) => {
    event.preventDefault();
    setRows([
      ...rows,
      {
        selectedProject: "",
        selectedTask: "",
        hoursBAU: Array(7).fill(0),
        hoursSales: Array(7).fill(0),
        isNew: true,
      },
    ]);
  };

  const deleteRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  // Function to handle week toggle
  // const handleWeekToggle = (direction) => {
  //     const newWeekStart = new Date(selectedWeekStart);
  //     direction === 'prev' ? newWeekStart.setDate(selectedWeekStart.getDate() - 7) : newWeekStart.setDate(selectedWeekStart.getDate() + 7);
  //     setSelectedWeekStart(newWeekStart);
  //     resetRows(); // Reset rows when toggling weeks
  // };

  const resetRows = () => {
    setRows([
      {
        selectedProject: "",
        selectedTask: "",
        comment: "", // Reset comment to empty string
        hoursBAU: Array(7).fill(0),
        hoursSales: Array(7).fill(0),
        isNew: true,
      },
    ]);
  };

  const handleWeekToggle = (direction) => {
    const newWeekStart = new Date(selectedWeekStart);
    direction === "prev"
      ? newWeekStart.setDate(selectedWeekStart.getDate() - 7)
      : newWeekStart.setDate(selectedWeekStart.getDate() + 7);
    setSelectedWeekStart(newWeekStart);
    resetRows(); // Reset rows when toggling weeks
  };

  // Function to format date to "DD MMM YYYY" format
  const formatDate = (date) => {
    const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const dayName = date.toLocaleDateString("en-GB", { weekday: "short" });
    return `${day} ${dayName}`;
  };

  // Calculate week range
  const weekStartDate = selectedWeekStart;
  const weekEndDate = new Date(selectedWeekStart);
  weekEndDate.setDate(selectedWeekStart.getDate() + 6);

  // Generate array of dates for the week
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(selectedWeekStart);
    currentDate.setDate(selectedWeekStart.getDate() + i);
    daysOfWeek.push(formatDate(currentDate));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    // Get the formatted date for display
    const weekStartDate = formatDate(selectedWeekStart);
    const weekEndDate = formatDate(
      new Date(selectedWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
    );

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const selectedProject = projectAllocations.find(
          (project) => project.projectName === row.selectedProject
        );
        if (!selectedProject) {
          console.warn(`Skipping row ${i + 1} because no project is selected.`);
          continue; // Skip this row and proceed to the next one
        }

        const hoursBAU = {};
        weekdays.forEach((dayName, dayIndex) => {
          hoursBAU[dayName] = row.hoursBAU[dayIndex] || 0;
        });

        const timesheetData = {
          userId: userId,
          projectType: selectedProject.projectDomain,
          projectId: selectedProject.projectId,
          projectName: row.selectedProject,
          task: row.selectedTask,
          comment: row.comment,
          hours: hoursBAU,
          totalHours: row.hoursBAU.reduce((total, hour) => total + hour, 0),
          weekStartDate: weekStartDate, // Add the start date of the week
          weekEndDate: weekEndDate, // Add the end date of the week
        };

        console.log(`Timesheet data for row ${i + 1}:`, timesheetData); // Log the timesheetData object

        const response = await axios.post(
          "http://localhost:3002/api/timesheets",
          timesheetData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 201) {
          console.error(`Failed to submit timesheet for row ${i + 1}`);
          continue; // Skip this row and proceed to the next one
        }

        const responseData = response.data;
        console.log(
          `Timesheet submitted successfully for row ${i + 1}:`,
          responseData
        );
        alert("Timesheets submitted successfully!");
        resetRows(); // Reset rows after successful submission
      }
    } catch (error) {
      console.error("Error submitting timesheets:", error);
      alert("Error submitting timesheets!");
    }
  };

  const calculateTotalHoursBAU = (rowIndex) => {
    return rows[rowIndex].hoursBAU.reduce((total, hour) => total + hour, 0);
  };

  const calculateTotal = () => {
    return rows.reduce((total, row) => {
      return (
        total +
        row.hoursBAU.reduce((sum, hour) => sum + hour, 0) +
        row.hoursSales.reduce((sum, hour) => sum + hour, 0)
      );
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="content-container" style={{ color: "#030637" }}>
        <h1 style={{ marginTop: "5px", marginBottom: "0px", color: "#3C0753" }}>
          Timesheet
        </h1>
        <div className="h3-row" style={{ color: "#720455" }}>
          <h3>Total Hours: {calculateTotal()}</h3>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => handleWeekToggle("prev")}>
              <ChevronLeft />
            </IconButton>
            <h3 style={{ color: "#910A67" }}>
              {formatDate(weekStartDate)} - {formatDate(weekEndDate)}{" "}
              {weekStartDate.getFullYear()}
            </h3>
            <IconButton onClick={() => handleWeekToggle("next")}>
              <ChevronRight />
            </IconButton>
          </div>
        </div>
        <details>
          <summary
            style={{
              marginTop: "5px",
              marginBottom: "5px",
              border: "1px solid #030637",
              color: "white",
              backgroundColor: "#3C0753",
              padding: "5px",
              fontSize: "medium",
              fontWeight: "bold",
            }}
          >
            Allocation Extension
          </summary>
          <div className="table-container">
            <table
              style={{
                borderCollapse: "collapse",
                color: "#030637",
                padding: "5px",
                width: "100%",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#ffe5ec",
                    textAlign: "center",
                    width: "100%",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  <td>Project name</td>
                  <td>Project type</td>
                  <td>Project end date</td>
                  <td>Allocation end date</td>
                  <td>Allocation extension</td>
                </tr>
              </thead>
            </table>
          </div>
        </details>

        <h3
          style={{
            marginTop: "5px",
            marginBottom: "5px",
            border: "1px solid #030637",
            color: "white",
            backgroundColor: "#3C0753",
            padding: "5px",
            fontSize: "medium",
          }}
        >
          Timesheet
        </h3>
        <div className="table-container">
          <table
            style={{
              borderCollapse: "collapse",
              color: "#030637",
              padding: "5px",
              width: "100%",
            }}
          >
            <thead
              style={{
                backgroundColor: "#ffe5ec",
                textAlign: "center",
              }}
            >
              <tr style={{ paddingBottom: "10px", fontSize: "15px" }}>
                <th>Project Type</th>
                <th>Project Name</th>
                <th>Task</th>
                <th>Comment</th>
                {daysOfWeek.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody
              style={{
                color: "#030637",
                backgroundColor: "#ffffff",
                padding: "5px",
              }}
            >
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    {projectAllocations
                      .filter(
                        (project) => project.projectName === row.selectedProject
                      ) // Filter based on the selected project
                      .map((project) => project.projectDomain)}
                  </td>
                  <td>
                    <select
                      width="50%"
                      value={row.selectedProject}
                      onChange={(e) => handleProjectChange(e, rowIndex)}
                      style={{ width: "125px" }}
                    >
                      <option value="">Select Project</option>
                      {projectAllocations
                        .filter((project) =>
                          project.userDetails.some(
                            (user) => user.userId === userId
                          )
                        )
                        .map((project) => (
                          <option
                            key={project.projectId}
                            value={project.projectName}
                          >
                            {project.projectName}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <select
                      style={{ width: "125px" }}
                      value={row.selectedTask}
                      onChange={(e) => handleTaskSelection(e, rowIndex)}
                    >
                      <option value="">Select Task</option>
                      {row.selectedProject &&
                        projectAllocations
                          .filter(
                            (project) =>
                              project.projectName === row.selectedProject
                          )
                          .map((project) =>
                            project.userDetails
                              .filter((user) => user.userId === userId)
                              .map((user) =>
                                user.userTasks.map((task) => (
                                  <option key={task} value={task}>
                                    {task}
                                  </option>
                                ))
                              )
                          )}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.comment}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[rowIndex].comment = e.target.value;
                        setRows(newRows);
                      }}
                      style={{ width: "220px" }}
                    />
                  </td>
                  {row.hoursBAU.map((hour, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="text"
                        style={{ width: "55px" }}
                        value={hour}
                        onChange={(e) =>
                          handleInputChangeBAU(
                            rowIndex,
                            dayIndex,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  ))}
                  <td>Total: {calculateTotalHoursBAU(rowIndex)}</td>
                  <td>
                    {rowIndex === 0 ? (
                      <button
                        style={{
                          backgroundColor: "#720455",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={addRow}
                      >
                        +
                      </button>
                    ) : (
                      <button
                        style={{
                          backgroundColor: "#720455",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteRow(rowIndex)}
                      >
                        -
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="flex-container"
          style={{ justifyContent: "flex-end", marginTop: "10px" }}
        >
         
          <button
            id="submit"
            style={{
              marginRight: "10px",
              backgroundColor: "#720455",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={handleSubmit}
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}

export default Timesheet;
