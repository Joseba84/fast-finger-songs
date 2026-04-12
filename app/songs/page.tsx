"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Player from '@/components/Player';
import Roller from '@/components/Roller';

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlistInfo, setPlaylistInfo] = useState({ title: 'Top Hits', picture: 'https://is1-ssl.mzstatic.com/image/thumb/Purple122/v4/4a/01/5e/4a015e5a-273a-4a2e-8a2e-5a5a5a5a5a5a/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-10.png/512x512bb.jpg' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getSongs = async () => {
    try {
      setLoading(true);
      // Usamos la API de iTunes Search para obtener canciones populares (Top Hits)
      // No requiere proxy CORS en la mayoría de navegadores modernos
      const terms = ['pop', 'rock', 'dance', 'hits'];
      const randomTerm = terms[Math.floor(Math.random() * terms.length)];
      const url = `https://itunes.apple.com/search?term=${randomTerm}&limit=25&media=music`;
      
      const res = await axios.get(url);
      setSongs(res.data.results);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching songs from iTunes:', err);
      setError('Error al cargar la música. Intenta refrescar.');
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
        image: song.artworkUrl100.replace('100x100bb', '600x600bb'), // Mejoramos la calidad de la imagen
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
            <h3>{playlistInfo.title}</h3>
          </aside>
        )}
      </article>
    </section>
  );
}
