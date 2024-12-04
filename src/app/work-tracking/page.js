import { useState, useEffect } from 'react';
import WorkTrackingForm from '../../components/WorkTrackingForm';

export default function WorkTracking() {
  const [workLogs, setWorkLogs] = useState([]);

  // Fetch work logs on load
  useEffect(() => {
    fetch('/api/work-logs')
      .then((res) => res.json())
      .then((data) => setWorkLogs(data));
  }, []);

  const addWorkLog = (log) => {
    fetch('/api/work-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    })
      .then((res) => res.json())
      .then((newLog) => setWorkLogs([...workLogs, newLog]));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Beleženje delovnega časa</h1>
      <WorkTrackingForm onSubmit={addWorkLog} />
      <div className="mt-8">
        <h2 className="text-xl font-bold">Zgodovina beleženja</h2>
        <ul className="space-y-4">
          {workLogs.map((log) => (
            <li key={log.id} className="border p-4 rounded">
              <p><strong>Datum:</strong> {log.date}</p>
              <p><strong>Začetek:</strong> {log.startTime}</p>
              <p><strong>Konec:</strong> {log.endTime}</p>
              {log.breakStart && log.breakEnd && (
                <p><strong>Odmor:</strong> {log.breakStart} - {log.breakEnd}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
