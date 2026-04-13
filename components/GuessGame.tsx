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
    <div className="card text-center" style={{ padding: '0px', maxWidth: '400px', margin: '0 auto', background: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#00BFFF', fontSize: '1.5rem' }}>Score: {score}</h3>
      </div>

      <div style={{ marginBottom: '25px', position: 'relative', cursor: 'pointer' }} onClick={togglePlay}>
         <div style={{ 
            width: '100%', 
            aspectRatio: '1/1', 
            borderRadius: '10px', 
            overflow: 'hidden',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #222',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            position: 'relative'
         }}>
            {answered ? (
              <img 
                src={currentSong.image} 
                alt="Song cover" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(45deg, #050505 0%, #1a1a1a 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '5rem', opacity: 0.2 }}>🎵</span>
                <p style={{ fontWeight: 'bold', letterSpacing: '3px', opacity: 0.4, fontSize: '0.8rem' }}>GUESS THE SONG</p>
              </div>
            )}

            {/* Play/Pause Overlay Button */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              border: '2px solid #00BFFF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00BFFF',
              zIndex: 10,
              transition: 'all 0.3s ease',
              opacity: isPlaying && !answered ? 0.3 : 1
            }}>
               {isPlaying ? (
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
               ) : (
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '5px' }}><path d="M8 5v14l11-7z"/></svg>
               )}
            </div>
         </div>
         <audio ref={audioRef} src={currentSong.source} onEnded={() => setIsPlaying(false)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={(e) => { e.stopPropagation(); handleAnswer(option); }}
            style={{
              padding: '14px',
              fontSize: '1rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#111'))
                : '#222',
              color: 'white',
              border: answered && option === currentSong.title ? '2px solid white' : '1px solid #333',
              borderRadius: '5px',
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
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(255,255,255,0.05)', 
          borderRadius: '5px',
          border: '1px solid #333'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto! 🎉" : `Incorrecto. Era "${currentSong.title}"`}
          </p>
          <button 
            onClick={(e) => { e.stopPropagation(); nextSong(); }}
            style={{ 
              backgroundColor: '#00BFFF', 
              color: 'black', 
              fontWeight: 'bold', 
              padding: '12px 0',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            Siguiente canción
          </button>
        </div>
      )}
    </div>
  );
}
