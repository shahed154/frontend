import React, { useState, useEffect, useContext } from 'react';
import { gameService } from '../../services/api';
import { UserContext } from "../../context/UserContext";
import GameCard from '../ui/GameCard';
import './GameSwipe.css';

const GameSwipe = () => {
  const [gameData, setGameData] = useState({
    currentGame: null,
    nextGames: [],
    loading: true,
    error: "",
    page: 1
  });
  const { currentUser, isAuthenticated } = useContext(UserContext);
  
 
  useEffect(function loadInitialGames() {
    let isMounted = true;
    
    async function fetchInitialGames() {
      try {
        const gamesData = await gameService.getTrendingGames(1);
        
        if (isMounted && gamesData && gamesData.length > 0) {
          setGameData({
            currentGame: gamesData[0],
            nextGames: gamesData.slice(1),
            loading: false,
            error: "",
            page: 1
          });
        } else if (isMounted) {
          setGameData(prev => ({
            ...prev,
            loading: false,
            error: "No game available"
          }));
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error getting games:', error);
          setGameData(prev => ({
            ...prev,
            loading: false,
            error: "Failed to load games."
          }));
        }
      }
    }
    
    fetchInitialGames();
    
    return function cleanup() {
      isMounted = false;
    };
  }, []); 


  function loadMoreGames() {
    const nextPage = gameData.page + 1;
    
    gameService.getTrendingGames(nextPage)
      .then(moreGames => {
        if (moreGames && moreGames.length > 0) {
          setGameData(prev => ({
            ...prev,
            nextGames: [...prev.nextGames, ...moreGames],
            page: nextPage
          }));
        }
      })
      .catch(error => {
        console.error("Error loading more games:", error);
      });
  }
  
  function moveToNextGame() {
    if (gameData.nextGames.length > 0) {
      setGameData(prev => ({
        ...prev,
        currentGame: prev.nextGames[0],
        nextGames: prev.nextGames.slice(1)
      }));
      
      if (gameData.nextGames.length <= 2) {
        loadMoreGames();
      }
    } else {
      loadMoreGames();
    }
  }
  function handleLike() {
    if (!isAuthenticated) {
      alert('Please login to save your preferences');
      moveToNextGame();
      return;
    }

    if (gameData.currentGame) {
      gameService.saveGamePreference(
        gameData.currentGame.id, 
        true, 
        currentUser._id
      )
      .then(() => {
        moveToNextGame();
      })
      .catch(error => {
        console.error("Error saving like:", error);
      });
    }
  }
  

  function handleDislike() {
    if (!isAuthenticated) {
      alert('Please login to save your preferences');
      moveToNextGame();
      return;
    }

    if (gameData.currentGame) {
      gameService.saveGamePreference(
        gameData.currentGame.id, 
        false, 
        currentUser._id
      )
      .then(() => {
        moveToNextGame();
      })
      .catch(error => {
        console.error("Error saving dislike:", error);
      });
    }
  }
  
  const { currentGame, loading, error } = gameData;
  
  return (
    <div className="game-swipe-container">
      <div className="container">
        <h1 className="swipe-title">Find Your Next Game</h1>
        <p className="swipe-subtitle">
          Swipe through games and save your preferences
        </p>

        <div className="swipe-area">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading games...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {currentGame ? (
                <div className="swipe-card-container">
                  <div className="swipe-card">
                    <GameCard 
                      game={currentGame}
                      showActions={false}
                    />
                  </div>
                  
                  <div className="swipe-actions">
                    <button 
                      className="swipe-button dislike-button"
                      onClick={handleDislike}
                    >
                      👎
                    </button>
                    
                    <button 
                      className="swipe-button like-button"
                      onClick={handleLike}
                    >
                      👍
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-games-message">
                  <h3>No more games to show</h3>
                  <p>Come back later for more recommendations!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSwipe;