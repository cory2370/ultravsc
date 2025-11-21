import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainApp = () => {
  return (
    <div id="mainApp">
      <Header />
      <div className="container" style={{ paddingBottom: '2rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainApp;

