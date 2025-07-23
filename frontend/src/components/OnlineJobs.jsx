import React, { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/OnlineJobs.css';

function OnlineJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get('online-jobs/');
      console.log("Jobs fetched:", res.data);
      setJobs(res.data.results || []);
    } catch (err) {
      console.error("Failed to fetch online jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="online-jobs-container">
      <h2 className="online-jobs-heading">Latest Online Jobs</h2>

      {loading ? (
        <p className="loading-text">Loading Jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="loading-text">No jobs found.</p>
      ) : (
        <div className="job-cards-wrapper">
          {jobs.map((job, idx) => (
            <div key={idx} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company} - {job.location}</p>
              <p className="job-description">
                {job.description?.slice(0, 150)}...
              </p>
              <a
                className="job-link"
                href={job.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OnlineJobs;
