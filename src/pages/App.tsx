import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PastReads from './PastReads';
import Stats from './Stats';
import { AuthContext, useAuthInit } from '../lib/auth';
import Reader from './Reader';
import Login from './Login';
import Navbar from '../components/Navbar';
import { ReadingsContext, useReadingsInit } from '../lib/reading-api';

dayjs.extend(relativeTime);

function WithAuth() {
  const readings = useReadingsInit();

  return (
    <ReadingsContext.Provider value={readings}>
      <Navbar />
      <div className="container mx-auto pt-2 px-4 bg-yellow-400">
        <div className="grid gap-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/" element={<Reader />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </ReadingsContext.Provider>
  );
}
export default function App() {
  const auth = useAuthInit();
  return (
    <AuthContext.Provider value={auth}>
      <WithAuth />
    </AuthContext.Provider>
  );
}
