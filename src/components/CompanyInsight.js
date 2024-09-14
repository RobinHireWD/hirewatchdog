import React, { useState, useEffect } from 'react';
import './CompanyInsight.css'; // Import your CSS file for styling
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import noResultsImage from '../assets/no company found.png'; // Adjust the path if necessary

const CompanyInsight = () => {
  const [companyInsights, setCompanyInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('high-to-low');
  const [hoveredCompany, setHoveredCompany] = useState(null);

  useEffect(() => {
    const fetchCompanyInsights = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/company-insights');
        if (!response.ok) throw new Error('Failed to fetch company insights');
        const data = await response.json();
        setCompanyInsights(data);
      } catch (err) {
        setError('Could not load company insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInsights();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const getRatingColor = (rating) => {
    if (rating <= 1) return '#ff0000'; // Red
    if (rating <= 2) return '#ffa500'; // Orange
    if (rating <= 3) return '#ffff00'; // Yellow
    if (rating <= 4) return '#00ff00'; // Lime
    return '#008000'; // Green
  };

  const scaleRatingToPercentage = (rating) => (rating / 5) * 100;

  const getGhostJobColor = (probability) => {
    if (probability <= 0.2) return '#008000'; // Green for 0% - 20%
    if (probability <= 0.4) return '#00ff00'; // Lime for 21% - 40%
    if (probability <= 0.6) return '#ffff00'; // Yellow for 41% - 60%
    if (probability <= 0.8) return '#ffa500'; // Orange for 61% - 80%
    return '#ff0000'; // Red for 81% - 100%
  };

  const scaleProbabilityToPercentage = (probability) => probability * 100;

  const getFeedbackTimeColor = (feedbackTime) => {
    if (feedbackTime <= 2) return '#00ff00'; // Green
    if (feedbackTime <= 4) return '#00ff00'; // Lime
    if (feedbackTime <= 6) return '#ffff00'; // Yellow
    if (feedbackTime <= 9) return '#ffa500'; // Orange
    return '#ff0000'; // Red
  };

  const scaleFeedbackTimeToPercentage = (feedbackTime) => Math.min((feedbackTime / 12) * 100, 100);

  const getJobOnlineTimeColor = (onlineTime) => {
    if (onlineTime <= 2) return '#00ff00'; // Green
    if (onlineTime <= 4) return '#ffff00'; // Yellow
    if (onlineTime <= 6) return '#ffa500'; // Orange
    return '#ff0000'; // Red
  };

  const scaleJobOnlineTimeToPercentage = (onlineTime) => Math.min((onlineTime / 12) * 100, 100);

  const getRejectionColor = (ratio) => {
    const percentage = ratio * 100;
    if (percentage <= 20) return '#00ff00'; // Green for 0% - 20%
    if (percentage <= 40) return '#00ff00'; // Lime for 21% - 40%
    if (percentage <= 60) return '#ffff00'; // Yellow for 41% - 60%
    if (percentage <= 80) return '#ffa500'; // Orange for 61% - 80%
    return '#ff0000'; // Red for 81% - 100%
  };

  const filteredAndSortedInsights = companyInsights
    .filter((company) => company.name.toLowerCase().includes(searchQuery))
    .sort((a, b) => (sortOrder === 'high-to-low' ? b.rating - a.rating : a.rating - b.rating));

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="scroll-wrapper">
      <div className="company-insight-container">
        <div className="search-sort-container">
          <div className="search-options">
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for a company..."
            />
          </div>
          <div className="sort-options">
            <label htmlFor="sort">Sort by Rating:</label>
            <select id="sort" value={sortOrder} onChange={handleSortChange}>
              <option value="high-to-low">High to Low</option>
              <option value="low-to-high">Low to High</option>
            </select>
          </div>
        </div>

        <div className="company-card-list">
          {filteredAndSortedInsights.length === 0 ? (
            <div className="no-results">
              <img
                src={noResultsImage}
                alt="No companies found"
                className="no-results-image"
              />
            </div>
          ) : (
            filteredAndSortedInsights.map((company) => (
              <div
                key={company.id}
                className="company-card"
                onMouseEnter={() => setHoveredCompany(company.id)}
                onMouseLeave={() => setHoveredCompany(null)}
              >
                <div className="company-card-left">
                  <h2>{company.name || 'N/A'}</h2>
                  <p>{company.country || 'Unknown Country'}</p>
                  <div className="rating-circle">
                    <CircularProgressbar
                      value={scaleRatingToPercentage(company.rating)}
                      text={`${company.rating !== null && company.rating !== undefined ? company.rating.toFixed(1) : 'N/A'}`}
                      strokeWidth={10}
                      styles={{
                        path: {
                          stroke: getRatingColor(company.rating),
                        },
                        text: {
                          fill: '#ffffff',
                          fontSize: '20px',
                        },
                        trail: {
                          stroke: '#ddd',
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="company-card-right">
                  <div className="hiring-info">
                    <div className="info-item">
                      <p>Average Job Online Time (Weeks)</p>
                      <div className="job-online-circle">
                        <CircularProgressbar
                          value={scaleJobOnlineTimeToPercentage(company.avglistingduration)}
                          text={`${company.avglistingduration !== null && company.avglistingduration !== undefined ? company.avglistingduration.toFixed(1) : 'N/A'}`}
                          strokeWidth={8}
                          styles={{
                            path: {
                              stroke: getJobOnlineTimeColor(company.avglistingduration),
                            },
                            text: {
                              fill: '#000000',
                              fontSize: '20px',
                            },
                            trail: {
                              stroke: '#ddd',
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="info-item feedback-time-info">
                      <p className="feedback-time-text">Average Feedback Time (Weeks)</p>
                      <div className="feedback-time-circle">
                        <CircularProgressbar
                          value={scaleFeedbackTimeToPercentage(company.avgfeedbacktime)}
                          text={`${company.avgfeedbacktime !== null && company.avgfeedbacktime !== undefined ? company.avgfeedbacktime.toFixed(1) : 'N/A'}`}
                          strokeWidth={8}
                          styles={{
                            path: {
                              stroke: getFeedbackTimeColor(company.avgfeedbacktime),
                            },
                            text: {
                              fill: '#000000',
                              fontSize: '20px',
                            },
                            trail: {
                              stroke: '#ddd',
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="info-item">
                      <p>Rejection to Application %</p>
                      <div className="rejection-circle">
                        <CircularProgressbar
                          value={scaleProbabilityToPercentage(company.rejection_to_application_ratio)}
                          text={`${(company.rejection_to_application_ratio * 100).toFixed(0)}%`}
                          strokeWidth={8}
                          styles={{
                            path: {
                              stroke: getRejectionColor(company.rejection_to_application_ratio),
                            },
                            text: {
                              fill: '#000000',
                              fontSize: '20px',
                            },
                            trail: {
                              stroke: '#ddd',
                            },
                          }}
                        />
                      </div>
                    </div>
                    <div className="info-item">
                      <p>Ghost Job Probability</p>
                      <div className="ghost-job-circle">
                        <CircularProgressbar
                          value={scaleProbabilityToPercentage(company.ghostjobprobability)}
                          text={`${(company.ghostjobprobability * 100).toFixed(0)}%`}
                          strokeWidth={8}
                          styles={{
                            path: {
                              stroke: getGhostJobColor(company.ghostjobprobability),
                            },
                            text: {
                              fill: '#000000',
                              fontSize: '20px',
                            },
                            trail: {
                              stroke: '#ddd',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInsight;
