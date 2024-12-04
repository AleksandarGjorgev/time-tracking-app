import { useState } from 'react';

export default function WorkTrackingForm({ onSubmit }) {
  const [workData, setWorkData] = useState({
    startTime: '',
    endTime: '',
    breakStart: '',
    breakEnd: '',
  });

  const handleChange = (e) => {
    setWorkData({ ...workData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(workData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="time"
        name="startTime"
        value={workData.startTime}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="time"
        name="endTime"
        value={workData.endTime}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Shrani
      </button>
    </form>
  );
}
