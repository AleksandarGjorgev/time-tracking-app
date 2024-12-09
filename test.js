'use client';

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AbsenceForm from "@/components/AbsenceForm";
import WorkLogTable from "@/components/WorkLogTable";
import WorkLogForm from "@/components/WorkLogForm";
import { useRouter } from "next/navigation";
import { getWorkLogs, fetchAPI, createWorkLog, updateWorkLog, deleteWorkLog } from "./api/services/route";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      fetchUserData();
      fetchWorkLogs();
    }
  }, []);

  const [workLogs, setWorkLogs] = useState([]);
  const [newWorkLog, setNewWorkLog] = useState({
    startTime: "",
    endTime: "",
    breakStart: "",
    breakEnd: "",
    date: "",
  });
  const [absenceData, setAbsenceData] = useState({
    date: "",
    absenceType: "",
  });
  const [mode, setMode] = useState("work");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const data = await fetchAPI("/api/Users/me");
      setUserId(data.id);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchWorkLogs = async () => {
    try {
      const response = await getWorkLogs();
      if (response.success && Array.isArray(response.data)) {
        setWorkLogs(response.data);
      } else {
        setWorkLogs([]);
      }
    } catch (error) {
      console.error("Error fetching work logs:", error.message);
    }
  };

  const calculateHours = (startTime, endTime, breakStart, breakEnd) => {
    if (!startTime || !endTime) return "—";
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    let workHours = (end - start) / (1000 * 60 * 60);

    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`1970-01-01T${breakStart}`);
      const breakEndTime = new Date(`1970-01-01T${breakEnd}`);
      const breakDuration = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
      if (breakDuration > 0) {
        workHours -= breakDuration;
      }
    }

    return `${Math.max(0, workHours).toFixed(2)} h`;
  };

  const handleAddWorkLog = async () => {
    if (!newWorkLog.startTime || !newWorkLog.endTime || !newWorkLog.breakStart || !newWorkLog.breakEnd || !newWorkLog.date) {
      alert("Please fill in all the required fields.");
      return;
    }
    try {
      const workLogWithUserId = { ...newWorkLog, userId };
      const response = await createWorkLog(workLogWithUserId);
      if (response.success) {
        alert("Work log successfully added!");
        fetchWorkLogs();
        setNewWorkLog({ startTime: "", endTime: "", breakStart: "", breakEnd: "", date: "" });
      } else {
        alert(`Failed to add work log: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error adding work log: ${error.message}`);
    }
  };

  const handleEditWorkLog = async (updatedLog) => {
    try {
      const response = await updateWorkLog(updatedLog.id, updatedLog);
      if (response.success) {
        alert("Work log successfully updated!");
        fetchWorkLogs();
      } else {
        alert(`Failed to update work log: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error updating work log: ${error.message}`);
    }
  };

  const handleDeleteWorkLog = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this work log?")) return;
    try {
      const response = await deleteWorkLog(logId);
      if (response.success) {
        alert("Work log successfully deleted!");
        fetchWorkLogs();
      } else {
        alert(`Failed to delete work log: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error deleting work log: ${error.message}`);
    }
  };

  const handleSaveAbsence = async (e) => {
    e.preventDefault();

    if (!absenceData.date || !absenceData.absenceType) {
      alert("Please select a date and absence type.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/AbsenceRecord/record-absence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(absenceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      alert(data.message || "Absence has been successfully recorded!");
      setAbsenceData({ date: "", absenceType: "sick", description: "" });
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Welcome to your profile!</h1>

          {userData && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h2 className="text-xl font-semibold">User Information</h2>
              <p><strong>Name:</strong> {userData.fullName}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Employment Type:</strong> {userData.employmentType}</p>
            </div>
          )}

          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setMode("work")}
              className={`px-6 py-3 rounded-md ${mode === "work" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Work Log
            </button>
            <button
              onClick={() => setMode("absence")}
              className={`px-6 py-3 rounded-md ${mode === "absence" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Absence
            </button>
          </div>

          {mode === "work" && (
            <div className="animate__animated animate__fadeIn">
              <WorkLogForm
                newWorkLog={newWorkLog}
                setNewWorkLog={setNewWorkLog}
                handleAddWorkLog={handleAddWorkLog}
              />
              <WorkLogTable
                workLogs={workLogs}
                calculateHours={calculateHours}
                onEdit={handleEditWorkLog}
                onDelete={handleDeleteWorkLog}
              />
            </div>
          )}

          {mode === "absence" && (
            <div className="animate__animated animate__fadeIn">
              <AbsenceForm
                absenceData={absenceData}
                setAbsenceData={setAbsenceData}
                handleSaveAbsence={handleSaveAbsence}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
