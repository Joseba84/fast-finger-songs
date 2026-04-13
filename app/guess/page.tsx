"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import GuessGame from '@/components/GuessGame';

export default function GuessPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getSongs = async () => {
    try {
      setLoading(true);
      
      const genres = [
        'Pop Hits', 'Rock Classics', 'Dance Party', '80s Anthems', 
        '90s Hits', 'Indie Rock', 'Electronic', 'Jazz Essentials', 
        'Lo-fi Beats', 'Acoustic Morning', 'Latin Hits', 'Reggaeton'
      ];
      
      const randomGenre = genres[Math.floor(Math.random() * genres.length)];
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(randomGenre)}&limit=30&media=music`;
      
      const res = await axios.get(url);
      const results = res.data.results;
      
      if (results.length > 0) {
        setSongs(results);
      } else {
        setError('No se encontraron canciones. Reintentando...');
        setTimeout(getSongs, 2000);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching songs from iTunes:', err);
      setError('Error al conectar con la API de música.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, []);

  const formattedSongs = useMemo(() => {
    return songs
      .filter(song => song.trackName && song.artworkUrl100 && song.previewUrl && song.collectionName)
      .map((song, index) => ({
        title: song.trackName,
        source: song.previewUrl,
        image: song.artworkUrl100.replace('100x100bb', '400x400bb'),
        album: song.collectionName,
        key: index
      }));
  }, [songs]);

  if (loading) return <div className="spinner"></div>;

  if (error) {
    return (
      <section className="text-center">
        <p>{error}</p>
        <button onClick={() => { setError(null); getSongs(); }}>Reintentar</button>
      </section>
    );
  }

  return (
    <section>
      <div className="guess-game-container">
        <h2>Guess the Song</h2>
        <p style={{ marginBottom: '20px' }}>Listen to the snippet and choose the right song!</p>
        <GuessGame songs={formattedSongs} onNext={getSongs} />
      </div>
    </section>
  );
}
