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
    if (audioRef.current && playing) {
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Play failed", e));
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
    const progressPercent = (currentTime / duration) * 100;
    setProgress(`${progressPercent}%`);
    if (progressPercent >= 100) {
      onNext();
    }
  };

  return (
    <div>
      <div className="wrapper">
        <span 
          onClick={togglePlayPause} 
          className={`play ${playing ? 'active' : ''}`}
        ></span>
        <img src={song.image} alt={song.title} />
      </div>
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate}
        src={song.source}
      />
      <div className="progress-bar" style={{ width: progress }}></div>
      <h2>{song.title}</h2>
    </div>
  );
}
