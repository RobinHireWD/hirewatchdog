import React, { useState, useEffect } from 'react';
import './CompanyInsight.css'; // Import your CSS file for styling
import noResultsImage from '../assets/no company found.png'; // Adjust the path if necessary

const CompanyInsight = () => {
  const [companyInsights, setCompanyInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('high-to-low');

  // Fetch company insights from the server
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Filter and sort company insights
  const filteredAndSortedInsights = companyInsights
    .filter((company) =>
      company.name.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortOrder === 'high-to-low') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  // Render loading, error, and insights
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
            <select
              id="sort"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="high-to-low">High to Low</option>
              <option value="low-to-high">Low to High</option>
            </select>
          </div>
        </div>

        <div className="company-card-list">
          {filteredAndSortedInsights.length === 0 ? (
            <div className="no-results">
              <img
                src={noResultsImage} // Use the imported image
                alt="No companies found"
                className="no-results-image"
              />
            </div>
          ) : (
            filteredAndSortedInsights.map((company) => (
              <div key={company.id} className="company-card">
                <div className="company-card-left">
                  <h2>{company.name || 'N/A'}</h2>
                  <p>{company.country || 'Unknown Country'}</p>
                  <div className="rating-circle">
                    <p>{company.rating !== null && company.rating !== undefined ? company.rating.toFixed(1) : 'N/A'}</p>
                    <span>Overall Rating</span>
                  </div>
                </div>
                <div className="company-card-right">
                  <div className="hiring-info">
                    <div className="info-item">
                      <p>Average Job Online Time (Weeks)</p>
                      <p className="green">{company.avglistingduration !== null && company.avglistingduration !== undefined ? company.avglistingduration.toFixed(1) : 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <p>Average Feedback Time (Weeks)</p>
                      <p className="yellow">{company.avgfeedbacktime !== null && company.avgfeedbacktime !== undefined ? company.avgfeedbacktime.toFixed(1) : 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <p>Number of Feedbacks</p>
                      <p className="blue">{company.num_feedback !== null && company.num_feedback !== undefined ? company.num_feedback : 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <p>Ghost Job Probability</p>
                      <p className="red">{company.ghostjobprobability !== null && company.ghostjobprobability !== undefined ? (company.ghostjobprobability * 100).toFixed(1) : 'N/A'}%</p>
                    </div>
                  </div>
                  <div className="application-info">
                    <p>Number of Applications: {company.numapplicants || 'N/A'}</p>
                    <p>Number of Rejections: {company.numrejection || 'N/A'}</p>
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
