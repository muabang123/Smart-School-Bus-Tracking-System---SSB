import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/driver/dashboard" className="home-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </Link>
      </div>
      <div className="header-center">
        <h1>SMART SCHOOL BUS</h1>
      </div>
      <div className="header-right">
        <Link to="/login/driver" className="logout-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </Link>
      </div>
    </header>
  )
}

export default Header