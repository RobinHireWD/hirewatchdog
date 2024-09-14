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
    setInputValue(''); // Clear input value
    refine(''); // Clear search refinement
    onNewCompany(company); // Notify parent component
  };

  const handleClearSearch = () => {
    setInputValue(''); // Clear input value
    refine(''); // Clear search refinement
    onNewCompany(''); // Notify parent component of clearing
  };

  const suggestionsStyle = {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '400px', // Increase width as needed
    maxHeight: '100px', // Limit height if necessary
    overflowY: 'auto', // Enable scrolling if the content overflows
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    zIndex: '100' // Ensure it appears above other content
  };

  const suggestionButtonStyle = {
    width: '100%',
    padding: '10px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer'
  };

  const inputStyle = {
    width: '300px', // Set width for the input box
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  return (
    <div className="search-box" style={{ position: 'relative' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search For Existing Company..."
        autoFocus
        style={inputStyle} // Apply inline styles here
      />

      {isSuggestionsVisible && inputValue && hits.length > 0 && (
        <div className="suggestions" style={suggestionsStyle}>
          {hits.map((hit) => (
            <div key={hit.objectID}>
              <button
                onClick={() => handleCompanyClick(hit.name)}
                style={suggestionButtonStyle}
              >
                {hit.name}
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleClearSearch} style={{ marginTop: '10px' }}>Clear Search</button>
    </div>
  );
});

export default CustomSearchBox;
