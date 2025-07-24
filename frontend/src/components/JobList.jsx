import React, { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/JobList.css';

function JobList() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await API.get('jobs/');
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="job-list-container">
      <h2 className="job-list-heading">Available Job Opportunities</h2>

      {jobs.length === 0 ? (
        <p className="job-list-empty">No jobs available at the moment.</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p className="skills">
                <strong>Required Skills:</strong> {job.skills_required}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
