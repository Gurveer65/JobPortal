import React, { useState } from 'react';
import API from '../api/api';
import '../styles/ResumeUpload.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await API.post('resumes/upload/', formData);
      setSkills(res.data.skills || []);
      setSuccessMsg("Resume uploaded successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume");
      setSkills([]);
      setSuccessMsg("");
    }
  };

  // Create a short string from skills
  const getTrimmedSkills = () => {
    const skillStr = skills.join(', ');
    return skillStr.length > 200
      ? `${skillStr.slice(0, 200)}...`
      : skillStr;
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Your Resume</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="upload-button"
      >
        Upload Resume
      </button>

      <div className="result-container">
        {error && <p className="error-message">{error}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}
        {skills.length > 0 && (
          <>
            <h3 className="skills-title">Extracted Skills:</h3>
            <p className="skills-snippet">{getTrimmedSkills()}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
