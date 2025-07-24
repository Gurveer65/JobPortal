import React, { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/ResumeMatchAllJobs.css'; // New or updated CSS file

function ResumeMatchAllJobs() {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await API.get('resumes/');
        setResumes(res.data);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        alert('Failed to load resumes.');
      }
    };

    fetchResumes();
  }, []);

  const handleMatchAll = async () => {
    if (!resumeId) return;

    try {
      const res = await API.get(`resumes/${resumeId}/match_jobs/`);
      const jobs = res.data.results || [];
      if (jobs.length === 0) {
        alert("No matching jobs found.");
      }
      setResults(jobs);
    } catch (err) {
      console.error("Error matching jobs:", err);
      alert("Error while matching jobs.");
    }
  };

  return (
    <div className="resume-match-container">
      <h2 className="match-header">Match Resume to All Jobs</h2>

      <div className="match-form">
        <select
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="select-resume"
        >
          <option value="">-- Select Resume --</option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.resume_name || resume.file_nameResume || `Resume ${resume.id}` }
            </option>
          ))}
        </select>

        <button
          onClick={handleMatchAll}
          className="match-button"
          disabled={!resumeId}
        >
          Match Jobs
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-section">
          <h3 className="results-title">Matching Jobs for Resume {resumeId}</h3>
          {results.map((job, index) => (
            <div key={index} className="job-card">
              <h4 className="job-title">{job.job_title}</h4>
              <p className="job-score">Score: <span>{job.match_score}%</span></p>
              <p className="job-skills">
                Matched Skills:
                {job.matched_skills && job.matched_skills.length > 0 ? (
                  <ul className="skills-list">
                    {job.matched_skills.map((skill, i) => (
                      <li key={i} className="skill-chip">{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <span> None</span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeMatchAllJobs;
