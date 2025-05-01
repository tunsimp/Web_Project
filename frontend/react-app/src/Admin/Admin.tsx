import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../NavBar/NavBar";
import './Admin.css';

interface LessonData {
  id: number;
  title: string;
  description: string;
}

const Admin = () => {
    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/lessons', { withCredentials: true });
                const lessonsArray = Object.keys(response.data).map(key => ({
                    id: key,
                    ...response.data[key]
                }));
                setLessons(lessonsArray);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch lessons. Please try again later.');
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/admin/lesson/${id}`);
    };
    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) { 
          try {
            await axios.delete(`http://localhost:5000/api/lessons/${id}`, { withCredentials: true });
            setLessons(lessons.filter(lesson => lesson.id !== id));
          } catch (err) {
            setError('Failed to delete lesson. Please try again later.');
            console.error("Error deleting lesson:", err);
          }
        }
      }

    return (
        <>
            <Navbar />    
            <div className="admin-container">
                <h1 className="admin-title">Admin Panel - Lesson Management</h1>
                
                {loading && (
                    <div className="loading">Loading lessons...</div>
                )}
                
                {error && (
                    <div className="error">{error}</div>
                )}

                {!loading && !error && (
                    <table className="lessons-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lessons.map(lesson => (
                                <tr key={lesson.id}>
                                    <td>{lesson.id}</td>
                                    <td>{lesson.title}</td>
                                    <td>{lesson.description}</td>
                                    <td>
                                        <button onClick={() => handleEdit(lesson.id)}>Edit</button>
                                        <button onClick={() => handleDelete(lesson.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default Admin;