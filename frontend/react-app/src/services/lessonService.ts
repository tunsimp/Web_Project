import axios from 'axios';
// Base URLs for API
const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface LessonPageData {
  lessonpage_id: number;
  lesson_id: number;
  page_number: number;
  content_path: string;
  content?: string;
  fileToUpload?: File; // Optional property to store the file object
}

export interface LessonData {
  lesson_id: number | string;
  title: string;
  description: string;
  pages?: LessonPageData[];
  totalPages?: number;
  status?: 'complete' | 'incomplete';
  current_page?: number;
  last_accessed?: string | null;
}

export interface LessonPage {
  lessonpage_id?: number;
  lesson_id?: number;
  page_number: number;
  content_path?: string;
  content?: string;
  fileToUpload?: File;
  filename?: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  pages: {
    page_number: number;
    content: string;
    filename: string;
  }[];
}

/**
 * Utility function to read file content as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Comprehensive Lesson Service
 */
export const lessonService = {
  /**
   * Fetch a lesson by ID
   */
  fetchLesson: async (lessonId: number): Promise<LessonData> => {
    try {
      const response = await axios.get<LessonData>(
        `${API_BASE_URL}/lessons/${lessonId}`,
        { withCredentials: true }
      );
      
      return {
        ...response.data,
        totalPages: response.data.pages?.length
      };
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  },

  /**
   * Fetch a specific page from a lesson
   */
  fetchLessonPage: async (lessonId: number, pageNumber: number): Promise<LessonPageData> => {
    try {
      const response = await axios.get<LessonPageData>(
        `${API_BASE_URL}/lessons/${lessonId}/pages/${pageNumber}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson page:', error);
      throw error;
    }
  },

  /**
   * Fetch content from content path
   */
  fetchPageContent: async (contentPath: string): Promise<string> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/lessons/${contentPath}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching page content:', error);
      throw error;
    }
  },

  /**
   * Update user progress for a lesson
   */
  updateUserProgress: async (
    lessonId: number, 
    currentPage: number, 
    totalPages: number,
    status?: 'complete' | 'incomplete'
  ): Promise<void> => {
    try {
      // If status is not provided, determine it based on whether this is the last page
      const progressStatus = status || (currentPage === totalPages ? 'complete' : 'incomplete');
      
      await axios.post(
        `${API_BASE_URL}/lessons/progress/${lessonId}`,
        { currentPage, status: progressStatus },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  },

  /**
   * Get all lessons with user progress
   */
  getLessonsWithProgress: async (): Promise<LessonData[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lessons/user/progress`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
  },

  /**
   * Helper function to trim text to approximately N words
   */
  trimDescription: (text: string, wordLimit: number = 20): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    
    return words.slice(0, wordLimit).join(' ') + '...';
  },

  /**
   * Fetch lesson data and its pages for editing
   */
  fetchLessonData: async (lessonId: string): Promise<LessonData> => {
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`, { 
      withCredentials: true 
    });
    const lessonData = response.data;
    
    // Fetch pages for this lesson
    const pagesResponse = await axios.get(`${API_BASE_URL}/lessons/${lessonData.lesson_id}/pages`, { 
      withCredentials: true 
    });
    
    return {
      ...lessonData,
      pages: pagesResponse.data
    };
  },

  /**
   * Update lesson details (title and description)
   */
  updateLessonDetails: async (lessonId: number, title: string, description: string): Promise<any> => {
    return await axios.put(`${API_BASE_URL}/lessons/${lessonId}`, {
      title,
      description
    }, { withCredentials: true });
  },

  /**
   * Create a new page for a lesson
   */
  createLessonPage: async (lessonId: number, page: LessonPage): Promise<any> => {
    let fileName = '';
    let fileContent = '';
    
    if (page.fileToUpload) {
      fileContent = await readFileAsText(page.fileToUpload);
      fileName = page.fileToUpload.name;
    }
    
    return await axios.post(`${API_BASE_URL}/lessons/${lessonId}/pages`, {
      content_path: fileName,
      content: fileContent
    }, { withCredentials: true });
  },

  /**
   * Update an existing page
   */
  updateLessonPage: async (pageId: number, page: LessonPage): Promise<any> => {
    let fileName = page.content_path;
    let fileContent = '';
    
    if (page.fileToUpload) {
      fileContent = await readFileAsText(page.fileToUpload);
      fileName = page.fileToUpload.name;
    } else {
      // If no file was uploaded, return early as there's nothing to update
      throw new Error('No changes to upload. Please select a file first.');
    }
    
    return await axios.put(`${API_BASE_URL}/lessons/pages/${pageId}`, {
      content_path: fileName,
      content: fileContent
    }, { withCredentials: true });
  },

  /**
   * Delete a lesson page
   */
  deleteLessonPage: async (pageId: number): Promise<any> => {
    return await axios.delete(`${API_BASE_URL}/lessons/pages/${pageId}`, { 
      withCredentials: true 
    });
  },

  /**
   * Create a new lesson with pages
   */
  createLesson: async (
    title: string,
    description: string,
    lessonPages: { page_number: number }[],
    selectedFiles: (File | null)[]
  ): Promise<any> => {
    try {
      // Read file contents for each page
      const pagesWithContent = await Promise.all(
        lessonPages.map(async (page, index) => {
          if (selectedFiles[index]) {
            const content = await readFileAsText(selectedFiles[index]!);
            return { 
              page_number: page.page_number, 
              content,
              filename: selectedFiles[index]!.name
            };
          }
          return null;
        })
      );
      
      // Prepare data to send
      const data: CreateLessonData = {
        title,
        description,
        pages: pagesWithContent.filter((p): p is {
          page_number: number;
          content: string;
          filename: string;
        } => p !== null)
      };
      
      // Send POST request to server
      const response = await axios.post(`${API_BASE_URL}/lessons/create`, data, {
        headers: { 'Content-Type': 'application/json' }, 
        withCredentials: true
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default lessonService;