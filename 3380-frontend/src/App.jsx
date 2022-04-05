import React from 'react';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons

import './styles/App.css';

import GlobalContext from './util/GlobalContext';
import TitleCard from './cards/TitleCard';
import UserCard from './cards/UserCard';
import HomeGroup from './components/HomeGroup';

function App() {
  return (
    <GlobalContext>
      <div className="body">
        <div className="flex-wrap">
          <TitleCard />
          <div className="spacer" />
          <UserCard />
        </div>
        <div className="spacer" />
        <HomeGroup />
      </div>
    </GlobalContext>
  );
}

export default App;
