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
    <div className="card text-center" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#00BFFF' }}>Score: {score}</h3>
        <button 
          onClick={togglePlay}
          style={{ 
            backgroundColor: '#00BFFF', 
            color: 'black', 
            border: 'none', 
            borderRadius: '50%', 
            width: '50px', 
            height: '50px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,191,255,0.3)'
          }}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>

      <div style={{ marginBottom: '25px', position: 'relative' }}>
         <div style={{ 
            width: '100%', 
            aspectRatio: '1/1', 
            borderRadius: '15px', 
            overflow: 'hidden',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #333',
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
         }}>
            {answered ? (
              <img 
                src={currentSong.image} 
                alt="Song cover" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #1a1a1a 0%, #003366 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}>
                <span style={{ fontSize: '4rem', marginBottom: '10px' }}>?</span>
                <p style={{ fontWeight: 'bold', letterSpacing: '2px', opacity: 0.7 }}>GUESS THE SONG</p>
              </div>
            )}
         </div>
         <audio ref={audioRef} src={currentSong.source} onEnded={() => setIsPlaying(false)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={() => handleAnswer(option)}
            style={{
              padding: '14px',
              fontSize: '1rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#222'))
                : '#333',
              color: 'white',
              border: answered && option === currentSong.title ? '2px solid white' : '1px solid #444',
              borderRadius: '10px',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.2s',
              fontWeight: answered && option === currentSong.title ? 'bold' : 'normal'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ 
          marginTop: '25px', 
          padding: '20px', 
          backgroundColor: 'rgba(0,191,255,0.1)', 
          borderRadius: '15px',
          border: '1px solid rgba(0,191,255,0.2)'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto! 🎯" : `Era "${currentSong.title}"`}
          </p>
          <button 
            onClick={nextSong}
            style={{ 
              backgroundColor: '#00BFFF', 
              color: 'black', 
              fontWeight: 'bold', 
              padding: '12px 30px',
              width: '100%',
              fontSize: '1.1rem'
            }}
          >
            Siguiente éxito
          </button>
        </div>
      )}
    </div>
  );
}
