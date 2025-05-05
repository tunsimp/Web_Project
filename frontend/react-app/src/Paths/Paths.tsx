import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import LessonCards from "./LessonCards";
import "./lesson.css";
import lessonService, { LessonData } from "../services/lessonService";

const Paths: React.FC = () => {
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonData = await lessonService.getLessonsWithProgress();
        setLessons(lessonData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load lessons. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchLessons();
  }, []);

  if (loading) return <div>Loading lessons...</div>;
  if (error) return <div>{error}</div>;

  // Separate lessons into categories
  const inProgressLessons = lessons.filter(
    lesson => lesson.current_page && lesson.current_page > 1 && lesson.status === 'incomplete'
  );
  
  const notStartedLessons = lessons.filter(
    lesson => (!lesson.current_page || lesson.current_page === 1) && lesson.status === 'incomplete'
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
                  lesson_id={String(lesson.lesson_id)}
                  lesson_title={lesson.title}
                  lesson_description={lessonService.trimDescription(lesson.description)}
                  status={lesson.status || 'incomplete'}
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
                  lesson_id={String(lesson.lesson_id)}
                  lesson_title={lesson.title}
                  lesson_description={lessonService.trimDescription(lesson.description)}
                  status={lesson.status || 'incomplete'}
                  current_page={lesson.current_page}
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
                  lesson_id={String(lesson.lesson_id)}
                  lesson_title={lesson.title}
                  lesson_description={lessonService.trimDescription(lesson.description)}
                  status={lesson.status || 'incomplete'}
                  current_page={lesson.current_page}
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