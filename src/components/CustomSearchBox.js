import React, { useState, useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine, hits = [], clearHits, onNewCompany }) => {
  const [newCompany, setNewCompany] = useState('');

  useEffect(() => {
    console.log("Current refinement (query):", currentRefinement);
    console.log("Hits (suggested companies):", hits); // Debugging: log hits to check if data is coming through
  }, [currentRefinement, hits]);

  const handleInputChange = (e) => {
    refine(e.target.value); // This triggers the search
  };

  const handleCompanyClick = (company) => {
    refine(company);
    setNewCompany(''); // Clear new company field on selection
  };

  const handleNewCompanySubmit = () => {
    if (newCompany.trim()) {
      onNewCompany(newCompany);
      setNewCompany(''); // Clear new company field after submission
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={currentRefinement}
        onChange={handleInputChange}
        placeholder="Search for company..."
        autoFocus
      />

      {/* Show hits only if there is user input */}
      <div>
        {currentRefinement && hits.length > 0 ? (
          <div className="suggestions">
            {hits.map((hit) => (
              <div key={hit.objectID}>
                <button
                  onClick={() => handleCompanyClick(hit.name)}
                  style={{ display: 'block', margin: '5px 0', cursor: 'pointer' }}
                >
                  {hit.name}
                </button>
              </div>
            ))}
          </div>
        ) : currentRefinement.length > 0 ? (
          <p>No results found</p>
        ) : null}
      </div>

      {/* New company section */}
      <div>
        <input
          type="text"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder="Or enter a new company"
        />
        <button onClick={handleNewCompanySubmit}>Add New Company</button>
      </div>
      <button onClick={clearHits} style={{ marginTop: '10px' }}>Clear Search</button>
    </div>
  );
});

export default CustomSearchBox;
