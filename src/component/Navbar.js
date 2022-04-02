import React from 'react'
import logo from '../assets/stonks.png';
import '../styles/Navbar.css';
import {Link} from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
        <div className="leftSide">
            <img src={logo} className="App-logo" alt="logo" />
            <a>StonksBot</a>
        </div>
        <div className="rightSide">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
        </div>
    </div>
  )
}

export default Navbar