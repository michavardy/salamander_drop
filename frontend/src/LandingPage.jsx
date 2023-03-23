import React, {useState} from 'react';
import { Link, Route, Switch, BrowserRouter, Routes } from 'react-router-dom';
import './LandingPage.css';
import Login from './Login'

const LandingPage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    
    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Implement login logic here
        setLoggedIn(true);
      };
    
      const handleLogout = () => {
        // TODO: Implement logout logic here
        setLoggedIn(false);
      };

    return (
        <div className="App">
          <div className="SideBar">
              <div>Upload</div>
              <div>Community</div>
          </div>
          <div className="Main">
            {loggedIn ? null : <Login onLogin={()=>handleLogin}/>}
          </div>
        </div>
    );
  };
  
  export default LandingPage;