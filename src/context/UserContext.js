import React, { createContext, useState, useEffect } from "react"
import { gameService } from '../services/api'


export const UserContext = createContext()

export const UserProvider = ({ children }) => 

  {
    // use state for current user default null and then for loading state as well
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => 
    
    {
    //// CHECK USER STATE ////
    const checkUser = () => 
      {
      const savedUser = localStorage.getItem('gameUser')
      
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser))
      }
      
      setLoading(false)
    }

    checkUser()
  }, [])

  ///// LOGIN OR CREATE USER ///////

  const loginOrCreate = async (username) => 
    {
    try
     {
      const response = await gameService.loginOrCreateUser(username)
      
      const userData = response.user
      localStorage.setItem("gameUser", JSON.stringify(userData))
      setCurrentUser(userData)
      
      return { success: true, user: userData, isNew: response.isNew }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failedd to login or create user' 
      }
    }
  }

  //// USER LOGOUT ///
  const logout = () => {
    localStorage.removeItem('gameUser')
    setCurrentUser(null)
  }

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        loginOrCreate, 
        logout,
        isAuthenticated: !!currentUser,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  )
}