import React from "react";
import "./lesson.css";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lesson_title: string;
  lesson_description: string;
  lesson_id: string;
  status: 'complete' | 'incomplete';
  current_page?: number;
}

const LessonCards = ({ 
  lesson_title, 
  lesson_description, 
  lesson_id, 
  status, 
  current_page = 1 
}: LessonCardProps) => {
  const navigate = useNavigate();
  
  const handleStartLesson = () => {
    // Navigate to the lesson page with the current page number
    navigate(`/lesson/${lesson_id}/${current_page}`);
  };
  
  // Determine button text based on lesson status and progress
  const getButtonText = () => {
    if (status === 'complete') return 'Review Lesson';
    if (current_page > 1) return 'Continue Lesson';
    return 'Start Lesson';
  };
  
  return (
    <div className={`lesson-card ${status === 'complete' ? 'completed' : ''}`}>
      {status === 'complete' && (
        <span className="completion-badge">Completed</span>
      )}
      
      <h3 className="lesson-title">{lesson_title}</h3>
      <p className="lesson-description">{lesson_description}</p>
      
      <button 
        className={`start-lesson-btn ${current_page > 1 && status !== 'complete' ? 'continue' : ''}`}
        onClick={handleStartLesson}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default LessonCards;