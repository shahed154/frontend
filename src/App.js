import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { UserProvider } from  "./context/UserContext"

//
import Navbar from './components/layout/Navbar';


import Home  from './components/pages/Home'
import Profile from './components/pages/Profile'
import AccountPage from './components/pages/AccountPage'
import GameSwipe from  './components/pages/GameSwipe'

import './assets/styles/global.css';

function App() {
  return (
    <UserProvider>
      <Router>
        
        <Navbar />

        <main className="main-content">

          <Routes>

            <Route path="/" element={<Home />}  
            />
            <Route path="/profile" element={<Profile  />}  
            />
            <Route path="/account" element={<AccountPage  />}   
            />
            <Route path="/swipe" element={<GameSwipe />}
             />
            <Route path="*" element={<Home />}
             />

          </Routes>

        </main>
      </Router>
    </UserProvider>
  )
}

export default App