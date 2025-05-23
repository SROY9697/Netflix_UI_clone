import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigninUp: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Signup failed");
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("/api/v1/auth/login", credentials);
      // console.log(response);
      set({ user: response.data.data, isLoggingIn: false });
      toast.success("Login successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Login failed");
      set({ user: null, isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null });
      toast.success("Logout successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Logout failed");
    }
  },
  //check if user is logged in or not in front-end
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/api/v1/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      console.log(error);
      set({ isCheckingAuth: false, user: null });
    }
  },
}));
