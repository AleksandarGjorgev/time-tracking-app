import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const WorkLogTable = ({ workLogs, calculateHours, onEdit, onDelete }) => {
  const [editingLog, setEditingLog] = useState(null);
  const [editedLog, setEditedLog] = useState({});

  const sortedWorkLogs = [...workLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

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
    onEdit(editedLog);
    setEditingLog(null);
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
  };

  const handleExportToExcel = () => {
    const formattedLogs = sortedWorkLogs.map((log) => ({
      Date: new Date(log.date).toLocaleDateString(),
      Start: new Date(`1970-01-01T${log.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      End: new Date(`1970-01-01T${log.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      BreakStart: log.breakStart ? new Date(`1970-01-01T${log.breakStart}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      BreakEnd: log.breakEnd ? new Date(`1970-01-01T${log.breakEnd}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      WorkHours: calculateHours(log.startTime, log.endTime, log.breakStart, log.breakEnd),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedLogs);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Work Logs');

    XLSX.writeFile(wb, 'work_logs.xlsx');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Tvoji delovni zapisi</h2>

      <div className="text-center mb-4">
        <button
          onClick={handleExportToExcel}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Izvozi v Excel
        </button>
      </div>

      {sortedWorkLogs.length === 0 ? (
        <div className="text-center text-gray-500">Noben delovni zapis ni bil najden.</div>
      ) : (
        sortedWorkLogs.map((log) => {
          const isEditing = editingLog === log.id;
          const formattedDate = new Date(log.date).toLocaleDateString();
          const formattedStartTime = new Date(`1970-01-01T${log.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedEndTime = new Date(`1970-01-01T${log.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const workHours = calculateHours(log.startTime, log.endTime, log.breakStart, log.breakEnd);

          return (
            <div key={log.id} className="bg-white shadow-lg rounded-lg p-4 space-y-4 hover:bg-gray-50 transition duration-300 ease-in-out">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <label className="flex-1 min-w-[120px]">
                      <span className="text-sm text-gray-600">Prihod:</span>
                      <input
                        type="time"
                        name="startTime"
                        value={editedLog.startTime}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                      />
                    </label>
                    <label className="flex-1 min-w-[120px]">
                      <span className="text-sm text-gray-600">Odhod:</span>
                      <input
                        type="time"
                        name="endTime"
                        value={editedLog.endTime}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex-1 min-w-[120px]">
                      <span className="text-sm text-gray-600">Začetek malice:</span>
                      <input
                        type="time"
                        name="breakStart"
                        value={editedLog.breakStart || ''}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                      />
                    </label>
                    <label className="flex-1 min-w-[120px]">
                      <span className="text-sm text-gray-600">Konec malice:</span>
                      <input
                        type="time"
                        name="breakEnd"
                        value={editedLog.breakEnd || ''}
                        onChange={handleEditChange}
                        className="border p-2 rounded w-full"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
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
                <div className="flex flex-wrap gap-4 items-start md:items-center">
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-lg font-semibold">{formattedDate}</span>
                    <p className="text-sm text-gray-500">
                      Prihod: {formattedStartTime} | Odhod: {formattedEndTime}
                    </p>
                    {log.breakStart && log.breakEnd && (
                      <p className="text-sm text-gray-500">
                        Malica: {new Date(`1970-01-01T${log.breakStart}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(`1970-01-01T${log.breakEnd}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="font-semibold">{workHours}</span>
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

export default WorkLogTable;
