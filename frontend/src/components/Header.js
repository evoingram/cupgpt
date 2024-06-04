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
          title="Please put your response into a bulleted list format."
        />
        <Checkbox
          label="Accuracy"
          checked={options.accuracy}
          onChange={handleCheckboxChange('accuracy')}
          title="Please be as accurate as possible and do not make anything up."
        />
        <Checkbox
          label="Include Sources"
          checked={options.includeSources}
          onChange={handleCheckboxChange('includeSources')}
          title="Include the sources you used to write your response."
        />
        <Checkbox
          label="My Writing Style"
          checked={options.myWritingStyle}
          onChange={handleCheckboxChange('myWritingStyle')}
          title="Use my writing style to write your response."
        />
        <Checkbox
          label="Search the Internet"
          checked={options.searchInternet}
          onChange={handleCheckboxChange('searchInternet')}
          title="Search the internet for the most up-to-date information."
        />
          <Checkbox
              label="Best Practices"
              checked={options.bestPractices}
              onChange={handleCheckboxChange('bestPractices')}
              title="Apply clean code principles and best practices."
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
