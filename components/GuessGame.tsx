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
      // Generate options: 1 correct + 3 random ones from the rest of the list
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

      // We don't auto-play to avoid browser restrictions, 
      // but we prepare the audio
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
    
    // Stop music when answered (optional, depends on preference)
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
      onNext(); // This could trigger getting more songs
      setCurrentIndex(0);
    }
  };

  if (!currentSong) return <div className="spinner"></div>;

  return (
    <div className="card text-center" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Score: {score}</h3>
        <button 
          onClick={togglePlay}
          style={{ 
            backgroundColor: '#00BFFF', 
            color: 'black', 
            border: 'none', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="guess-player" style={{ marginBottom: '20px' }}>
         <div className="wrapper" style={{ margin: '0 auto', maxWidth: '250px', position: 'relative' }}>
            {/* Using a simplified version of the project's play indicator */}
            <span className={`play ${isPlaying ? 'active' : ''}`} onClick={togglePlay}></span>
            <img 
              src={answered ? currentSong.image : "https://via.placeholder.com/400x400/333/fff?text=?"} 
              alt="Guess the song" 
              style={{ 
                borderRadius: '10px', 
                width: '100%', 
                display: 'block',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            />
         </div>
         <audio 
           ref={audioRef} 
           src={currentSong.source}
           onPlay={() => setIsPlaying(true)}
           onPause={() => setIsPlaying(false)}
           onEnded={() => setIsPlaying(false)}
         />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '20px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={() => handleAnswer(option)}
            style={{
              padding: '12px 15px',
              fontSize: '1rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#1a1a1a'))
                : '#333',
              color: 'white',
              border: answered && option === currentSong.title ? '2px solid #fff' : '1px solid #444',
              borderRadius: '8px',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto! 🎉" : `Incorrecto. Era "${currentSong.title}"`}
          </p>
          <button 
            onClick={nextSong}
            style={{ 
              backgroundColor: '#00BFFF', 
              color: 'black', 
              fontWeight: 'bold', 
              padding: '10px 25px' 
            }}
          >
            Siguiente canción
          </button>
        </div>
      )}
    </div>
  );
}
