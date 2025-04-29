import { useState } from 'react';
import './LessonCreate.css';

const LessonCreate = () => {
  // State for lesson details
  const [lesson, setLesson] = useState({
    title: '',
    description: ''
  });

  // State for lesson pages
  const [lessonPages, setLessonPages] = useState([
    { page_number: 1, content_path: '' }
  ]);

  // Handle change for lesson fields
  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLesson({
      ...lesson,
      [name]: value
    });
  };

  // Handle change for lesson page fields
  const handlePageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPages = [...lessonPages];
    updatedPages[index] = {
      ...updatedPages[index],
      [name]: value
    };
    setLessonPages(updatedPages);
  };

  // Add a new lesson page
  const addPage = () => {
    setLessonPages([
      ...lessonPages,
      { page_number: lessonPages.length + 1, content_path: '' }
    ]);
  };

  // Remove a lesson page
  const removePage = (index) => {
    if (lessonPages.length > 1) {
      const updatedPages = [...lessonPages];
      updatedPages.splice(index, 1);
      
      // Update page numbers after removal
      updatedPages.forEach((page, idx) => {
        page.page_number = idx + 1;
      });
      
      setLessonPages(updatedPages);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend API
    const formData = {
      lesson,
      lessonPages
    };
    
    console.log('Form submitted with data:', formData);
    
    // Reset form after submission
    setLesson({ title: '', description: '' });
    setLessonPages([{ page_number: 1, content_path: '' }]);
    
    alert('Lesson created successfully!');
  };

  return (
    <div className="lesson-create-container">
      <div className="lesson-details-section">
        <h1>Create New Lesson</h1>
        
        <form onSubmit={handleSubmit}>
          <h2>Lesson Details</h2>
          
          <div className="form-group">
            <label htmlFor="title" className="account-label">Lesson Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={lesson.title}
              onChange={handleLessonChange}
              placeholder="Enter lesson title"
              className="account-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="account-label">Lesson Description:</label>
            <textarea
              id="description"
              name="description"
              value={lesson.description}
              onChange={handleLessonChange}
              placeholder="Enter lesson description"
              className="account-input"
              rows="4"
              required
            ></textarea>
          </div>
          
          <h2>Lesson Pages</h2>
          
          {lessonPages.map((page, index) => (
            <div key={index} className="lesson-page">
              <h3>Page {page.page_number}</h3>
              
              <div className="form-group">
                <label htmlFor={`content_path-${index}`} className="account-label">Content Path:</label>
                <input
                  type="file"
                  id={`content_path-${index}`}
                  name="content_path"
                  value={page.content_path}
                  onChange={(e) => handlePageChange(index, e)}
                  placeholder="Enter content path"
                  className="account-input"
                  required
                />
              </div>
              
              {lessonPages.length > 1 && (
                <button 
                  type="button" 
                  className="remove-page-btn"
                  onClick={() => removePage(index)}
                >
                  Remove Page
                </button>
              )}
            </div>
          ))}
          
          <button type="button" className="add-page-btn" onClick={addPage}>
            Add Page
          </button>
          
          <div className="form-actions">
            <button type="submit" className="submit-btn">Create Lesson</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonCreate;