import { useState, useEffect } from 'react';

export default function MyHours() {
  const [workLogs, setWorkLogs] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM format

  const fetchWorkLogs = () => {
    fetch(`/api/work-logs?month=${month}`)
      .then((res) => res.json())
      .then((data) => setWorkLogs(data));
  };

  useEffect(() => {
    fetchWorkLogs();
  }, [month]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Moje ure</h1>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Izberi mesec:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Datum</th>
            <th className="border p-2">Začetek</th>
            <th className="border p-2">Konec</th>
            <th className="border p-2">Odmor</th>
          </tr>
        </thead>
        <tbody>
          {workLogs.map((log) => (
            <tr key={log.id}>
              <td className="border p-2">{log.date}</td>
              <td className="border p-2">{log.startTime}</td>
              <td className="border p-2">{log.endTime}</td>
              <td className="border p-2">{log.breakStart} - {log.breakEnd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
