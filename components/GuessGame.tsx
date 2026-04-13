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
    <div className="card text-center" style={{ margin: '0 auto', maxWidth: '400px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#00BFFF', fontSize: '1.2rem' }}>Aciertos: {score}</h3>
      </div>

      <div className="wrapper" style={{ 
        position: 'relative', 
        width: '100%', 
        aspectRatio: '1/1', 
        backgroundColor: '#050505', 
        borderRadius: '8px', 
        overflow: 'hidden',
        border: '1px solid #222',
        cursor: 'pointer' 
      }} onClick={togglePlay}>
        
        {/* Play/Pause Button - Custom design */}
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
          {isPlaying ? (
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
        
        {answered ? (
          <img 
            src={currentSong.image} 
            alt={currentSong.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Div plano sin imagen para evitar errores visuales */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '20px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={(e) => { e.stopPropagation(); handleAnswer(option); }}
            style={{
              padding: '12px',
              fontSize: '0.9rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#111'))
                : '#1a1a1a',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '4px',
              cursor: answered ? 'default' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
          <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto! 🎉" : `Era "${currentSong.title}"`}
          </p>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSong(); }}
            style={{ backgroundColor: '#00BFFF', color: 'black', width: '100%', padding: '10px' }}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
