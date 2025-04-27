import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import axios from "axios";
import LessonCards from "./LessonCards";
import "./lesson.css";

// Define interfaces for type safety
interface LessonData {
  lesson_id: string;
  title: string;
  description: string;
  status: 'complete' | 'incomplete';
  current_page: number;
  last_accessed: string | null;
}

// Helper function to trim text to approximately 30 words
const trimDescription = (text: string, wordLimit: number = 20): string => {
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  
  return words.slice(0, wordLimit).join(' ') + '...';
};

const Paths = () => {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Use the new endpoint for lessons with progress
        const response = await axios.get("http://localhost:5000/api/lessons/user/progress", { 
          withCredentials: true 
        });
        
        setLessons(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons. Please try again later.");
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  if (loading) return <div className="loading-container">Loading lessons...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Separate lessons into categories
  const inProgressLessons = lessons.filter(
    lesson => lesson.current_page > 1 && lesson.status === 'incomplete'
  );
  
  const notStartedLessons = lessons.filter(
    lesson => lesson.current_page === 1 && lesson.status === 'incomplete'
  );
  
  const completedLessons = lessons.filter(
    lesson => lesson.status === 'complete'
  );

  return (
    <>
      <Navbar />
      <div className="lessons-section">
        <h1 className="lessons-heading">Learning Path</h1>
        
        {inProgressLessons.length > 0 && (
          <div className="lessons-group">
            <h2>Continue Learning</h2>
            <div className="lessons-container">
              {inProgressLessons.map((lesson) => (
                <LessonCards 
                  key={lesson.lesson_id}
                  lesson_title={lesson.title}
                  lesson_description={trimDescription(lesson.description)}
                  lesson_id={lesson.lesson_id}
                  status={lesson.status}
                  current_page={lesson.current_page}
                />
              ))}
            </div>
          </div>
        )}
        
        {notStartedLessons.length > 0 && (
          <div className="lessons-group">
            <h2>Available Lessons</h2>
            <div className="lessons-container">
              {notStartedLessons.map((lesson) => (
                <LessonCards 
                  key={lesson.lesson_id}
                  lesson_title={lesson.title}
                  lesson_description={trimDescription(lesson.description)}
                  lesson_id={lesson.lesson_id}
                  status={lesson.status}
                />
              ))}
            </div>
          </div>
        )}
        
        {completedLessons.length > 0 && (
          <div className="lessons-group">
            <h2>Completed Lessons</h2>
            <div className="lessons-container">
              {completedLessons.map((lesson) => (
                <LessonCards 
                  key={lesson.lesson_id}
                  lesson_title={lesson.title}
                  lesson_description={trimDescription(lesson.description)}
                  lesson_id={lesson.lesson_id}
                  status={lesson.status}
                />
              ))}
            </div>
          </div>
        )}
        
        {lessons.length === 0 && (
          <div className="no-lessons">No lessons available at this time.</div>
        )}
      </div>
    </>
  );
};

export default Paths;