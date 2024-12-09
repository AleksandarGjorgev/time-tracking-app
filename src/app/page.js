'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Uporabimo za preusmeritev\
import Navbar from "@/components/Navbar";
import AbsenceForm from "@/components/AbsenceForm";
import AbsenceLogTable from "@/components/AbsenceLogTable";
import WorkLogTable from "@/components/WorkLogTable";
import WorkLogForm from "@/components/WorkLogForm";
import {
  getWorkLogs,
  createWorkLog,
  updateWorkLog,
  deleteWorkLog,
  getAbsenceRecords,
  createAbsenceLog,
  updateAbsence,
  deleteAbsence,
} from "./api/services/route";

export default function Dashboard() {
  const [workLogs, setWorkLogs] = useState([]);
  const [absenceLogs, setAbsenceLogs] = useState([]);
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
    description: "",
  });
  const [mode, setMode] = useState("work");
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Inicializacija routerja

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token"); // Preveri, če obstaja JWT v localStorage
      if (!token) {
        router.push("/login"); // Preusmeri na /login, če ni žetona
      }
    };

    checkToken(); // Kliči funkcijo ob zagonu komponente
  }, [router]);

  useEffect(() => {
    fetchUserData();
    fetchWorkLogs();
    fetchAbsenceLogs();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await fetchAPI("/api/Users/me");
      setUserId(data.id);
    } catch (error) {
    }
  };

  const fetchWorkLogs = async () => {
    try {
      const response = await getWorkLogs();
      if (response.success) setWorkLogs(response.data);
      else setWorkLogs([]);
    } catch (error) {
    }
  };

  const fetchAbsenceLogs = async () => {
    try {
      const response = await getAbsenceRecords();
      if (response.success) setAbsenceLogs(response.data);
      else setAbsenceLogs([]);
    } catch (error) {
    }
  };

  const calculateHours = (startTime, endTime, breakStart, breakEnd) => {
    if (!startTime || !endTime) return "—";
  
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    let workHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  
    if (breakStart && breakEnd) {
      const breakStartTime = new Date(`1970-01-01T${breakStart}`);
      const breakEndTime = new Date(`1970-01-01T${breakEnd}`);
      const breakDuration = (breakEndTime - breakStartTime) / (1000 * 60 * 60);
      workHours -= breakDuration;
    }
  
    return `${Math.max(0, workHours).toFixed(2)} h`; // Ensure non-negative value
  };
  
  const handleEditWorkLog = async (updatedLog) => {
    try {
      const response = await updateWorkLog(updatedLog.id, updatedLog);
      if (response.success) {
        fetchWorkLogs(); // Refresh logs after update
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
        fetchWorkLogs(); // Refresh logs after deletion
      } else {
        alert(`Failed to delete work log: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error deleting work log: ${error.message}`);
    }
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
        fetchWorkLogs();
        setNewWorkLog({ startTime: "", endTime: "", breakStart: "", breakEnd: "", date: "" });
      } else {
        alert(`Failed to add work log: ${response.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error adding work log: ${error.message}`);
    }
  };

  const handleSaveAbsence = async () => {
    if (!absenceData.date || !absenceData.absenceType) {
      setErrors({
        date: !absenceData.date,
        absenceType: !absenceData.absenceType,
      });
      return;
    }
    setErrors({});
    try {
      const response = await createAbsenceLog(absenceData);
      if (response.success) {
        fetchAbsenceLogs();
        setAbsenceData({ date: "", absenceType: "", description: "" });
      }
    } catch (error) {
      console.error("Napaka pri shranjevanju odsotnosti:", error.message);
    }
  };

  const handleEditAbsence = async (updatedAbsence) => {
    try {
      const response = await updateAbsence(updatedAbsence.id, updatedAbsence);
      if (response.success) {
        fetchAbsenceLogs();
      }
    } catch (error) {
      console.error("Napaka pri urejanju odsotnosti:", error.message);
    }
  };

  const handleDeleteAbsence = async (absenceId) => {
    try {
      const response = await deleteAbsence(absenceId);
      if (response.success) {
        fetchAbsenceLogs();
      }
    } catch (error) {
      console.error("Napaka pri brisanju odsotnosti:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Dobrodošli na profilu!</h1>

          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setMode("work")}
              className={`px-6 py-3 rounded-md ${mode === "work" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Delovni zapisi
            </button>
            <button
              onClick={() => setMode("absence")}
              className={`px-6 py-3 rounded-md ${mode === "absence" ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
            >
              Odsotnosti
            </button>
          </div>

          {mode === "work" && (
            <>
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

            </>
          )}

          {mode === "absence" && (
            <>
              <AbsenceForm
                absenceData={absenceData}
                setAbsenceData={setAbsenceData}
                handleSaveAbsence={handleSaveAbsence}
                errors={errors}
              />
              <AbsenceLogTable
                absenceLogs={absenceLogs}
                onEdit={handleEditAbsence}
                onDelete={handleDeleteAbsence}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
