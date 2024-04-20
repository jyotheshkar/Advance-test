import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './Search.css'; // Import CSS file for styling

// Define interface for weather data received from API
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

// Define the Search component
const Search = () => {
  // Define state variables
  const [searchQuery, setSearchQuery] = useState(''); // For storing the search query
  const [sortQuery, setSortQuery] = useState(''); // For storing the sorting option
  const [results, setResults] = useState<WeatherData[]>([]); // For storing search results
  const [sortedResults, setSortedResults] = useState<WeatherData[]>([]); // For storing sorted search results
  const [error, setError] = useState(''); // For storing error messages

  // Define API key and URL
  const apiKey = 'cf24472b0d7c7b3902b765c907705dfc';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Function to handle search button click
  const handleSearch = async () => {
    if (!searchQuery) { // Check if search query is empty
      setError('Please enter a location'); // Set error message
      return; // Exit function
    }
    try {
      const response = await axios.get<WeatherData>(`${apiUrl}?q=${searchQuery}&appid=${apiKey}&units=metric`); // Make API call
      setResults([response.data]); // Set search results
      setError(''); // Clear error
    } catch (error) {
      console.error('Error fetching data:', error); // Log error to console
      setError('Error fetching data. Please try again.'); // Set error message
    }
  };

  // Function to handle sorted results button click
  const handleSort = () => {
    if (!sortQuery) { // Check if sorting option is selected
      setError('Please select a sorting option'); // Set error message
      return; // Exit function
    }
    const sorted = [...results].sort((a, b) => { // Sort the results array
      if (sortQuery === 'name') { // If sorting by name
        return a.name.localeCompare(b.name); // Sort by name
      }
      const valA = a[sortQuery as keyof WeatherData]; // Get value of sorting field for object A
      const valB = b[sortQuery as keyof WeatherData]; // Get value of sorting field for object B
      if (typeof valA === 'string' && typeof valB === 'string') { // If both values are strings
        return valA.localeCompare(valB); // Sort by string comparison
      } else if (typeof valA === 'number' && typeof valB === 'number') { // If both values are numbers
        return valA - valB; // Sort by numerical comparison
      }
      return 0; // Default return value
    });
    setSortedResults(sorted); // Set sorted results
    setError(''); // Clear error
  };

  // Function to handle change in sort by option
  const handleSortByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortQuery(event.target.value); // Update sorting option
    setError(''); // Clear error
  };

  // Render the component
  return (
    <div className="card-search">
      <h2>Search</h2>
      {/* Search by location input */}
      <div>
        <input type="text" placeholder="Search location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* Enter location and sort by input */}
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
      {/* Error message display */}
      {error && <p>{error}</p>}
      {/* Display search results */}
      <div className="result-box">
        {(results.length > 0 || sortedResults.length > 0) && (
          <div>
            {sortedResults.length > 0 ? ( // If sorted results are available
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
              results.map((result, index) => ( // If regular results are available
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

export default Search; // Export the Search component
