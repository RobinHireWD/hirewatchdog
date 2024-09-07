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

  const handleAddNewCompany = () => {
    if (inputValue.trim() && !hits.some(hit => hit.name.toLowerCase() === inputValue.toLowerCase())) {
      onNewCompany(inputValue); // Notify parent component to add new company
      setInputValue(''); // Clear input field
      refine(''); // Clear search refinement
    }
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
        placeholder="Search for company or enter a new one..."
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

      {inputValue && !hits.some(hit => hit.name.toLowerCase() === inputValue.toLowerCase()) && (
        <div>
          <p>No suggestions match your input.</p>
          <button onClick={handleAddNewCompany}>Add "{inputValue}" as a new company</button>
        </div>
      )}

      <button onClick={handleClearSearch} style={{ marginTop: '10px' }}>Clear Search</button>
    </div>
  );
});

export default CustomSearchBox;
