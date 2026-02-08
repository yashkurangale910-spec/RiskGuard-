import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import InterventionManagement from './pages/InterventionManagement';
import AddStudent from './pages/AddStudent';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Router>
      <div className="flex bg-dark-bg min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-72">
          <Header />
          <main className="mt-20 p-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentProfile />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/interventions" element={<InterventionManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/settings" element={<div className="text-white">Settings Coming Soon...</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
