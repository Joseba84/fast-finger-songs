"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Player from '@/components/Player';
import Roller from '@/components/Roller';

interface Song {
  title: string;
  source: string;
  image: string;
  album: string;
  key: number;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [playlist, setPlaylist] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getPlaylist = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 9);
      const url = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/chart';
      const res = await axios.get(url);
      const selectedPlaylist = res.data.playlists.data[randomNumber];
      setPlaylist(selectedPlaylist);
      getSongs(selectedPlaylist.id);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    }
  };

  const getSongs = async (playlistId: number) => {
    try {
      const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/playlist/${playlistId}`;
      const res = await axios.get(url);
      setSongs(res.data.tracks.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  const formattedSongs = useMemo(() => {
    return songs
      .filter(song => song.title !== '' && song.album.cover_big !== '' && song.preview !== '' && song.album.title !== '')
      .map((song, index) => ({
        title: song.title,
        source: song.preview,
        image: song.album.cover_big,
        album: song.album.title,
        key: index
      }));
  }, [songs]);

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
