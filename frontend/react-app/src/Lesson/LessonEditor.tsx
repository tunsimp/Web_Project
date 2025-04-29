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
}

interface Lesson {
  lesson_id: number;
  title: string;
  description: string;
  pages?: LessonPage[];
}

const LessonEditor = () => {
  const lessonID= useParams().lessonId;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (lesson) {
      setLesson({
        ...lesson,
        [id]: value
      });
    }
  };

  const handlePageContentChange = (pageId: number, value: string) => {
    if (lesson && lesson.pages) {
      const updatedPages = lesson.pages.map(page => 
        page.lessonpage_id === pageId ? { ...page, content_path: value } : page
      );
      
      setLesson({
        ...lesson,
        pages: updatedPages
      });
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
      
      // Update each page
      if (lesson.pages) {
        for (const page of lesson.pages) {
          await axios.put(`http://localhost:5000/api/lessons/pages/${page.lessonpage_id}`, {
            content_path: page.content_path
          }, { withCredentials: true });
        }
      }
      
      setMessage({ text: 'Lesson updated successfully!', type: 'success' });
      
      // Clear message after 3 seconds
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
    
    const pageNumber = lesson.pages ? Math.max(...lesson.pages.map(p => p.page_number)) + 1 : 1;
    
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
    try {
      if (page.lessonpage_id < 0) {
        // This is a new page
        const response = await axios.post(`http://localhost:5000/api/lessons/${lesson?.lesson_id}/pages`, {
          page_number: page.page_number,
          content_path: page.content_path
        }, { withCredentials: true });
        
        // Update page with real ID
        if (lesson && lesson.pages) {
          const updatedPages = lesson.pages.map(p => 
            p.page_number === page.page_number ? { ...response.data } : p
          );
          
          setLesson({
            ...lesson,
            pages: updatedPages
          });
        }
        
        setMessage({ text: 'New page created!', type: 'success' });
      } else {
        await axios.put(`http://localhost:5000/api/lessons/pages/${page.lessonpage_id}`, {
          content_path: page.content_path
        }, { withCredentials: true });
        
        setMessage({ text: 'Page updated!', type: 'success' });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving page:', error);
      setMessage({ text: 'Failed to save page', type: 'error' });
    }
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

  if (loading) return <div className="loading-container">Loading lesson data...</div>;
  if (!lesson) return <div className="error-container">No lesson found</div>;

  return (
    <>
      <Navbar />
      <div className="lesson-editor">
        <h1>Edit Lesson</h1>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="lesson-meta-data">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title" 
              value={lesson.title} 
              onChange={handleInputChange}
              required
            />
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              value={lesson.description} 
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={saving}
            className="save-button"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
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
                    <label htmlFor={`page-${page.lessonpage_id}`}>Content Path</label>
                    <textarea 
                      id={`page-${page.lessonpage_id}`}
                      value={page.content_path} 
                      onChange={(e) => handlePageContentChange(page.lessonpage_id, e.target.value)}
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-pages">No pages found for this lesson. Add one to get started.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default LessonEditor;