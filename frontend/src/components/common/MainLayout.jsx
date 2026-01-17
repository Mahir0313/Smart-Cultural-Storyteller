import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Player from '../Player';

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Player />
    </div>
  );
};

export default MainLayout;
