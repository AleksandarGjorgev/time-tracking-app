import React, { useState } from "react";
import * as XLSX from "xlsx";

const AbsenceLogTable = ({ absenceLogs, onEdit, onDelete }) => {
  const [editingLog, setEditingLog] = useState(null); // Currently editing record
  const [editedLog, setEditedLog] = useState({}); // Copy of the record being edited

  const sortedAbsenceLogs = [...absenceLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleEditClick = (log) => {
    setEditingLog(log.id);
    setEditedLog(log);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedLog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = () => {
    if (!editedLog.date || !editedLog.absenceType) {
      alert("Datum in vrsta odsotnosti sta obvezna.");
      return;
    }

    onEdit(editedLog);
    setEditingLog(null); // Hide the form
  };

  const handleCancelEdit = () => {
    setEditingLog(null); // Cancel editing
  };

  const handleExportToExcel = () => {
    const formattedLogs = sortedAbsenceLogs.map((log) => ({
      Date: new Date(log.date).toLocaleDateString(),
      AbsenceType: log.absenceType,
      Description: log.description || "",
    }));

    const ws = XLSX.utils.json_to_sheet(formattedLogs);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Absence Logs");

    XLSX.writeFile(wb, "absence_logs.xlsx");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Tvoji zapisi odsotnosti</h2>

      {/* Export button */}
      <div className="text-center mb-4">
        <button
          onClick={handleExportToExcel}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Izvozi v Excel
        </button>
      </div>

      {sortedAbsenceLogs.length === 0 ? (
        <div className="text-center text-gray-500">Noben zapis odsotnosti ni bil najden.</div>
      ) : (
        sortedAbsenceLogs.map((log) => {
          const isEditing = editingLog === log.id;
          const formattedDate = new Date(log.date).toLocaleDateString();

          return (
            <div
              key={log.id}
              className="bg-white shadow-lg rounded-lg p-4 space-y-4 hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">Datum:</label>
                    <input
                      type="date"
                      name="date"
                      value={editedLog.date.split("T")[0]}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Vrsta odsotnosti:</label>
                    <select
                      name="absenceType"
                      value={editedLog.absenceType}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Izberi vrsto</option>
                      <option value="sick">Bolniška</option>
                      <option value="vacation">Dopust</option>
                      <option value="unpaid">Neplačan dopust</option>
                      <option value="childcare">Varstvo otrok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Opis:</label>
                    <input
                      type="text"
                      name="description"
                      value={editedLog.description || ""}
                      onChange={handleEditChange}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600 transition duration-300"
                    >
                      Prekliči
                    </button>
                    <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition duration-300"
                    >
                      Shrani
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold">{formattedDate}</span>
                    <p className="text-sm text-gray-500">Vrsta: {log.absenceType}</p>
                    {log.description && <p className="text-sm text-gray-500">Opis: {log.description}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(log)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition duration-300"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={() => onDelete(log.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition duration-300"
                    >
                      Izbriši
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default AbsenceLogTable;
