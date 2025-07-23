import React, { useState } from 'react';
import API from '../api/api';
import '../styles/JobMatch.css';

function JobMatch() {
  const [resumeId, setResumeId] = useState('');
  const [jobId, setJobId] = useState('');
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    const res = await API.post('http://localhost:8000/api/resume/match/', {
      resume_id: resumeId,
      job_id: jobId
    });
    setResult(res.data);
  };

  return (
    <div className="job-match-container">
      <h2>Match Resume with Job</h2>

      <div className="input-group">
        <input
          type="number"
          placeholder="Resume ID"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
          className="job-match-input"
        />
        <input
          type="number"
          placeholder="Job ID"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="job-match-input"
        />
        <button
          className="job-match-button"
          onClick={handleMatch}
          disabled={!resumeId || !jobId}
        >
          Check Match
        </button>
      </div>

      {result && (
        <div className="match-result">
          <p><strong>Score:</strong> {result.score}%</p>
          <p><strong>Matched Keywords:</strong> {result.matched_keywords.join(', ')}</p>
          <p><strong>Missing Keywords:</strong> {result.missing_keywords.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default JobMatch;