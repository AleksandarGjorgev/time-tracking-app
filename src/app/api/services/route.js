const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for API calls
export const fetchAPI = async (endpoint, method = "GET", body = null) => {
    console.log("API URL:", BASE_URL);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),  // Only add the token if it exists
      },
      body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`API request error: ${errorData.message || res.statusText}`);
  }

  return res.json();
};

// **Account API**
export const registerAccount = (data) => fetchAPI("/api/Account/register", "POST", data);
export const loginAccount = (data) => fetchAPI("/api/Account/login", "POST", data);

// **AbsenceRecord API**
export const createAbsenceLog = (data) => fetchAPI("/api/AbsenceRecord/record-absence", "POST", data);
export const getAbsenceRecords = () => fetchAPI("/api/AbsenceRecord/get-absence-records", "GET");
export const updateAbsence = (id, data) => fetchAPI(`/api/AbsenceRecord/update-absence/${id}`, "PUT", data); // Update absence record
export const deleteAbsence = (id) => fetchAPI(`/api/AbsenceRecord/delete-absence/${id}`, "DELETE"); // Delete absence record

// **Users API**
export const getUsers = () => fetchAPI("/api/Users");
export const getUser = (id) => fetchAPI(`/api/Users/${id}`);
export const createUser = (data) => fetchAPI("/api/Users", "POST", data);

// **Account Updates API**
export const updateAccount = (data) => fetchAPI("/api/Users/update", "PUT", data); // Update account details
export const changePassword = (data) => fetchAPI("/api/Users/change-password", "PUT", data); // Change password

// **WorkLogs API**
export const getWorkLogs = () => fetchAPI("/api/WorkLogs/my", "GET");  // Fetch work logs for current user
export const createWorkLog = (data) => fetchAPI("/api/WorkLogs", "POST", data);  // Create a new work log
export const deleteWorkLog = (id) => fetchAPI(`/api/WorkLogs/${id}`, "DELETE");  // Delete a specific work log
export const updateWorkLog = (id, data) => fetchAPI(`/api/WorkLogs/${id}`, "PUT", data);  // Update a specific work log
