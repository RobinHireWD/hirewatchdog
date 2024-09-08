import React, { useState, useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

const CustomSearchBox = connectSearchBox(({ currentRefinement, refine, hits = [], onNewCompany, isSuggestionsVisible }) => {
  const [inputValue, setInputValue] = useState(currentRefinement || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refine(inputValue);
    }, 300); // Delay by 300ms

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout
  }, [inputValue, refine]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Update inputValue state
    refine(value); // This triggers the search
  };

  const handleCompanyClick = (company) => {
    setInputValue(company);
    refine(company);
    onNewCompany(company); // Notify parent component
  };

  const handleClearSearch = () => {
    setInputValue(''); // Clear input value
    refine(''); // Clear search refinement
    onNewCompany(''); // Notify parent component of clearing
  };

  return (
    <div className="search-box">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search for company..."
        autoFocus
      />

      {isSuggestionsVisible && inputValue && hits.length > 0 && (
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
      )}

      {/* Removed the section for adding a new company */}
      
      <button onClick={handleClearSearch} style={{ marginTop: '10px' }}>Clear Search</button>
    </div>
  );
});

export default CustomSearchBox;
