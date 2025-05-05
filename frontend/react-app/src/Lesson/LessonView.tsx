import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import './lessonView.css';
import lessonService, { LessonData, LessonPageData } from '../services/lessonService';

const LessonView = () => {
  const { lessonId, pageNumber } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentPage, setCurrentPage] = useState<LessonPageData | null>(null);
  const [pageContent, setPageContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const lessonIdNum = parseInt(lessonId || '0', 10);
  const pageNum = parseInt(pageNumber || '1', 10);

  useEffect(() => {
    const loadLessonData = async () => {
      try {
        setLoading(true);

        // Fetch lesson metadata
        const lessonData = await lessonService.fetchLesson(lessonIdNum);
        setLesson(lessonData);

        // Fetch page data
        const pageData = await lessonService.fetchLessonPage(lessonIdNum, pageNum);
        setCurrentPage(pageData);

        // Fetch content from content_path
        const content = await lessonService.fetchPageContent(pageData.content_path);
        setPageContent(content);

        // Calculate progress and update user progress
        setProgress((pageNum / lessonData.totalPages) * 100);
        await lessonService.updateUserProgress(lessonIdNum, pageNum, lessonData.totalPages);

        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.message || 'Failed to load lesson data');
        setLoading(false);
      }
    };
    
    loadLessonData();
  }, [lessonIdNum, pageNum]);

  const navigateToPage = (newPageNum: number) => {
    if (lesson && newPageNum >= 1 && newPageNum <= lesson.totalPages) {
      navigate(`/lesson/${lessonIdNum}/${newPageNum}`);
    }
  };

  const handlePrevious = () => navigateToPage(pageNum - 1);
  const handleNext = () => navigateToPage(pageNum + 1);
  
  const handleComplete = async () => {
    try {
      await lessonService.updateUserProgress(lessonIdNum, pageNum, lesson?.totalPages || 0, 'complete');
      navigate('/paths');
    } catch (err) {
      console.error('Failed to mark lesson as complete:', err);
    }
  };

  if (loading) return <div className="lesson-view-loading">Loading lesson...</div>;
  if (error) return <div className="lesson-view-error">{error}</div>;
  if (!lesson || !currentPage) return <div className="lesson-view-error">Lesson not found</div>;

  return (
    <>
      <Navbar />
      <div className="lesson-view-container">
        <div className="lesson-view-header">
          <h1 className="lesson-view-title">{lesson.title}</h1>
          <div className="lesson-progress-container">
            <div className="lesson-progress-bar">
              <div
                className="lesson-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="lesson-progress-text">
              Page {pageNum} of {lesson.totalPages}
            </span>
          </div>
        </div>

        <div className="lesson-view-content" dangerouslySetInnerHTML={{ __html: pageContent }}>
        </div>

        <div className="lesson-view-navigation">
          <button
            className="lesson-nav-button prev-button"
            onClick={handlePrevious}
            disabled={pageNum === 1}
          >
            Previous
          </button>

          {pageNum === lesson.totalPages ? (
            <button
              className="lesson-nav-button complete-button"
              onClick={handleComplete}
            >
              Complete Lesson
            </button>
          ) : (
            <button
              className="lesson-nav-button next-button"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default LessonView;