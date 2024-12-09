import React, { useState } from "react";

// Funkcija za pridobivanje datumov trenutnega tedna (od ponedeljka do nedelje)
const getWeekDates = (currentDate) => {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1; // Začnite teden z ponedeljkom
  startOfWeek.setDate(startOfWeek.getDate() - diff);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
};

const AbsenceForm = ({ absenceData, setAbsenceData, handleSaveAbsence }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // Sledite izbranemu dnevu
  const weekDates = getWeekDates(currentWeek);

  // Premik med tedni (prejšnji ali naslednji)
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  // Upravljanje klika na dan in nastavitev izbranega dneva
  const handleDayClick = (day, date) => {
    setSelectedDay(date.toISOString().split("T")[0]); // Shrani izbran dan v formatu YYYY-MM-DD
    setAbsenceData({
      ...absenceData,
      date: date.toISOString().split("T")[0], // Nastavi izbrani datum v obrazcu
      absenceType: "", // Resetiraj vrsto odsotnosti
      description: "", // Resetiraj opis
    });
  };

  // Upravljanje sprememb vnosa za obrazec odsotnosti
  const handleInputChange = (e) => {
    setAbsenceData({
      ...absenceData,
      [e.target.name]: e.target.value,
    });
  };

  // Formatiranje datuma za prikaz
  const getDate = (date) => new Date(date).toLocaleDateString("sl-SI", { day: "numeric", month: "short" });
  const getFormattedDate = (date) => new Date(date).toLocaleDateString("sl-SI", { weekday: "long" });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSaveAbsence(); // Pokliči funkcijo za shranjevanje odsotnosti
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Vnos odsotnosti za teden</h2>

      {/* Navigacija med tedni */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => navigateWeek(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &lt;
        </button>
        <span className="font-medium text-lg">
          {getDate(weekDates[0])} - {getDate(weekDates[6])}
        </span>
        <button
          type="button"
          onClick={() => navigateWeek(1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          &gt;
        </button>
      </div>

      {/* Mreža dni */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        {weekDates.map((date, idx) => {
          const day = getFormattedDate(date);
          const dateStr = getDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDay === date.toISOString().split("T")[0];

          return (
            <div
              key={idx}
              className={`text-center p-2 rounded-lg cursor-pointer ${
                isSelected ? "bg-blue-200" : isToday ? "bg-green-200" : "bg-gray-100"
              }`}
              onClick={() => handleDayClick(day, date)}
            >
              <div className="text-lg font-semibold">{day}</div>
              <div className="text-sm text-gray-500">{dateStr}</div>
            </div>
          );
        })}
      </div>

      {/* Izbran dan, vrsta odsotnosti in opis */}
      {selectedDay && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Izbrani dan: {selectedDay}</h3>

          <label className="block text-sm font-medium mb-2">Vrsta odsotnosti</label>
          <select
            name="absenceType"
            value={absenceData.absenceType || ""} // Prepreči predizbran tip
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Izberi vrsto odsotnosti
            </option>
            <option value="bolniska">Bolniška</option>
            <option value="dopust">Dopust</option>
            <option value="neplacan dopust">Neplačan dopust</option>
            <option value="varstvo otrok">Varstvo otrok</option>
          </select>

          <label className="block text-sm font-medium mt-4 mb-2">Opis (neobvezno)</label>
          <textarea
            name="description"
            value={absenceData.description || ""}
            onChange={handleInputChange}
            placeholder="Dodaj opis odsotnosti (neobvezno)"
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* Gumb za shranjevanje */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg hover:bg-blue-600 transition duration-300"
      >
        Shrani
      </button>
    </form>
  );
};

export default AbsenceForm;
