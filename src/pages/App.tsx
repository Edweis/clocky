import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BookOpenIcon, ChartBarIcon, UserIcon } from '@heroicons/react/outline';
import PastReads from './PastReads';
import Stats from './Stats';
import '../lib/auth';
import Reader from './Reader';
import Login from './Login';

dayjs.extend(relativeTime);

function App() {
  return (
    <div className="container mx-auto pt-2 px-2">
      <div>
        <h1 className="text-5xl my-4 text-center">clocky</h1>
        <h3 className="flex gap-4 justify-center">
          <Link to="/">
            <BookOpenIcon className="h-10" />
          </Link>
          <Link to="/stats">
            <ChartBarIcon className="h-10" />
          </Link>
          <Link to="/login">
            <UserIcon className="h-10" />
          </Link>
        </h3>
      </div>
      <div className="grid gap-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/past" element={<PastReads />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/" element={<Reader />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
