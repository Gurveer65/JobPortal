// src/components/JobPostForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/JobPostForm.css'; 

const JobPostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to post a job.');
      return;
    }

    try {
      const response = await axios.post(
        'https://backend-0ddt.onrender.com/api/jobs/',
        {
          title,
          description,
          skills_required: skillsRequired,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert('Job posted successfully!');
      setTitle('');
      setDescription('');
      setSkillsRequired('');
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
      alert('Failed to post job.');
    }
  };

  return (
    <div className="job-form-container">
      <h2 className="job-form-title">Post a Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="job-input"
          required
        />
        <textarea
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="job-textarea"
          required
        />
        <input
          type="text"
          placeholder="Skills Required (comma separated)"
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          className="job-input"
        />
        <button type="submit" className="job-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;
