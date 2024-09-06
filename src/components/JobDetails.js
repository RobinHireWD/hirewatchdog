import React from 'react';
import { useParams } from 'react-router-dom';
import jobs from '../data/jobData';  // Import the same job data

function JobDetails() {
  const { id } = useParams();  // Get the job ID from the URL
  const job = jobs.find(job => job.id === parseInt(id));  // Find the job by ID

  if (!job) {
    return <h2>Job not found!</h2>;
  }

  return (
    <div className="JobDetails">
      <h2>{job.title}</h2>
      <p>Company: {job.company}</p>
      <p>Location: {job.location}</p>
      <p>Date Posted: {job.datePosted}</p>
      <p>Status: {job.status}</p>
      <p>Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel.</p> {/* Placeholder for job description */}
    </div>
  );
}

export default JobDetails;
