import { useAuth } from "../context/AuthContext";

function Home() {
  const { isAuthenticated, username } = useAuth(); // now using state due to the status problems I had. 

  return (
    <div>
      <h1>
        Welcome to AppliCare{isAuthenticated ? `, ${username}` : ""}
      </h1>
      <p>This is the home page of my application.</p>
      <a href="/test-mongo">
        <button>Test the API?</button>
      </a>
      <a href="/long-page">
        <button>Long Page</button>
      </a>
    </div>
  );
}

export default Home;
