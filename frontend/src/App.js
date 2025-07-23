// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/HomePage';
import JobList from './components/JobList';
import ResumeUpload from './components/ResumeUpload';
import JobMatch from './components/JobMatch';
import JobPostForm from './components/JobPostForm';
import ResumeList from './components/ResumeList';
import ResumeMatchAllJobs from './components/ResumeMatchAllJobs';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import JobsPage from './components/Jobs';
import Footer from './pages/Footer';

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/jobs" element={<PrivateRoute element={<JobList />} />} />
        <Route path="/upload" element={<PrivateRoute element={<ResumeUpload />} />} />
        <Route path="/match" element={<PrivateRoute element={<JobMatch />} />} />
        <Route path="/post-job" element={<PrivateRoute element={<JobPostForm />} />} />
        <Route path="/resumes" element={<PrivateRoute element={<ResumeList />} />} />
        <Route path="/match-resume" element={<PrivateRoute element={<ResumeMatchAllJobs />} />} />
        <Route path="/online-jobs" element={<PrivateRoute element={<JobsPage />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
