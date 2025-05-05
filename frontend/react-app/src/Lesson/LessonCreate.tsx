import { useState } from 'react';
import './LessonCreate.css';
import Navbar from '../NavBar/NavBar';
import lessonService from '../services/lessonService';

const LessonCreate = () => {
  // State for lesson title and description
  const [lesson, setLesson] = useState({
    title: '',
    description: ''
  });

  // State for lesson pages (each with a page_number)
  const [lessonPages, setLessonPages] = useState([
    { page_number: 1 }
  ]);

  // State to store selected files
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([null]);

  // State for loading and response messages
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: '', message: '' });

  // Handle changes to lesson title and description
  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLesson({
      ...lesson,
      [name]: value
    });
  };

  // Handle file selection for a specific page
  const handlePageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "file" && e.target.files && e.target.files[0]) {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[index] = e.target.files[0];
      setSelectedFiles(newSelectedFiles);
    }
  };

  // Add a new page
  const addPage = () => {
    setLessonPages([
      ...lessonPages,
      { page_number: lessonPages.length + 1 }
    ]);
    setSelectedFiles([...selectedFiles, null]);
  };

  // Remove a page (keep at least one page)
  const removePage = (index: number) => {
    if (lessonPages.length > 1) {
      const updatedPages = lessonPages.filter((_, i) => i !== index);
      updatedPages.forEach((page, idx) => {
        page.page_number = idx + 1; // Reassign page numbers
      });
      setLessonPages(updatedPages);
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await lessonService.createLesson(
        lesson.title,
        lesson.description,
        lessonPages,
        selectedFiles
      );
      setResponseMessage({ 
        type: 'success', 
        message: 'Lesson created successfully!' 
      });
    } catch (error: any) {
      setResponseMessage({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create lesson.'
      });
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="lesson-create-container">
        <div className="lesson-create-content">
          <h1 className="lesson-create-title">Create New Lesson</h1>
          
          {responseMessage.message && (
            <div className={`response-message ${responseMessage.type}`}>
              {responseMessage.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="lesson-form">
            <div className="section-container">
              <h2 className="section-title">Lesson Details</h2>
              <div className="form-group">
                <label htmlFor="title">Lesson Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={lesson.title}
                  onChange={handleLessonChange}
                  required
                  disabled={isLoading}
                  className="lesson-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Lesson Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={lesson.description}
                  onChange={handleLessonChange}
                  rows={4}
                  required
                  disabled={isLoading}
                  className="lesson-textarea"
                />
              </div>
            </div>

            <div className="section-container">
              <h2 className="section-title">Lesson Pages</h2>
              {lessonPages.map((page, index) => (
                <div key={index} className="lesson-page-card">
                  <h3 className="page-title">Page {page.page_number}</h3>
                  <div className="form-group">
                    <label htmlFor={`file-${index}`}>Page File (HTML):</label>
                    <input
                      type="file"
                      id={`file-${index}`}
                      name="file"
                      accept=".html"
                      onChange={(e) => handlePageChange(index, e)}
                      required
                      disabled={isLoading}
                      className="file-input"
                    />
                  </div>
                  {selectedFiles[index] && (
                    <div className="file-info">
                      Selected: {selectedFiles[index]?.name}
                    </div>
                  )}
                  {lessonPages.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePage(index)} 
                      disabled={isLoading}
                      className="remove-button"
                    >
                      Remove Page
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addPage} 
                disabled={isLoading}
                className="add-button"
              >
                Add Page
              </button>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LessonCreate;