"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Player from '@/components/Player';
import Roller from '@/components/Roller';

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlist, setPlaylist] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchWithProxy = async (targetUrl: string) => {
    // Usamos allorigins.win como proxy de CORS ya que no requiere activación manual
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const res = await axios.get(proxyUrl);
    return JSON.parse(res.data.contents);
  };

  const getPlaylist = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 9);
      const data = await fetchWithProxy('https://api.deezer.com/chart');
      const selectedPlaylist = data.playlists.data[randomNumber];
      setPlaylist(selectedPlaylist);
      getSongs(selectedPlaylist.id);
    } catch (err) {
      console.error('Error fetching playlist:', err);
      setError('Error al cargar la playlist. Intenta refrescar.');
    }
  };

  const getSongs = async (playlistId: number) => {
    try {
      const data = await fetchWithProxy(`https://api.deezer.com/playlist/${playlistId}`);
      setSongs(data.tracks.data);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Error al cargar las canciones.');
    }
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  const formattedSongs = useMemo(() => {
    return songs
      .filter(song => song.title && song.album?.cover_big && song.preview && song.album?.title)
      .map((song, index) => ({
        title: song.title,
        source: song.preview,
        image: song.album.cover_big,
        album: song.album.title,
        key: index
      }));
  }, [songs]);

  if (error) {
    return (
      <section className="text-center">
        <p>{error}</p>
        <button onClick={() => { setError(null); getPlaylist(); }}>Reintentar</button>
      </section>
    );
  }

  return (
    <section>
      <article className="grid">
        <div className="card">
          {formattedSongs.length > 0 ? (
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
        {playlist && (
          <aside className="playlist">
            <h2>Playlist</h2>
            <img src={playlist.picture_xl} alt={playlist.title} className="playlist-image" />
            <h3>{playlist.title}</h3>
          </aside>
        )}
      </article>
    </section>
  );
}
