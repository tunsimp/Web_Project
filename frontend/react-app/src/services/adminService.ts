import axios from 'axios';

export interface LessonData {
  id: number;
  title: string;
  description: string;
}

export const adminService = {
  // Fetch all lessons
  fetchLessons: async (): Promise<LessonData[]> => {
    try {
      const response = await axios.get('http://localhost:5000/api/lessons', { withCredentials: true });
      
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
      await axios.delete(`http://localhost:5000/api/lessons/${id}`, { withCredentials: true });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw new Error('Failed to delete lesson. Please try again later.');
    }
  },

  // Additional methods can be added here for creating or updating lessons
  // Example:
  // createLesson: async (lessonData: Omit<LessonData, 'id'>): Promise<LessonData> => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/lessons', lessonData, { withCredentials: true });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error creating lesson:", error);
  //     throw new Error('Failed to create lesson. Please try again later.');
  //   }
  // },
  //
  // updateLesson: async (id: number, lessonData: Partial<LessonData>): Promise<LessonData> => {
  //   try {
  //     const response = await axios.put(`http://localhost:5000/api/lessons/${id}`, lessonData, { withCredentials: true });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error updating lesson:", error);
  //     throw new Error('Failed to update lesson. Please try again later.');
  //   }
  // }
};