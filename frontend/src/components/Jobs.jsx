import React from 'react';
import OnlineJob from '../components/OnlineJobs';
import MatchOnlineJob from '../components/MatchOnlineJobs';
import '../styles/Jobs.css';

function JobsPage() {
  return (
    <div className="jobs-page-container">

      <section className="job-section">
        <OnlineJob />
      </section>

      <section className="job-section">
        <MatchOnlineJob />
      </section>
    </div>
  );
}

export default JobsPage;
