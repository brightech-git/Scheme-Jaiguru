import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://akj.brightechsoftware.com/api/v1";

// Get auth headers dynamically
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Unified fetch wrapper (returns { success, data, error })
const request = async (url, options = {}) => {
  const authHeader = await getAuthHeader();
  const headers = { "Content-Type": "application/json", ...authHeader, ...options.headers };

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => null);

    // Check for specific error messages
    if (data?.message?.toLowerCase().includes("already exists") || data?.message?.toLowerCase().includes("invalid")) {
      return { success: false, error: data.message };
    }

    if (!response.ok) {
      return { success: false, error: data?.message || data?.error || "Something went wrong", status: response.status, details: data };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || "Network error" };
  }
};

const userService = {
  registerUser: async (userData) => {
    return request(`${API_BASE_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  verifyOtp: async (contactNumber, otp) => {
    const params = new URLSearchParams({ contactNumber, otp });
    return request(`${API_BASE_URL}/user/verify-otp?${params.toString()}`, { method: "POST" });
  },

  loginUser: async (credentials) => {
    const res = await request(`${API_BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.success && res.data?.token) {
      await AsyncStorage.setItem("authToken", res.data.token);
    }

    return res;
  },

  getUserById: async (id) => {
    const headers = await getAuthHeader();
    return request(`${API_BASE_URL}/user/getUserMasterDataById/${id}`, { headers });
  },

  getProfile: async () => {
    const headers = await getAuthHeader();
    return request(`${API_BASE_URL}/user/profile`, { headers });
  },

  forgotPassword: async (data) => {
    return request(`${API_BASE_URL}/user/forgot-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data) => {
    return request(`${API_BASE_URL}/user/reset-password`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export default userService;
