import React, { useState } from "react";

const getWeekDates = (currentDate) => {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1;
  startOfWeek.setDate(startOfWeek.getDate() - diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

const WorkLogForm = ({ newWorkLog, setNewWorkLog, handleAddWorkLog, userId }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [errors, setErrors] = useState({});

  const weekDates = getWeekDates(currentWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  const validateTime = (time) => /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);

  const handleTimeChange = (field, value) => {
    setErrors({ ...errors, [field]: false });
    setNewWorkLog({ ...newWorkLog, [field]: value });
  };

  const validateForm = () => {
    const formErrors = {};

    if (!newWorkLog.date) formErrors.date = true;
    if (!newWorkLog.startTime || !validateTime(newWorkLog.startTime)) formErrors.startTime = true;
    if (!newWorkLog.endTime || !validateTime(newWorkLog.endTime)) formErrors.endTime = true;
    if (!newWorkLog.breakStart || !validateTime(newWorkLog.breakStart)) formErrors.breakStart = true;
    if (!newWorkLog.breakEnd || !validateTime(newWorkLog.breakEnd)) formErrors.breakEnd = true;

    const start = newWorkLog.startTime ? new Date(`1970-01-01T${newWorkLog.startTime}`) : null;
    const end = newWorkLog.endTime ? new Date(`1970-01-01T${newWorkLog.endTime}`) : null;
    const breakStart = newWorkLog.breakStart ? new Date(`1970-01-01T${newWorkLog.breakStart}`) : null;
    const breakEnd = newWorkLog.breakEnd ? new Date(`1970-01-01T${newWorkLog.breakEnd}`) : null;

    if (start && end && start >= end) formErrors.startTime = formErrors.endTime = true;
    if (breakStart && (breakStart < start || breakStart > end)) formErrors.breakStart = true;
    if (breakEnd && (breakEnd < start || breakEnd > end)) formErrors.breakEnd = true;
    if (breakStart && breakEnd && breakStart >= breakEnd) formErrors.breakStart = formErrors.breakEnd = true;

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await handleAddWorkLog({
        ...newWorkLog,
        userId,
      });
      setNewWorkLog({
        startTime: "",
        endTime: "",
        breakStart: "",
        breakEnd: "",
        date: "",
      });
    } catch (error) {
      alert(`Napaka pri shranjevanju: ${error.message}`);
    }
  };

  const handleDayClick = (day, date) => {
    const today = new Date();
    if (date > today) return; // Prevent selecting future dates

    setSelectedDay(day);
    setNewWorkLog({ ...newWorkLog, date: date.toISOString().split("T")[0] });
  };

  const getDate = (date) => new Date(date).toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
  const getFormattedDate = (date) => new Date(date).toLocaleDateString("sl-SI", { weekday: "long" });

  const isFutureDate = (date) => date > new Date();

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Vnos delovnega časa za teden</h2>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateWeek(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &lt;
        </button>
        <span className="font-medium text-lg">
          {getDate(weekDates[0])} - {getDate(weekDates[6])}
        </span>
        <button
          onClick={() => navigateWeek(1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map((date, idx) => {
          const day = getFormattedDate(date);
          const dateStr = getDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDay === day;
          const isFuture = isFutureDate(date);

          return (
            <div
              key={idx}
              className={`text-center p-2 rounded-lg cursor-pointer ${
                isFuture
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-blue-200"
                  : isToday
                  ? "bg-green-200"
                  : "bg-gray-100"
              }`}
              onClick={() => handleDayClick(day, date)}
            >
              <div className="hidden md:block text-lg font-semibold">{day}</div>
              <div className="text-base md:text-sm text-gray-500">{dateStr}</div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="border p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Vnos za {selectedDay}</h3>
          <div className="grid grid-cols-2 gap-4">
            {["startTime", "endTime", "breakStart", "breakEnd"].map((field) => (
              <div key={field}>
                <label className="block text-sm mb-1">
                  {field === "startTime" ? "Prihod" : field === "endTime" ? "Odhod" : field === "breakStart" ? "Začetek odmora" : "Konec odmora"}
                </label>
                <input
                  type="time"
                  value={newWorkLog[field] || ""}
                  onChange={(e) => handleTimeChange(field, e.target.value)}
                  className={`w-full p-2 border rounded ${errors[field] ? "border-red-500" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
      >
        Shrani
      </button>
    </form>
  );
};

export default WorkLogForm;
