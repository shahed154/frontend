import React, { useState } from 'react'
import { gameService } from '../../services/api';
import './GameCard.css';

const GameCard = ({ game, onLike, onDislike, showActions = true }) => {
  const [expanded, setExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [gameDetails, setGameDetails] = useState(null)
  
  if (!game) return null;

  const getImages = () => 
  {
    const images = [];
    
    if (game.background_image) {
      images.push({
        src: game.background_image,
        alt: game.name
      })
    }
    
    if (game.screenshots && game.screenshots.length > 0) {
      game.screenshots.forEach(screenshot => {
        if (screenshot.image) {
          images.push({
            src: screenshot.image,
            alt: `${game.name} screenashot`
          })
        }
      })
    }
    
    return images
  }
  
  const images = getImages()
  const currentImage = images.length > 0 ? images[currentImageIndex] : null
  

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }

  const handleNextImage = () => {
    if (images.length <= 1) return
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  }
  

  const getDescription = () => {

    if (loading) return "Loading..."
    // THE DESCRIPTION WAS SHOWING A <p> Tag so i google this and copy it lol 
  //https://stackoverflow.com/questions/71749369/how-to-remove-p-tag-on-api-while-fetching-the-data-in-react
    if (expanded && gameDetails?.description) {
      return gameDetails.description.replace(/<(.|\n)*?>/g, '')
    }
    
    let desc = game.description || ""
    desc = desc.replace(/<(.|\n)*?>/g, '')
    
    return desc.length > 150 && !expanded 
      ? desc.substring(0, 150) + "..." 
      : desc
  }
  
  const handleShowMore = async () => {
 
    if (gameDetails || expanded) {
      setExpanded(!expanded)
      return
    }
    
    try {
      setLoading(true)
      const details = await gameService.getGameDetails(game.id)
      setGameDetails(details)
      setExpanded(true)
    } catch (error)
     {
      console.error("Failed to load game details:", error)
    } finally 
    {
      setLoading(false)
    }
  }

  return (
    <div className="game-card">
      <div className="game-card-media">
        {currentImage 
        ?
         (
          <>
            <img 
              src={currentImage.src} 
              alt={currentImage.alt || game.name} 
              className="game-card-image" 
            />
            
            {images.length > 1 && (
              <>
                <div className="image-nav">
                  <button 
                    className="image-nav-button"
                    onClick={handlePrevImage}
                  >
                    ‹
                  </button>
                  <button 
                    className="image-nav-button"
                    onClick={handleNextImage}
                  >
                    ›
                  </button>
                </div>
                <div className="image-counter">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) 
        : 
        (
          <div className="game-card-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        
        {game.metacritic && (
          <div className="game-card-meta">
            <span>Score: {game.metacritic}</span>
          </div>
        )}
        
        {game.genres && game.genres.length > 0 && (
          <div className="game-card-genres">
            {game.genres.map(genre =>
             (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
        )}
        
        <p className="game-card-description">
          {getDescription()}
        </p>
        
        <div className="game-card-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleShowMore}
          >
            {loading ? "Loading..." : expanded ? "Show Less" : "Show More"}
          </button>
          
          {showActions && onLike && onDislike && 
          (
            <div className="like-dislike-buttons">
              <button 
                className="like-button"
                onClick={() => onLike(game.id)}
              >
                👍
              </button>
              
              <button 
                className="dislike-button"
                onClick={() => onDislike(game.id)}
              >
                👎
              </button>
            </div>
          )}

          
        </div>
      </div>
    </div>
  )
}

export default GameCard