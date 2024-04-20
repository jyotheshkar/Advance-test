import React, { useState } from 'react';
import axios from 'axios';
import './Search.css';

interface WeatherData {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: { type: number; id: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [results, setResults] = useState<WeatherData[]>([]);
  const [sortedResults, setSortedResults] = useState<WeatherData[]>([]);
  const [error, setError] = useState('');

  const apiKey = 'cf24472b0d7c7b3902b765c907705dfc';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a location');
      return;
    }
    try {
      const response = await axios.get<WeatherData>(`${apiUrl}?q=${searchQuery}&appid=${apiKey}&units=metric`);
      setResults([response.data]);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    }
  };

  const handleSort = () => {
    if (!sortQuery) {
      setError('Please select a sorting option');
      return;
    }
    const sorted = [...results].sort((a, b) => {
      if (sortQuery === 'name') {
        return a.name.localeCompare(b.name);
      }
      const valA = a[sortQuery as keyof WeatherData];
      const valB = b[sortQuery as keyof WeatherData];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        return valA - valB;
      }
      return 0;
    });
    setSortedResults(sorted);
    setError('');
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortQuery(event.target.value);
    setError('');
  };

  return (
    <div className="card-search">
      <h2>Search</h2>
      <div>
        <input type="text" placeholder="Search location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <input type="text" placeholder="Enter location..." />
        <select value={sortQuery} onChange={handleSortByChange}>
          <option value="">-- Sort by --</option>
          <option value="weather.0.id">ID</option>
          <option value="name">Location name</option>
          <option value="weather.0.description">Description</option>
          <option value="main.temp">Temperature</option>
          <option value="main.feels_like">Feels Like</option>
          <option value="main.temp_min">Minimum Temperature</option>
          <option value="main.temp_max">Maximum Temperature</option>
        </select>
        <button onClick={handleSort}>Sorted Results</button>
      </div>
      {error && <p>{error}</p>}
      <div className="result-box">
        {(results.length > 0 || sortedResults.length > 0) && (
          <div>
            {sortedResults.length > 0 ? (
              sortedResults.map((result, index) => (
                <div key={index}>
                  <p>ID: {result.weather[0].id}</p>
                  <p>Location name: {result.name}</p>
                  <p>Description: {result.weather[0].description}</p>
                  <p>Temperature: {result.main.temp} °C</p>
                  <p>Feels Like: {result.main.feels_like} °C</p>
                  <p>Minimum Temperature: {result.main.temp_min} °C</p>
                  <p>Maximum Temperature: {result.main.temp_max} °C</p>
                </div>
              ))
            ) : (
              results.map((result, index) => (
                <div key={index}>
                  <p>ID: {result.weather[0].id}</p>
                  <p>Location name: {result.name}</p>
                  <p>Description: {result.weather[0].description}</p>
                  <p>Temperature: {result.main.temp} °C</p>
                  <p>Feels Like: {result.main.feels_like} °C</p>
                  <p>Minimum Temperature: {result.main.temp_min} °C</p>
                  <p>Maximum Temperature: {result.main.temp_max} °C</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
