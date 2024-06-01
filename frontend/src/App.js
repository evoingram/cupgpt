import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [rawOutput, setRawOutput] = useState('');
  const [bulletedList, setBulletedList] = useState(false);

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
      const response = await axios.post('http://localhost:3000/query', {
        query: query,
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
            <label>
              <input
                  type="checkbox"
                  checked={bulletedList}
                  onChange={(e) => setBulletedList(e.target.checked)}
              />
              Bulleted List
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
          <button className="secondary" onClick={() => copyToClipboard(rawOutput)} aria-label="Copy Raw Output">Copy Raw Output</button>
        </main>
        <footer>
          <p>Footer content</p>
        </footer>
      </div>
  );
}

export default App;
