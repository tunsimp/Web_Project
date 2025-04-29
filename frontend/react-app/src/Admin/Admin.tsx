import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../NavBar/NavBar";
import './Admin.css';
const Admin = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axios.get('http://localhost:5000/api/lessons',{withCredentials: true});
                // Transform the response data to array format for easier rendering
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
                                    <td><button>Edit</button><button>Delete</button></td>
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