import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import API from "../api/api";
import {
  FiSearch,
  FiGlobe,
  FiGrid,
  FiUserCheck,
  FiUpload,
  FiArrowRightCircle,
  FiActivity,
} from "react-icons/fi";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";

const Home = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const [jobs, setJobs] = useState([]);

  const requireLogin = (path) => {
    if (!loggedIn) {
      alert("Please log in to access this feature.");
      return;
    }
    navigate(path);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get("/jobs/");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const featureSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,              // Auto scroll enabled
    autoplaySpeed: 2000,         // Delay between slides
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-icon">
        <FontAwesomeIcon icon={faUserTie} className="fa-icon" />
        </div>
        <h1>Find Your Dream Job Now</h1>
        <p className="hero-subtitle">
          Search thousands of jobs, internships, and career opportunities.
        </p>
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Enter skills / designations / companies"
          />
          <input
            type="text"
            className="search-input"
            placeholder="Location"
          />
          <button className="search-button" disabled={!loggedIn}>
            Search
          </button>
        </div>
      </section>

      {/* Popular Jobs Section */}
      <section className="category-section">
        <h2 className="section-title">Popular Jobs</h2>
        <div className="categories">
          {jobs.length > 0 ? (
            jobs.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="category-card"
                onClick={() => requireLogin(`/job-detail/${job.id}`)}
              >
                <h4>{job.title}</h4>
                <p>{job.description}</p>
                {job.skills && job.skills.length > 0 && (
                  <div className="skills">
                    <strong>Skills:</strong> {job.skills.join(", ")}
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="category-card" onClick={() => requireLogin("/upload")}>
                <h4>IT Jobs</h4>
                <p>Developer, Engineer, Analyst</p>
              </div>
              <div className="category-card" onClick={() => requireLogin("/post-job")}>
                <h4>Marketing Jobs</h4>
                <p>SEO, SEM, Content</p>
              </div>
              <div className="category-card" onClick={() => requireLogin("/match-resume")}>
                <h4>Remote Jobs</h4>
                <p>Work from anywhere</p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Website Features Carousel */}
      <section className="features-section">
        <h2 className="section-title">Website Features</h2>
        <Slider {...featureSettings}>
          <div className="feature-card">
            <FiUserCheck size={40} className="feature-icon" onClick={() => requireLogin("/match-resume")}/>
            <h4>Match All Jobs</h4>
            <p>Automatically find jobs based on your resume.</p>
          </div>
          <div className="feature-card">
            <FiGlobe size={40} className="feature-icon" onClick={() => requireLogin("/online-jobs")}/>
            <h4>Online Jobs</h4>
            <p>Find remote or work-from-home opportunities.</p>
          </div>
          <div className="feature-card">
            <FiGrid size={40} className="feature-icon" 
            onClick={() => requireLogin("/profile")}/>
            <h4>Dashboard</h4>
            <p>Track your applications and saved jobs.</p>
          </div>
          <div className="feature-card">
            <FiSearch size={40} className="feature-icon" />
            <h4>Personalized Search</h4>
            <p>Use AI filters to get the best job matches.</p>
          </div>
          <div
            className="feature-card"
            onClick={() => requireLogin("/resumes")}>
            <FiUserCheck size={40} className="feature-icon" />
            <h4>Check Resume Score</h4>
            <p>Analyze and improve your resume with instant scoring.</p>
          </div>
        </Slider>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FiUpload className="feature-icon" onClick={() => requireLogin("/upload")}/>
            <h4>Upload Resume</h4>
            <p>Start by uploading your latest resume.</p>
          </div>
          <div className="feature-card">
            <FiSearch className="feature-icon"   onClick={() => requireLogin("/match-resume")}/>
            <h4>Get Matched</h4>
            <p>We scan your resume and match you with jobs.</p>
          </div>
          <div className="feature-card">
            <FiArrowRightCircle className="feature-icon"  onClick={() => requireLogin("/online-jobs")}/>
            <h4>Apply Instantly</h4>
            <p>Send applications with one click.</p>
          </div>
          <div className="feature-card">
            <FiActivity className="feature-icon" onClick={() => requireLogin("/profile")}/>
            <h4>Track Applications</h4>
            <p>Monitor your application status in real-time.</p>
          </div>
        </div>
      </section>

      {/* User Stats */}
      <section className="user-stats">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <h3>10,000+</h3>
            <p>Jobs Posted</p>
          </div>
          <div className="stat-box">
            <h3>5,000+</h3>
            <p>Resumes Matched</p>
          </div>
          <div className="stat-box">
            <h3>200+</h3>
            <p>Companies Onboard</p>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "I landed my dream job within a week! The resume matcher is a game changer."
            </p>
            <strong>- Priya Sharma</strong>
          </div>
          <div className="testimonial-card">
            <p>
              "As a recruiter, it's the easiest way to find the right candidates quickly."
            </p>
            <strong>- Raj Mehta</strong>
          </div>
        </div>
      </section>

      {/* Quick Access
      <section className="quick-access">
        <h2 className="section-title">Quick Access</h2>
        <ul className="quick-list">
          <li onClick={() => requireLogin("/upload")}>Upload Resume</li>
          <li onClick={() => requireLogin("/post-job")}>Post a Job</li>
          <li onClick={() => requireLogin("/match-resume")}>
            Match Resume to Jobs
          </li>
        </ul>
      </section> */}
    </div>
  );
};

export default Home;
