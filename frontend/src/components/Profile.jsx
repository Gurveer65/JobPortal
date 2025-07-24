import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
  
        const response = await axios.get("https://backend-0ddt.onrender.com/api/profile/", {
          headers: {
            Authorization: `Token ${token}`, // This must match DRF token auth
          },
        });
  
        setProfile(response.data);
        if (response.data.profile_icon) {
          setPreview(response.data.profile_icon);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, []);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (profile.bio) formData.append("bio", profile.bio);
    if (profile.contact_info) formData.append("contact_info", profile.contact_info);
    if (image) formData.append("profile_icon", image);

    try {
      await axios.put("https://backend-0ddt.onrender.com/api/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      setImage(null);
      setPreview(null);
      const updated = await axios.get("https://backend-0ddt.onrender.com/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      setProfile(updated.data);
    } catch (error) {
      alert("Failed to update profile.");
      console.error("Update error:", error);
    }
  };

  if (!profile) return <p className="profile-loading">Loading profile...</p>;

  const { skill_matches = {}, matching_jobs = [] } = profile;

  const handleImageClick = () => fileInputRef.current.click();

  return (
    <div className="profile-naukri-container">
      <div className="naukri-left-card">
        <div className="profile-avatar" onClick={handleImageClick}>
          {preview || profile.profile_icon ? (
            <img
              src={preview || profile.profile_icon}
              alt="Profile"
              className="avatar-img"
            />
          ) : (
            <div className="default-icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="avatar-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="80"
                height="80"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2a5 5 0 100 10 5 5 0 000-10zm-8 18a8 8 0 1116 0H4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div className="left-basic-info">
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
          <p>User ID: {profile.id}</p>
        </div>
      </div>

      <div className="naukri-right-details">
        <div className="detail-section">
          <h3>About</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              rows={4}
            />
          ) : (
            <p>{profile.bio || "Enthusiastic and skilled individual looking to contribute to impactful projects."}</p>
          )}
        </div>

        <div className="detail-section">
          <h3>Contact Information</h3>
          {isEditing ? (
            <input
              name="contact_info"
              value={profile.contact_info || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{profile.contact_info || `Email: ${profile.email}`}</p>
          )}
        </div>

        <div className="edit-buttons">
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save Changes</button>
              <button onClick={() => {
                setIsEditing(false);
                setImage(null);
                setPreview(null);
              }}>
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="recent-activity-section">
          <h3>Recent Activity</h3>

          <div className="skill-match-container">
            {Object.entries(skill_matches).map(([skill, match]) => (
              <div
                key={skill}
                className="skill-circle"
                style={{ "--progress": match }}
                data-label={skill}
              >
                {match}%
              </div>
            ))}
          </div>

          <div className="matching-jobs-list">
            <h4>Jobs Matching Your Resume:</h4>
            {matching_jobs.length === 0 ? (
              <p>No matches found.</p>
            ) : (
              matching_jobs.map((job, index) => (
                <div key={index} className="matching-job-item">
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
