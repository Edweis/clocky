import { Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BookOpenIcon, ChartBarIcon, UserIcon } from '@heroicons/react/outline';
import PastReads from './PastReads';
import Stats from './Stats';
import '../lib/auth';
import Reader from './Reader';

dayjs.extend(relativeTime);

function App() {
  return (
    <div className="container mx-auto pt-2 px-2 bg-yellow-400">
      <h1 className="text-5xl my-4">clocky</h1>
      <h3 className="flex gap-4 text-xl">
        <Link to="/">
          <BookOpenIcon />
        </Link>
        <Link to="/stats">
          <ChartBarIcon />
        </Link>
        <Link to="/">
          <UserIcon />
        </Link>
      </h3>
      <div className="grid gap-4">
        <Routes>
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
