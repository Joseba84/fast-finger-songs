"use client";

import { useState, useRef, useEffect } from 'react';

interface PlayerProps {
  songs: any[];
  currentIndex: number;
  onNext: () => void;
}

export default function Player({ songs, currentIndex, onNext }: PlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState('0%');
  const audioRef = useRef<HTMLAudioElement>(null);

  const song = songs[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (playing) {
        audioRef.current.play().catch(e => console.error("Play failed", e));
      }
    }
  }, [currentIndex]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Play failed", e));
    }
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100;
      setProgress(`${progressPercent}%`);
      if (progressPercent >= 100) {
        onNext();
      }
    }
  };

  if (!song) return <div className="spinner"></div>;

  return (
    <div>
      <div className="wrapper" style={{ 
        position: 'relative', 
        width: '100%', 
        aspectRatio: '1/1', 
        backgroundColor: '#050505', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '1px solid #222',
        cursor: 'pointer' 
      }} onClick={togglePlayPause}>
        
        {/* Play/Pause Button - Same style as GuessGame */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70px',
          height: '70px',
          backgroundColor: 'rgba(0, 191, 255, 0.1)',
          border: '3px solid #00BFFF',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00BFFF',
          zIndex: 10,
          boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)'
        }}>
          {playing ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
              <path d="M7 4v16l13-8z" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <img 
          src={song.image} 
          alt={song.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate}
        src={song.source}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="progress-bar" style={{ width: progress }}></div>
      <h2 style={{ marginTop: '15px' }}>{song.title}</h2>
    </div>
  );
}
