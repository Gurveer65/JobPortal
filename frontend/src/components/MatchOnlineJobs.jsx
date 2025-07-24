import React, { useEffect, useState } from 'react';
import API from '../api/api';
import '../styles/MatchOnlineJobs.css';

function MatchOnlineJobs() {
    const [resumes, setResumes] = useState([]);
    const [resumeId, setResumeId] = useState('');
    const [query, setQuery] = useState('Developer');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await API.get('resumes/');
                setResumes(res.data);
            } catch (err) {
                console.error('Failed to fetch resumes', err);
            }
        };
        fetchResumes();
    }, []);

    const handleMatch = async () => {
        setLoading(true);
        try {
            const res = await API.post(`match-online-jobs/`, {
                resume_id: resumeId,
                query: query,
            });
            setResults(res.data.results || []);
        } catch (err) {
            console.error('Error matching online jobs', err);
        }
        setLoading(false);
    };

    return (
        <div className="match-container">
            <h2 className="match-title">Match Resumes with Online Jobs</h2>

            <div className="match-form">
                <label>
                    Select Resume:
                    <select
                        value={resumeId}
                        onChange={(e) => setResumeId(e.target.value)}
                    >
                        <option value="">-- Select Resume --</option>
                        {resumes.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                                {resume.resume_name || resume.file_nameResume || `Resume ${resume.id}` }
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Job Title / Query:
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. Python Developer"
                    />
                </label>

                <button
                    onClick={handleMatch}
                    disabled={!resumeId}
                    className="match-button"
                >
                    Match Jobs
                </button>
            </div>

            {loading ? (
                <p className="loading-text">Loading Matching Jobs...</p>
            ) : results.length > 0 ? (
                <div className="jobs-container">
                    {results.map((job, idx) => (
                        <div key={idx} className="job-card">
                            <h4>{job.job_title}</h4>
                            <p className="company">{job.company}</p>
                            <p>Score: <strong>{job.score}%</strong></p>
                            <p>Matched: {job.matched_keywords.join(', ')}</p>
                            <p>Missing: {job.missing_keywords.join(', ')}</p>
                            <a
                                href={job.apply_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="apply-link"
                            >
                                Apply Now
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-results">No matching jobs found.</p>
            )}
        </div>
    );
}

export default MatchOnlineJobs;
