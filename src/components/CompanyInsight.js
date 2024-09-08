// src/components/CompanyInsight.js

import React, { useState, useEffect } from 'react';
import './CompanyInsight.css'; // Assuming you have a CSS file for styling

const CompanyInsight = () => {
  const [companyInsights, setCompanyInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyInsights = async () => {
      try {
        console.log('Fetching company insights from API...');
        const response = await fetch('http://localhost:5001/api/company-insights');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setCompanyInsights(data);
      } catch (error) {
        console.error('Error fetching company insights:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInsights();
  }, []);

  const handleRowClick = (company) => {
    setSelectedCompany(company);
  };

  const calculateAverageResponseTime = (applications) => {
    if (!applications || applications.length === 0) return 0;
    const totalFeedbackTime = applications.reduce((sum, app) => sum + app.feedbacktime, 0);
    return (totalFeedbackTime / applications.length / 7).toFixed(2); // Convert to weeks
  };

  const calculateGhostJobProbability = (applications) => {
    if (!applications || applications.length === 0) return 0;
    const ghostJobs = applications.filter(app => app.feedbacktime > 30 || app.jobPosts < 5).length;
    return ((ghostJobs / applications.length) * 100).toFixed(2); // Probability as a percentage
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Company Insights</h1>
      <table className="company-insight-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Is Ghost Job</th>
            <th>Feedback Time</th>
            <th>Job Posts</th>
          </tr>
        </thead>
        <tbody>
          {companyInsights.map((company) => (
            <tr key={company.id} onClick={() => handleRowClick(company)}>
              <td>{company.name}</td>
              <td>{company.rating}</td>
              <td>{company.isGhostJob ? 'Yes' : 'No'}</td>
              <td>{company.feedbacktime}</td>
              <td>{company.jobPosts !== null ? company.jobPosts : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCompany && (
        <div className="company-insight-details">
          <h2>{selectedCompany.name}</h2>
          <p><strong>Rating:</strong> {selectedCompany.rating}</p>
          <p><strong>Is Ghost Job:</strong> {selectedCompany.isGhostJob ? 'Yes' : 'No'}</p>
          <p><strong>Feedback Time:</strong> {selectedCompany.feedbacktime}</p>
          <p><strong>Job Posts:</strong> {selectedCompany.jobPosts !== null ? selectedCompany.jobPosts : 'N/A'}</p>
          
          {/* Calculate and display additional details */}
          <p><strong>Number of Applicants:</strong> {selectedCompany.applications ? selectedCompany.applications.length : 'N/A'}</p>
          <p><strong>Average Responding Time (weeks):</strong> {calculateAverageResponseTime(selectedCompany.applications || [])}</p>
          <p><strong>Ghost Job Probability (%):</strong> {calculateGhostJobProbability(selectedCompany.applications || [])}</p>
          <p><strong>Hiring Rating:</strong> {selectedCompany.rating}</p>
        </div>
      )}
    </div>
  );
};

export default CompanyInsight;
