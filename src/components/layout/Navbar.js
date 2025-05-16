import React, { useContext } from 'react'
import { Link } from "react-router-dom"
import { UserContext } from '../../context/UserContext';
import './Navbar.css'

const Navbar = () =>
   {
  const { currentUser, isAuthenticated, logout } = useContext(UserContext);

  ///// LOGOUT HANDLER /////


  const handleLogout = () => 
 {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        <Link to="/" className="navbar-logo">
          Game Browser App 
        </Link>

        <div className="navbar-menu">

          <Link to="/" className="navbar-item">
            Home
          </Link>
          
          <Link to="/swipe" className="navbar-item">
            Swipe
          </Link>
          
          {isAuthenticated && 
          (
            <Link to="/profile" className="navbar-item">
              My Profile
            </Link>
          )}
          
          <div className="user-info">
            {/* CHECK ACC OR SHOW TO MAKE ACC */}
            {isAuthenticated ? 
            (
              <>
                <span className="navbar-item">
                  {currentUser?.username}
                </span>
                <button 
                  className="btn btn-secondary navbar-item" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) 
            : 
            // if not authenticated
            (
              <Link 
                to="/account" 
                className="btn btn-primary navbar-item"
              >
                Account
              </Link>
            )
            }
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;