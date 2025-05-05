import axios from "axios";

export interface LabData {
  lab_id: string;
  lab_name: string;
  lab_description: string;
  difficulty: string;
  category: string;
  is_active: boolean;
  completed?: boolean;
  lab_link?: string;
}

export const labService = {
  // Fetch all labs with their status
  fetchLabs: async (): Promise<LabData[]> => {
    try {
      const response = await axios.get("http://localhost:5000/api/labs", { 
        withCredentials: true 
      });
      
      // Convert the object of labs to an array
      const labsArray = Object.keys(response.data).map(key => ({
        lab_id: key,
        ...response.data[key]
      }));
      
      return labsArray;
    } catch (error) {
      console.error("Error fetching labs:", error);
      throw new Error("Failed to load labs. Please try again later.");
    }
  },

  // Create container for a lab
  createContainer: async (labinfo_id: string): Promise<{ lab_link: string }> => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/labs/create-container",
        { labinfo_id },
        { withCredentials: true }
      );
      
      return {
        lab_link: response.data.lab_link
      };
    } catch (error) {
      console.error("Error creating container:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create container");
    }
  },

  // Delete container
  deleteContainer: async (): Promise<void> => {
    try {
      await axios.post(
        "http://localhost:5000/api/labs/delete-container",
        {}, // Empty payload since no data is needed
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error deleting container:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to delete container");
    }
  },

  // Verify flag
  verifyFlag: async (labinfo_id: string, flag: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/labs/verify-flag?labinfo_id=${labinfo_id}&flag=${flag}`,
        { withCredentials: true }
      );
      
      return {
        success: response.data.success,
        message: response.data.message || (response.data.success ? "Flag submitted successfully!" : "Incorrect flag. Try again!")
      };
    } catch (error) {
      console.error("Error submitting flag:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to submit flag");
    }
  }
};