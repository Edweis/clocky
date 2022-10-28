import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Stats from './Stats';
import { AuthContext, useAuthInit } from '../lib/auth';
import Reader from './Reader';
import Login from './Login';
import Navbar from '../components/Navbar';
import Account from './Account';
import { SangriaReadings } from '../lib/use-readings';

dayjs.extend(relativeTime);
function WithAuth() {
  const readings = SangriaReadings.useDataInit();
  return (
    <SangriaReadings.context.Provider value={readings.get()}>
      <Navbar />
      <div className="container mx-auto pt-2 px-4 bg-yellow-400">
        <div className="grid gap-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/account" element={<Account />} />
            <Route path="/" element={<Reader />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </SangriaReadings.context.Provider>
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
