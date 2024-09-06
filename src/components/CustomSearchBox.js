import React, { useState } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine, hits = [], clearHits, onNewCompany }) => {
  const [newCompany, setNewCompany] = useState('');

  const handleInputChange = (e) => {
    refine(e.target.value);
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
      <div>
        {hits.length > 0 ? (
          hits.map((hit) => (
            <div key={hit.objectID}>
              <button
                onClick={() => handleCompanyClick(hit.name)}
                style={{ display: 'block', margin: '5px 0', cursor: 'pointer' }}
              >
                {hit.name}
              </button>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
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
