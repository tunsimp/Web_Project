import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../NavBar/NavBar';
import { useParams } from 'react-router-dom';
import './LessonEditor.css';

interface LessonPage {
  lessonpage_id: number;
  lesson_id: number;
  page_number: number;
  content_path: string;
  fileToUpload?: File; // Optional property to store the file object
}

interface Lesson {
  lesson_id: number;
  title: string;
  description: string;
  pages?: LessonPage[];
}

const LessonEditor = () => {
  const lessonID = useParams().lessonId;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadingPageId, setUploadingPageId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/lessons/${lessonID}`, { withCredentials: true });
        const lessonData = response.data;
        
        // Fetch pages for this lesson
        const pagesResponse = await axios.get(`http://localhost:5000/api/lessons/${lessonData.lesson_id}/pages`, { 
          withCredentials: true 
        });
        
        setLesson({
          ...lessonData,
          pages: pagesResponse.data
        });
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        setMessage({ text: 'Failed to load lesson data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (lesson) {
      setLesson({
        ...lesson,
        [id]: value
      });
    }
  };

  const handleFileUpload = async (pageId: number, file: File) => {
    if (!lesson) return;
    
    // Show uploading status
    setUploadingPageId(pageId);
    
    try {
      // Store the file in state for the specific page
      if (lesson.pages) {
        const updatedPages = lesson.pages.map(page => 
          page.lessonpage_id === pageId ? { 
            ...page, 
            content_path: file.name, // Set the file name as the content_path
            fileToUpload: file       // Store the file object for later use
          } : page
        );
        
        setLesson({
          ...lesson,
          pages: updatedPages
        });
      }
      
      setMessage({ text: 'File selected. Click "Save Page" to upload.', type: 'success' });
    } catch (error) {
      console.error('Error handling file selection:', error);
      setMessage({ text: 'Failed to select file', type: 'error' });
    } finally {
      setUploadingPageId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;
    
    setSaving(true);
    try {
      // Update lesson details
      await axios.put(`http://localhost:5000/api/lessons/${lesson.lesson_id}`, {
        title: lesson.title,
        description: lesson.description
      }, { withCredentials: true });
      
      setMessage({ text: 'Lesson updated successfully!', type: 'success' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating lesson:', error);
      setMessage({ text: 'Failed to update lesson', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addNewPage = () => {
    if (!lesson) return;
    
    const pageNumber = lesson.pages ? Math.max(...lesson.pages.map(p => p.page_number), 0) + 1 : 1;
    
    setLesson({
      ...lesson,
      pages: [
        ...(lesson.pages || []),
        {
          lessonpage_id: -1, // Temporary ID until saved
          lesson_id: lesson.lesson_id,
          page_number: pageNumber,
          content_path: ''
        }
      ]
    });
  };

  const savePage = async (page: LessonPage) => {
    setUploadingPageId(page.lessonpage_id);
    
    try {
      // If there's a file to upload, read its content
      if (page.fileToUpload) {
        const fileContent = await readFileAsText(page.fileToUpload);
        const fileName = page.fileToUpload.name;
        
        if (page.lessonpage_id < 0) {
          // This is a new page
          const response = await axios.post(`http://localhost:5000/api/lessons/${lesson?.lesson_id}/pages`, {
            content_path: fileName,  // Send file name as content_path
            content: fileContent     // Send the file content
          }, { withCredentials: true });
          
          // Update page with real ID
          if (lesson && lesson.pages) {
            const updatedPages = lesson.pages.map(p => 
              p.page_number === page.page_number && p.lessonpage_id === -1 ? { 
                ...response.data,
                fileToUpload: undefined // Clear the file object
              } : p
            );
            
            setLesson({
              ...lesson,
              pages: updatedPages
            });
          }
          
          setMessage({ text: 'New page created with uploaded content!', type: 'success' });
        } else {
          // Update existing page with file content
          await axios.put(`http://localhost:5000/api/lessons/pages/${page.lessonpage_id}`, {
            content_path: fileName,  // Send file name as content_path 
            content: fileContent     // Send the file content
          }, { withCredentials: true });
          
          // Update the page in state to remove the file object
          if (lesson && lesson.pages) {
            const updatedPages = lesson.pages.map(p => 
              p.lessonpage_id === page.lessonpage_id ? { 
                ...p,
                content_path: fileName, // Update content path with the file name
                fileToUpload: undefined // Clear the file object
              } : p
            );
            
            setLesson({
              ...lesson,
              pages: updatedPages
            });
          }
          
          setMessage({ text: 'Page updated with uploaded content!', type: 'success' });
        }
      } else if (page.lessonpage_id < 0) {
        // New page without file
        const response = await axios.post(`http://localhost:5000/api/lessons/${lesson?.lesson_id}/pages`, {
          page_number: page.page_number,
          content_path: '',
          content: "" // Empty content
        }, { withCredentials: true });
        
        // Update page with real ID
        if (lesson && lesson.pages) {
          const updatedPages = lesson.pages.map(p => 
            p.page_number === page.page_number && p.lessonpage_id === -1 ? { ...response.data } : p
          );
          
          setLesson({
            ...lesson,
            pages: updatedPages
          });
        }
        
        setMessage({ text: 'New page created!', type: 'success' });
      } else {
        // Update page without file (no change to content)
        setMessage({ text: 'No changes to upload. Please select a file first.', type: 'error' });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving page:', error);
      setMessage({ text: 'Failed to save page', type: 'error' });
    } finally {
      setUploadingPageId(null);
    }
  };
  
  // Helper function to read file content as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const deletePage = async (pageId: number) => {
    if (!lesson || !lesson.pages) return;
    
    try {
      if (pageId > 0) { // Only make API call if it's an existing page
        await axios.delete(`http://localhost:5000/api/lessons/pages/${pageId}`, { 
          withCredentials: true 
        });
      }
      
      // Update state to remove the page
      const updatedPages = lesson.pages.filter(page => page.lessonpage_id !== pageId);
      
      setLesson({
        ...lesson,
        pages: updatedPages
      });
      
      setMessage({ text: 'Page deleted successfully!', type: 'success' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting page:', error);
      setMessage({ text: 'Failed to delete page', type: 'error' });
    }
  };

  if (loading) return <div className="page-container"><div className="loading-container">Loading lesson data...</div></div>;
  if (!lesson) return <div className="page-container"><div className="error-container">No lesson found</div></div>;

  return (
    <>
    <Navbar />
    <div className="page-wrapper">
      <div className="page-container">
        <div className="lesson-editor">
          <h1>Edit Lesson</h1>
          
          {message && (
            <div className={`message ${message.type}`} style={{ maxWidth: "900px", width: "100%" }}>
              {message.text}
            </div>
          )}
          
          <div className="lesson-content-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="lesson-meta-data">
              <h2>Lesson Informations</h2>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input 
                    type="text" 
                    id="title" 
                    value={lesson.title} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea 
                    id="description" 
                    value={lesson.description} 
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="button-container">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="save-button"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
            
            <div className="pages-section">
              <h2>Lesson Pages</h2>
              <button 
                onClick={addNewPage}
                className="add-page-button"
              >
                Add New Page
              </button>
              
              {lesson.pages && lesson.pages.length > 0 ? (
                <div className="pages-list">
                  {lesson.pages
                    .sort((a, b) => a.page_number - b.page_number)
                    .map(page => (
                    <div key={page.lessonpage_id} className="page-item">
                      <div className="page-header">
                        <h3>Page {page.page_number}</h3>
                        <div className="page-actions">
                          <button 
                            onClick={() => savePage(page)}
                            className="save-page-button"
                          >
                            Save Page
                          </button>
                          <button 
                            onClick={() => deletePage(page.lessonpage_id)}
                            className="delete-page-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Current Content Path</label>
                        <p className="current-path">{page.content_path || 'No file uploaded yet'}</p>
                        
                        <label htmlFor={`page-${page.lessonpage_id}`}>Upload HTML Content</label>
                        <div className="file-upload-container">
                          <input 
                            type="file"
                            id={`page-${page.lessonpage_id}`}
                            accept='.html'
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(page.lessonpage_id, e.target.files[0]);
                              }
                            }}
                          />
                          {page.fileToUpload && (
                            <span className="file-selected">File selected: {page.fileToUpload.name}</span>
                          )}
                          {uploadingPageId === page.lessonpage_id && (
                            <span className="uploading-indicator">Uploading...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-pages">No pages found for this lesson. Add one to get started.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LessonEditor;