import './App.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect } from 'react';
import { BookOpenIcon, ChartBarIcon, UserIcon } from '@heroicons/react/outline';
import PastReads from './PastReads';
import Stats from './Stats';
import { unAuthLogin } from '../lib/apis/unAuthLogin';
import { getDatabase, setDataBase } from '../lib/apis/database';
import Reader from './Reader';
import { authLogin } from '../lib/apis/authLogin';

dayjs.extend(relativeTime);

function App() {
  useEffect(() => {
    // unAuthLogin().then((response) => {
    //   setDataBase(response.awsUserId, response.credentials, 'hello');
    // });
    authLogin('francois@reebelo.com', 'asdfasdf');
  }, []);
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
