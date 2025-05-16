import React, { useState, useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext'

const AccountPage = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('')
  

  const { loginOrCreate, isAuthenticated } = useContext(UserContext);
  
  ///// ACCOUNT HANDLING ///////
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      setError('');

      setMessage('')
      
      if (!username.trim()) {
        setError('ENTER A USERNAME')
        return
      }
      
      const result = await loginOrCreate(username.trim())
      
      if (!result.success) 
        {
        setError(result.message)
      } else if (result.isNew) 
        {
        setMessage('Account created successfully')
      } else 
      {

        setMessage(`Log in sucesssfull!`)

      }
    } catch (err)
     {
      setError('ERRORRR')
      console.error(`Account error:`, err);
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />
  }
  
  return (
    <div className="container">
      <div className="account-form">

        <h1 className="account-title">Log In / Create Account</h1>
        
        {error && 
        (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {message && 
        (
          <div className="alert alert-success">
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input

              type="text"
              id="username"
              className="form-input"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}

            />
            <p>
              Enter a username to log in or create a new account
            </p>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="spinner"></div>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountPage