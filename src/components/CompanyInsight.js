import React, { useState, useEffect } from 'react';
import './CompanyInsight.css'; // Import your CSS file for styling

const CompanyInsight = () => {
  const [companyInsights, setCompanyInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('high-to-low'); // Default sort order
  const [searchQuery, setSearchQuery] = useState(''); // Default search query

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

  // Handle sort option change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter and sort companyInsights based on search query and sortOrder
  const filteredAndSortedInsights = [...companyInsights]
    .filter(company => company.name.toLowerCase().includes(searchQuery))
    .sort((a, b) => {
      if (sortOrder === 'high-to-low') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortOrder === 'low-to-high') {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0;
    });

  // Render loading, error, and insights
  if (loading) return <div className="loading">Loading...</div>; // Consider adding a spinner here
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="header">
        <span>Company</span>
        <span>Insights</span>
      </div>
      <div className="company-insight-container">
        <div className="search-sort-container">
          <div className="sort-options">
            <label htmlFor="sort-by">Sort by Rating:</label>
            <select id="sort-by" value={sortOrder} onChange={handleSortChange}>
              <option value="high-to-low">High to Low</option>
              <option value="low-to-high">Low to High</option>
            </select>
          </div>
          <div className="search-options">
            <label htmlFor="search">Search:</label>
            <input
              id="search"
              type="text"
              placeholder="Enter company name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="company-card-list">
          {filteredAndSortedInsights.map((company) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInsight;
