import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ResumeList.css";

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/resumes/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setResumes(response.data);
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="resume-container">
      <h2 className="resume-title">Uploaded Resumes</h2>
      {resumes.length === 0 ? (
        <p className="no-resume-text">No resumes uploaded yet.</p>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              <h4 className="resume-filename">
                {resume.file_name || resume.file.split("/").pop()}
              </h4>
              <p className="resume-date">Uploaded: {formatDate(resume.uploaded_at)}</p>

              <div className="resume-actions">
                <a
                  href={resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-view-btn"
                >
                  View
                </a>
                <a
                  href={resume.file}
                  download
                  className="resume-download-btn"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList;
