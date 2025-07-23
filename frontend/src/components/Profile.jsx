import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Token ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleZoomChange = (e) => setZoom(Number(e.target.value));

  const handleUpload = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("profile_picture", image);

    try {
      await axios.put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Profile picture updated!");
      setPreview(null);
      setImage(null);
      fetchProfile();
    } catch (error) {
      alert("Upload failed.");
      console.error("Upload error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (image) formData.append("profile_picture", image);
    if (profile.bio) formData.append("bio", profile.bio);
    if (profile.contact_info) formData.append("contact_info", profile.contact_info);

    try {
      await axios.put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Profile updated successfully!");
      setIsEditing(false);
      setPreview(null);
      setImage(null);
      fetchProfile();
    } catch (error) {
      alert("Failed to update profile.");
      console.error("Update error:", error);
    }
  };

  if (!profile) return <p className="profile-loading">Loading profile...</p>;

  const { skill_matches = {}, matching_jobs = [] } = profile;

  return (
    <div className="profile-naukri-container">
      <div className="naukri-left-card">
        <div className="profile-avatar" onClick={handleImageClick}>
          <img
            src={preview || profile.profile_picture || "default-profile.jpg"}
            alt="Profile"
            className="avatar-img"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {preview && (
          <div className="image-preview-container">
            <h4>Adjust Zoom:</h4>
            <input
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={zoom}
              onChange={handleZoomChange}
            />
            <button onClick={handleUpload}>Save Photo</button>
          </div>
        )}

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
              <button onClick={() => setIsEditing(false)}>Cancel</button>
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
