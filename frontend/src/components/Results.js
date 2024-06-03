import React from 'react';

function Results({ results }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <div>
      <h2>Results</h2>
      {results.map((result, index) => (
        <div key={index} className="result">
          <h3>{result.topic}</h3>
          <p>{result.description}</p>
          {result.examples
                        && result.examples.map((example, exIndex) => (
                          <div key={exIndex}>
                            <h4>{example.language}</h4>
                            <pre>{example.text}</pre>
                            <button
                              className="secondary"
                              onClick={() => copyToClipboard(example.text)}
                              aria-label="Copy Example"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
        </div>
      ))}
    </div>
  );
}

export default Results;
