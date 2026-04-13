"use client";

import { useState, useEffect, useRef } from 'react';

interface GuessGameProps {
  songs: any[];
  onNext: () => void;
}

export default function GuessGame({ songs, onNext }: GuessGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    if (currentSong) {
      const otherSongs = songs.filter((_, i) => i !== currentIndex);
      const randomOptions = [...otherSongs]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(s => s.title);
      
      const allOptions = [...randomOptions, currentSong.title].sort(() => 0.5 - Math.random());
      setOptions(allOptions);
      setAnswered(false);
      setSelectedAnswer(null);
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.load();
      }
    }
  }, [currentIndex, currentSong, songs]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedAnswer(answer);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (answer === currentSong.title) {
      setScore(prev => prev + 1);
    }
  };

  const nextSong = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
      setCurrentIndex(0);
    }
  };

  if (!currentSong) return <div className="spinner"></div>;

  return (
    <div className="card text-center" style={{ margin: '0 auto' }}>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#00BFFF' }}>Score: {score}</h3>
      </div>

      <div className="wrapper" onClick={togglePlay} style={{ cursor: 'pointer' }}>
        {/* Usamos exactamente el mismo SPAN que en Player.tsx */}
        <span className={`play ${isPlaying ? 'active' : ''}`}></span>
        
        {answered ? (
          <img 
            src={currentSong.image} 
            alt={currentSong.title} 
            style={{ display: 'block', width: '100%' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            aspectRatio: '1/1', 
            background: '#111', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: '5px',
            border: '1px solid #333'
          }}>
            <span style={{ fontSize: '4rem', opacity: 0.1 }}>?</span>
          </div>
        )}
      </div>

      <audio 
        ref={audioRef} 
        src={currentSong.source} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '20px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={(e) => { e.stopPropagation(); handleAnswer(option); }}
            style={{
              padding: '12px',
              fontSize: '0.9rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#1a1a1a'))
                : '#222',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '5px',
              cursor: answered ? 'default' : 'pointer'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #333' }}>
          <p style={{ marginBottom: '10px' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto! 🎉" : `Era "${currentSong.title}"`}
          </p>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSong(); }}
            style={{ backgroundColor: '#00BFFF', color: 'black', width: '100%' }}
          >
            Siguiente canción
          </button>
        </div>
      )}
    </div>
  );
}
