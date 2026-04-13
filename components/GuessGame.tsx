"use client";

import { useState, useEffect, useMemo, useRef } from 'react';

interface GuessGameProps {
  songs: any[];
  onNext: () => void;
}

export default function GuessGame({ songs, onNext }: GuessGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    if (currentSong && !answered) {
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
      setCorrectAnswer(null);

      // Play the song snippet
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(e => console.log("Play failed", e));
      }
    }
  }, [currentIndex, currentSong]);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(answer);
    setCorrectAnswer(currentSong.title);
    
    if (answer === currentSong.title) {
      setScore(prev => prev + 1);
    }
  };

  const nextSong = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
    } else {
      onNext(); // This could trigger getting more songs
    }
  };

  if (!currentSong) return <div className="spinner"></div>;

  return (
    <div className="card text-center">
      <h3>Score: {score}</h3>
      <div className="guess-player" style={{ marginBottom: '20px' }}>
         <div className="wrapper" style={{ margin: '0 auto', maxWidth: '200px' }}>
            <span className={`play ${!answered ? 'active' : ''}`}></span>
            <img 
              src={answered ? currentSong.image : "https://via.placeholder.com/400x400/333/fff?text=?"} 
              alt="Guess the song" 
              style={{ borderRadius: '10px' }}
            />
         </div>
         <audio 
           ref={audioRef} 
           src={currentSong.source}
         />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
        {options.map((option, idx) => (
          <button 
            key={idx} 
            onClick={() => handleAnswer(option)}
            style={{
              padding: '10px',
              fontSize: '0.9rem',
              backgroundColor: answered 
                ? (option === currentSong.title ? '#28a745' : (option === selectedAnswer ? '#dc3545' : '#333'))
                : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: answered ? 'default' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 'bold' }}>
            {selectedAnswer === currentSong.title ? "¡Correcto!" : `Incorrecto. Era "${currentSong.title}"`}
          </p>
          <button onClick={nextSong}>Next Song</button>
        </div>
      )}
    </div>
  );
}
