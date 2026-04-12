"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Player from '@/components/Player';
import Roller from '@/components/Roller';

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState({ title: 'Loading...', picture: '' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getSongs = async () => {
    try {
      setLoading(true);
      setCurrentIndex(0);
      
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
        setPlaylistInfo({
          title: randomGenre,
          picture: results[0].artworkUrl100.replace('100x100bb', '600x600bb')
        });
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
      <article className="grid">
        <div className="card">
          {!loading && formattedSongs.length > 0 ? (
            <Player 
              songs={formattedSongs} 
              currentIndex={currentIndex} 
              onNext={() => setCurrentIndex(prev => prev + 1)} 
            />
          ) : (
            <div className="spinner"></div>
          )}
        </div>
        <Roller songs={formattedSongs} activeIndex={currentIndex} />
        {!loading && (
          <aside className="playlist">
            <h2>Playlist</h2>
            <img src={playlistInfo.picture} alt={playlistInfo.title} className="playlist-image" />
            <h3 style={{ color: '#00BFFF', marginTop: '10px' }}>{playlistInfo.title}</h3>
            <button 
              onClick={getSongs} 
              style={{ marginTop: '20px', fontSize: '0.8rem', padding: '8px 15px' }}
            >
              Shuffle Playlist
            </button>
          </aside>
        )}
      </article>
    </section>
  );
}
