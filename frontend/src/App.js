import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import QueryInput from './components/QueryInput';
import OptionsCheckboxes from './components/OptionsCheckboxes';
import Results from './components/Results';
import RawOutput from './components/RawOutput';
import TipsWindow from './components/TipsWindow';

function App() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [rawOutput, setRawOutput] = useState('');
    const [options, setOptions] = useState({
        bulletedList: false,
        accuracy: false,
        includeSources: false,
        myWritingStyle: false,
        searchInternet: false,
        bestPractices: false
    });

    const handleCheckboxChange = (option) => (event) => {
        const newOptions = { ...options, [option]: event.target.checked };
        setOptions(newOptions);
        console.log('Updated options:', newOptions);
    };

    const handleSearch = async () => {
        console.log('Sending request with options:', options);
        try {
            const response = await axios.post('http://localhost:3000/search/query', {
                query,
                options,
            });
            console.log(`response = ${JSON.stringify(response.data.results)}`)
            setResults(response.data.results);
            setRawOutput(response.data.rawOutput);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="App">
            <header>
                <h1>CupGPT Coding Monkey Wizard</h1>
            </header>
            <QueryInput query={query} setQuery={setQuery} handleSearch={handleSearch} />
            <OptionsCheckboxes
                options={options}
                handleCheckboxChange={handleCheckboxChange}
            />
            <main>
                <Results results={results} />
                <RawOutput rawOutput={rawOutput} />
                <TipsWindow />
            </main>
        </div>
    );
}

export default App;

