import React from 'react';
import { Link } from 'react-router-dom';  // Import Link
import jobs from '../data/jobData';  // Import job data

function JobList() {
  return (
    <div className="JobList">
      <h2>Job Listings</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>  {/* Link to job details */}
              <h3>{job.title}</h3>
            </Link>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Date Posted: {job.datePosted}</p>
            <p>Status: {job.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
