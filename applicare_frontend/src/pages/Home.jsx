// src/pages/Home.jsx

import { useAuth } from "../features/auth/AuthContext";
import { Link } from "react-router-dom";

 function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to AppliCare</h1>
      {user ? (
        <div>
          <p>Hello, {user.username}!</p>
          <button><Link to="/long-page">Test long page</Link></button>
          <button><Link to="/test-mongo">Test the api?</Link></button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
      <p>This is the home page of the application.</p>
    </div>
  );
}

export default Home;
