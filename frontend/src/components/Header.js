import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';

function Header({
  query, setQuery, options, handleCheckboxChange, handleSearch,
}) {
  return (
    <header>
      <h1>CupGPT Coding Monkey Wizard</h1>
      <label htmlFor="query">Query:</label>
      <input
        type="text"
        id="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query"
      />
      <div className="options">
        <Checkbox
          label="Bulleted List"
          checked={options.bulletedList}
          onChange={handleCheckboxChange('bulletedList')}
          title="test text bulleted list"
        />
        <Checkbox
          label="Accuracy"
          checked={options.accuracy}
          onChange={handleCheckboxChange('accuracy')}
          title="test text accuracy"
        />
        <Checkbox
          label="Include Sources"
          checked={options.includeSources}
          onChange={handleCheckboxChange('includeSources')}
          title="test text include sources"
        />
        <Checkbox
          label="My Writing Style"
          checked={options.myWritingStyle}
          onChange={handleCheckboxChange('myWritingStyle')}
          title="test text my writing style"
        />
        <Checkbox
          label="Search the Internet"
          checked={options.searchInternet}
          onChange={handleCheckboxChange('searchInternet')}
          title="test text search the internet"
        />
      </div>
      <button className="primary" onClick={handleSearch} aria-label="Search">Search</button>
    </header>
  );
}

Header.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default Header;
