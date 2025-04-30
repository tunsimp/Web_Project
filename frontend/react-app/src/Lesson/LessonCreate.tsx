import { useState } from 'react';
import './LessonCreate.css'; // Assume a CSS file for styling
import Navbar from '../NavBar/NavBar'; // Assume a Navbar component exists
import axios from 'axios';

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
  const [selectedFiles, setSelectedFiles] = useState([]);

  // State for loading and response messages
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: '', message: '' });

  // Handle changes to lesson title and description
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLesson({
      ...lesson,
      [name]: value
    });
  };

  // Handle file selection for a specific page
  const handlePageChange = (index, e) => {
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
  const removePage = (index) => {
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

  // Utility function to read file content as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Read file contents for each page
      const pagesWithContent = await Promise.all(
        lessonPages.map(async (page, index) => {
          if (selectedFiles[index]) {
            const content = await readFileAsText(selectedFiles[index]);
            return { 
              page_number: page.page_number, 
              content,
              filename: selectedFiles[index].name // Include the filename
            };
          }
          return null;
        })
      );
      // Prepare data to send
      const data = {
        title: lesson.title,
        description: lesson.description,
        pages: pagesWithContent.filter(p => p !== null)
      };
      // Send POST request to server
      const response = await axios.post('http://localhost:5000/api/lessons/create', data, {
        headers: { 'Content-Type': 'application/json' }, withCredentials: true
      });
      setResponseMessage({ type: 'success', message: 'Lesson created successfully!' });
      console.log('Response:', response.data);
    } catch (error) {
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
        <h1>Create New Lesson</h1>
        {responseMessage.message && (
          <div className={`response-message ${responseMessage.type}`}>
            {responseMessage.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="lesson-form">
          <h2>Lesson Details</h2>
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
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Lesson Description:</label>
            <textarea
              id="description"
              name="description"
              value={lesson.description}
              onChange={handleLessonChange}
              rows="4"
              required
              disabled={isLoading}
            />
          </div>
          <h2>Lesson Pages</h2>
          {lessonPages.map((page, index) => (
            <div key={index} className="lesson-page-card">
              <h3>Page {page.page_number}</h3>
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
                />
                {selectedFiles[index] && (
                  <div className="file-info">
                    Selected: {selectedFiles[index].name}
                  </div>
                )}
              </div>
              {lessonPages.length > 1 && (
                <button type="button" onClick={() => removePage(index)} disabled={isLoading}>
                  Remove Page
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPage} disabled={isLoading}>
            Add Page
          </button>
          <div className="form-submit">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LessonCreate;