import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../NavBar/NavBar';
import './lessonView.css';

interface LessonPageData {
  lessonpage_id: number;
  lesson_id: number;
  page_number: number;
  content_path: string;
  content?: string; // Optional, if backend resolves content
}

interface LessonData {
  lesson_id: number;
  title: string;
  description: string;
  pages: LessonPageData[];
  totalPages: number;
}

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
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch lesson metadata
        const lessonResponse = await axios.get<LessonData>(
          `http://localhost:5000/api/lessons/${lessonIdNum}`,
          { withCredentials: true }
        );
        const lessonData = {
          ...lessonResponse.data,
          totalPages: lessonResponse.data.pages.length
        };
        setLesson(lessonData);

        // Fetch page data
        const pageResponse = await axios.get<LessonPageData>(
          `http://localhost:5000/api/lessons/${lessonIdNum}/pages/${pageNum}`,
          { withCredentials: true }
        );
        setCurrentPage(pageResponse.data);

        // Fetch content from content_path (assuming it's a server-accessible file)
        const contentResponse = await axios.get(
          `http://localhost:5000/api/lessons/${pageResponse.data.content_path}`,
          { withCredentials: true }
        );
        setPageContent(contentResponse.data);

        // Calculate progress and update user progress
        setProgress((pageNum / lessonData.totalPages) * 100);
        await updateUserProgress(lessonIdNum, pageNum, lessonData.totalPages);

        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.message || 'Failed to load lesson data');
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonIdNum, pageNum]);

  const updateUserProgress = async (lessonId: number, pageNumber: number, totalPages: number) => {
    try {
      const isLastPage = pageNumber === totalPages;
      const status = isLastPage ? 'complete' : 'incomplete';
      await axios.post(
        `http://localhost:5000/api/lessons/progress/${lessonIdNum}/${lessonId}`,
        { currentPage: pageNumber, status },
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const navigateToPage = (newPageNum: number) => {
    if (lesson && newPageNum >= 1 && newPageNum <= lesson.totalPages) {
      navigate(`/lesson/${lessonIdNum}/${newPageNum}`);
    }
  };

  const handlePrevious = () => navigateToPage(pageNum - 1);
  const handleNext = () => navigateToPage(pageNum + 1);
  const handleComplete = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/lessons/progress/${lessonIdNum}/${lessonIdNum}`,
        { currentPage: pageNum, status: 'complete' },
        { withCredentials: true }
      );
      navigate('/lessons');
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