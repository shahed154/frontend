import React, { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { gameService } from '../../services/api';
import { UserContext } from '../../context/UserContext';
import GameCard from '../ui/GameCard';
import './Profile.css'

const Profile = () => {
  const { currentUser, isAuthenticated, loading } = useContext(UserContext)
  const [likedGames, setLikedGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(true);

  ///// FETCH LIKED GAMES /////

  useEffect(() => {
    const fetchLikedGames = async () => {
      if (!isAuthenticated || !currentUser) return

      try {
        setLoadingGames(true);
        const games = await gameService.getUserLikedGames(currentUser._id);
        setLikedGames(games);

      } catch (error) 
      {
        console.error('Error fetching liked games:', error)
      } finally 
      {
        setLoadingGames(false)
      }
    }

    if (currentUser) {
      fetchLikedGames()
    }
  }, [currentUser, isAuthenticated])

  ///// HANDLE REMOVING LIKED GAME ////


  const handleRemoveLike = async (gameId) => {
    try 
    {
      await gameService.removeLikedGame(gameId, currentUser._id);
      setLikedGames(prevGames => 
        prevGames.filter(game => game.id !== gameId)
      )
    } catch (error) {
      console.error('Error removing like:', error)
    }
  }

  if (!loading && !isAuthenticated) {
    return <Navigate to="/" />
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <h2 className="username">{currentUser.username}</h2>
          </div>
        </div>

        <div className="liked-games-section">
          <h2 className="section-title">Liked Games</h2>
          
          {loadingGames ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading your liked games...</p>
            </div>
          ) : (
            <>
              {likedGames.length > 0 ? (
                <div className="games-grid">

                  {likedGames.map(game => 
                  (
                    <div key={game.id} className="game-card-wrapper">
                      <GameCard 
                        game={game}
                        showActions={false}
                      />
                      <button 
                        className="remove-like-button"
                        onClick={() => handleRemoveLike(game.id)}
                        aria-label="Remove from liked games"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-games-message">
                  <p>You haven't liked any games yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile