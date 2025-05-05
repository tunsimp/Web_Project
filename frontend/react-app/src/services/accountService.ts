import axios from "axios";

// Define types
export type UserData = {
  user_id: string;
  user_name: string;
  user_email: string;
};

export type UpdateAccountParams = {
  user_name: string;
  user_email: string;
  new_password?: string;
};

// Service functions for account-related API calls
export const accountService = {
  // Fetch user data
  fetchUserData: async (): Promise<UserData> => {
    try {
      const response = await axios.get("http://localhost:5000/api/route/account", {
        withCredentials: true,
      });
      
      if (response.data.success) {
        return {
          user_id: response.data.user.user_id,
          user_name: response.data.user.user_name,
          user_email: response.data.user.user_email,
        };
      }
      throw new Error(response.data.message || "Failed to fetch user data");
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update account information
  updateAccount: async (params: UpdateAccountParams) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/route/update-account",
        {
          user_name: params.user_name,
          user_email: params.user_email,
          new_password: params.new_password || undefined,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        return { success: true, message: "Account updated successfully" };
      }
      throw new Error(response.data.message || "Failed to update account");
    } catch (error) {
      console.error("Error updating account:", error.response?.data || error.message);
      throw error;
    }
  }
};