import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';

// Placeholder for future dashboard page
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <p>Dashboard will be implemented here</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* More routes will be added later */}
      </Routes>
    </Router>
  );
}

export default App;
