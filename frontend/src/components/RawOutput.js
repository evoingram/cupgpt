import React from 'react';

function RawOutput({ rawOutput }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <div>
      <h2>Raw Output</h2>
      <pre>{rawOutput}</pre>
      <button
        className="secondary"
        onClick={() => copyToClipboard(rawOutput)}
        aria-label="Copy Raw Output"
      >
        Copy Raw Output
      </button>
      <button
        className="secondary"
        onClick={() => window.open('https://chat.openai.com', '_blank')}
        aria-label="Open ChatGPT"
      >
        Open ChatGPT
      </button>
    </div>
  );
}

export default RawOutput;
