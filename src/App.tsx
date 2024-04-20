// App.tsx

import React from 'react';
import Search from './Search';
import Form from './Form';
import './styles.css'; // Import the stylesheet

const App = () => {
  return (
    <div>
      <h1>Weather</h1>
      <div className="container">
        <Search />
        <Form />
      </div>
    </div>
  );
};

export default App;
