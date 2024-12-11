import Home from './pages/Home';
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestConnection from './pages/TestConnection';
import LongPage from './pages/LongPage';
import Navbar from './components/Navbar';

function App() {

  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test-mongo" element={<TestConnection />} />
        <Route path="/long-page" element={<LongPage/>} /> 
      </Routes>
    </Router>

  );
}

export default App
