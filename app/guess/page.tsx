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
      
      // Using Apple Music RSS for Top 50 Songs in Spain (more recognizable for guessing)
      // You can change 'es' to 'us' for global hits
      const url = `https://itunes.apple.com/es/rss/topsongs/limit=50/json`;
      
      const res = await axios.get(url);
      const entries = res.data.feed.entry;
      
      if (entries && entries.length > 0) {
        // Map RSS format to our internal song format
        const mappedSongs = entries.map((entry: any) => ({
          trackName: entry['im:name'].label,
          previewUrl: entry.link.find((l: any) => l.attributes.rel === 'enclosure')?.attributes.href,
          artworkUrl100: entry['im:image'][2]?.label, // Taking the largest available image
          collectionName: entry['im:collection']['im:name'].label
        }));
        
        setSongs(mappedSongs);
      } else {
        setError('No se pudieron cargar los éxitos actuales. Reintentando...');
        setTimeout(getSongs, 2000);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching top songs from iTunes RSS:', err);
      setError('Error al conectar con la lista de éxitos.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, []);

  const formattedSongs = useMemo(() => {
    return songs
      .filter(song => song.trackName && song.artworkUrl100 && song.previewUrl)
      .map((song, index) => ({
        title: song.trackName,
        source: song.previewUrl,
        // The RSS image URL doesn't always follow the same replace pattern, 
        // but we take the 170x170 one which is enough for the game
        image: song.artworkUrl100,
        album: song.collectionName || "Unknown Album",
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Guess the Hit</h2>
          <span style={{ 
            backgroundColor: '#00BFFF', 
            color: 'black', 
            padding: '2px 8px', 
            borderRadius: '10px', 
            fontSize: '0.7rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Top 50 Spain
          </span>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          ¿Reconoces los éxitos del momento? ¡Demuéstralo!
        </p>
        <GuessGame songs={formattedSongs} onNext={getSongs} />
      </div>
    </section>
  );
}
