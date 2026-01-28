import React, { useEffect, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const Lightbox = ({ currentImage, images, onClose, onSetImage }) => {
  const imageUrl = currentImage ? `${process.env.REACT_APP_API_URL + '/images'}/${currentImage._id}` : '';

  const currentIndex = currentImage 
    ? images.findIndex(img => img._id === currentImage._id)
    : -1;

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    onSetImage(images[nextIndex]);
  }, [currentIndex, images, onSetImage]);

  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onSetImage(images[prevIndex]);
  }, [currentIndex, images, onSetImage]);

  useEffect(() => {
    if (!currentImage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose, currentImage]);

  if (!currentImage) return null;

  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      {images.length > 1 && (
        <button className="lightbox-nav-btn left" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
      )}

      <div className="lightbox-image-container" onClick={handleContentClick}>
        <img 
          src={imageUrl} 
          alt={currentImage.name}
          className="lightbox-image"
        />
        <div className="lightbox-caption">{currentImage.name}</div>
      </div>

      {images.length > 1 && (
        <button className="lightbox-nav-btn right" onClick={handleNext}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default Lightbox;