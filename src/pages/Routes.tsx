import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import DashboardPoll from './DashboardPoll';
import Root from './Root';

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home-poll" element={<DashboardPoll />} />
      </Routes>
    </Router>
  );
}
