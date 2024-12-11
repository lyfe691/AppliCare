import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TestConnection from "./pages/TestConnection";
import LongPage from "./pages/LongPage";
import Layout from "./components/Layout"; // now using layout
import "./App.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/test-mongo" element={<TestConnection />} />
          <Route path="/long-page" element={<LongPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
