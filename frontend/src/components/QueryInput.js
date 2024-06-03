import React from 'react';

function QueryInput({ query, setQuery, handleSearch }) {
  return (
    <div>
      <label htmlFor="query">Query:</label>
      <input
        type="text"
        id="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
      />
      <button className="primary" onClick={handleSearch} aria-label="Search">
        Search
      </button>
    </div>
  );
}

export default QueryInput;
