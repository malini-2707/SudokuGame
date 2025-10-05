import React from 'react';

// Fullscreen background layer with optional video or image, plus overlay
export default function BackgroundLayer({
  videoUrl = import.meta.env.VITE_BG_VIDEO_URL || '',
  imageUrl = import.meta.env.VITE_BG_IMAGE_URL || 'https://i.pinimg.com/736x/bb/3d/84/bb3d8437b1b4471826db642bf6429aff.jpg',
  overlayClass = 'bg-transparent',
}) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {videoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className={`absolute inset-0 ${overlayClass}`} />
    </div>
  );
}
