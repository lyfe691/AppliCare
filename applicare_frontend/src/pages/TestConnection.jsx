// src/pages/TestConnection.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ! This is temporary to test the connection with the backend. 

function TestConnection() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-mongo');
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}, start the backend to resovle. `);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h1>MongoDB Test Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Link to="/">
        <button>Back</button>
      </Link>
      <button onClick={fetchData}>Refresh</button>
    </div>
  );
}

export default TestConnection;
