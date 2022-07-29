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
      <h1 className="text-5xl text-center my-4">clocky</h1>
      <h3 className="flex h-6 justify-around mx-10">
        <BookOpenIcon />
        <ChartBarIcon />
        <UserIcon />
      </h3>
      <div className="grid gap-4">
        <div className="h-[40vh] flex flex-col justify-center">
          <Reader />
        </div>
        <div>
          <h2 className="text-xl">Streak</h2>
          <Stats />
        </div>
        <div>
          <h2 className="text-xl">Past reads</h2>
          <PastReads />
        </div>
      </div>
    </div>
  );
}
export default App;
