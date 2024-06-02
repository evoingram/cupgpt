import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [rawOutput, setRawOutput] = useState('');
  const [bulletedList, setBulletedList] = useState(false);
  const [accuracy, setAccuracy] = useState(false);
  const [includeSources, setIncludeSources] = useState(false);
  const [myWritingStyle, setMyWritingStyle] = useState(false);
  const [searchTheInternet, setSearchTheInternet] = useState(false);

  // WebSocket initialization
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws');
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSearch = async () => {
    try {
      let additionalText = "";

      if (bulletedList) {
        additionalText += " Please give this to me in a detailed bulleted list format.";
      }
      if (accuracy) {
        additionalText += " Please be as accurate as possible and do not make anything up.";
      }
      if (includeSources) {
        additionalText += " Please include the sources you used to provide this information.";
      }
      if (myWritingStyle) {
        additionalText += " Please write this in my writing style as much as possible.";
      }
      if (searchTheInternet) {
        additionalText += " Please search the internet for the most up-to-date information as possible on this inquiry.";
      }

      const response = await axios.post('http://localhost:3000/query', {
        query: query + additionalText,
        options: { bulletedList }
      });
      setResults(response.data.results);
      setRawOutput(response.data.rawOutput);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
      <div className="App">
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
            <label title="test text bulleted-list">
              <input
                  type="checkbox"
                  checked={bulletedList}
                  onChange={(e) => setBulletedList(e.target.checked)}
              />
              Bulleted List
            </label>
            <label title="test text accuracy">
              <input
                  type="checkbox"
                  checked={accuracy}
                  onChange={(e) => setAccuracy(e.target.checked)}
              />
              Accuracy
            </label>
            <label title="test text include-sources">
              <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={(e) => setIncludeSources(e.target.checked)}
              />
              Include Sources
            </label>
            <label title="test text my-writing-style">
              <input
                  type="checkbox"
                  checked={myWritingStyle}
                  onChange={(e) => setMyWritingStyle(e.target.checked)}
              />
              My Writing Style
            </label>
            <label title="test text search-the-internet">
              <input
                  type="checkbox"
                  checked={searchTheInternet}
                  onChange={(e) => setSearchTheInternet(e.target.checked)}
              />
              Search the Internet
            </label>
          </div>
          <button className="primary" onClick={handleSearch} aria-label="Search">Search</button>
        </header>
        <main>
          <h2>Results</h2>
          {results.map((result, index) => (
              <div key={index} className="result">
                <h3>{result.topic}</h3>
                <p>{result.description}</p>
                {result.examples && result.examples.map((example, exIndex) => (
                    <div key={exIndex}>
                      <h4>{example.language}</h4>
                      <pre>{example.text}</pre>
                      <button className="secondary" onClick={() => copyToClipboard(example.text)} aria-label="Copy Example">Copy</button>
                    </div>
                ))}
              </div>
          ))}
          <h2>Raw Output</h2>
          <pre>{rawOutput}</pre>
          <div className="button-group">
            <button className="secondary" onClick={() => copyToClipboard(rawOutput)} aria-label="Copy Raw Output">Copy Raw Output</button>
            <button className="secondary" onClick={() => window.open('https://chat.openai.com', '_blank')} aria-label="Open ChatGPT">Open ChatGPT</button>
          </div>
          <div className="tips-window">
            <h3>Tips</h3>
            <ul>
              <li>Bulleted list tip 1</li>
              <li>Bulleted list tip 2</li>
              <li>Bulleted list tip 3</li>
            </ul>
          </div>
        </main>
        {/* Remove or comment out the footer */}
        {/* <footer>
        <p>Footer content</p>
      </footer> */}
      </div>
  );
}

export default App;
