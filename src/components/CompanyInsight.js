import React, { useState, useEffect } from 'react';
import './CompanyInsight.css'; // Import your CSS file for styling

const CompanyInsight = () => {
  const [companyInsights, setCompanyInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company insights from the server
  useEffect(() => {
    const fetchCompanyInsights = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/company-insights');
        if (!response.ok) throw new Error('Failed to fetch company insights');
        const data = await response.json();
        setCompanyInsights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInsights();
  }, []);

  // Render loading, error, and insights
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="company-insight-container">
      <h1>Company Insights</h1>
      <div className="company-card-list">
        {companyInsights.map((company) => (
          <div key={company.id} className="company-card">
            <div className="company-card-left">
              <h2>{company.name || 'N/A'}</h2>
              <p>{company.country || 'Unknown Country'}</p>
              <div className="rating-circle">
                <p>{(company.rating !== undefined ? company.rating.toFixed(1) : 'N/A')}</p>
                <span>Overall Rating</span>
              </div>
            </div>
            <div className="company-card-right">
              <div className="hiring-info">
                <div className="info-item">
                  <p>Average Job Online Time (Weeks)</p>
                  <p className="green">{(company.avgOnlineTime !== undefined ? company.avgOnlineTime.toFixed(1) : 'N/A')}</p>
                </div>
                <div className="info-item">
                  <p>Average Feedback Time (Weeks)</p>
                  <p className="yellow">{(company.avgfeedbacktime !== undefined ? company.avgfeedbacktime.toFixed(1) : 'N/A')}</p>
                </div>
                <div className="info-item">
                  <p>Number of Feedbacks</p>
                  <p className="blue">{(company.num_feedback !== undefined ? company.num_feedback : 'N/A')}</p>
                </div>
                <div className="info-item">
                  <p>Ghost Job Probability</p>
                  <p className="red">{(company.ghostjobprobability !== undefined ? (company.ghostjobprobability * 100).toFixed(1) : 'N/A')}%</p>
                </div>
              </div>
              <div className="application-info">
                <p>Number of Applications: {company.numapplicants || 'N/A'}</p>
                <p>Number of Rejections: {company.numrejections || 'N/A'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyInsight;
