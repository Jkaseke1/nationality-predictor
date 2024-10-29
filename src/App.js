import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [probability, setProbability] = useState('');
  const [countryNames, setCountryNames] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countries = {};
        data.forEach(country => {
          countries[country.cca2] = country.name.common;
        });
        setCountryNames(countries);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePredictNationality = async () => {
    if (!name.trim()) return;
    
    try {
      const response = await fetch(`https://api.nationalize.io?name=${name}`);
      const data = await response.json();
      if (data.country && data.country.length > 0) {
        const firstCountry = data.country[0];
        setNationality(firstCountry.country_id);
        setProbability(`(${(firstCountry.probability * 100).toFixed(2)}%)`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCountryName = (countryCode) => {
    return countryNames[countryCode] || countryCode;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePredictNationality();
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Nationality Predictor</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a name"
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          ref={inputRef}
          autoFocus
        />
        <button 
          className="btn btn-primary" 
          onClick={handlePredictNationality}
          disabled={!name.trim()}
        >
          Predict
        </button>
      </div>
      {nationality && (
        <div className="result">
          <p className="mt-3">
            Predicted Nationality: <span className="highlight">{getCountryName(nationality)}</span>
          </p>
          <p>
            Probability: <span className="highlight">{probability}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
