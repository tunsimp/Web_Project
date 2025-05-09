import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';

export interface LessonData {
  id: number;
  title: string;
  description: string;
}

export const adminService = {
  // Fetch all lessons
  fetchLessons: async (): Promise<LessonData[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons`, { withCredentials: true });
      
      // Convert object response to array with id included
      const lessonsArray = Object.keys(response.data).map(key => ({
        id: key,
        ...response.data[key]
      }));
      
      return lessonsArray;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw new Error('Failed to fetch lessons. Please try again later.');
    }
  },

  // Delete a lesson by ID
  deleteLesson: async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/lessons/${id}`, { withCredentials: true });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw new Error('Failed to delete lesson. Please try again later.');
    }
  },


};