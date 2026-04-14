"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import GuessGame from '@/components/GuessGame';

interface Song {
  trackName: string;
  previewUrl: string;
  artworkUrl100: string;
  collectionName: string;
}

export default function GuessPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getSongs = async () => {
    try {
      setLoading(true);
      
      const url = `https://itunes.apple.com/es/rss/topsongs/limit=50/json`;
      const res = await axios.get(url);
      const entries = res.data.feed.entry;
      
      if (entries && entries.length > 0) {
        const mappedSongs = entries.map((entry: any) => {
          // Get the preview URL carefully from the link array
          const previewLink = entry.link.find((l: any) => l.attributes.rel === 'enclosure');
          const previewUrl = previewLink ? previewLink.attributes.href : null;
          
          // Get the largest image (usually index 2 in the im:image array)
          const imageArray = entry['im:image'];
          const artworkUrl = imageArray && imageArray.length > 0 ? imageArray[imageArray.length - 1].label : null;

          return {
            trackName: entry['im:name'].label,
            previewUrl: previewUrl,
            artworkUrl100: artworkUrl,
            collectionName: entry['im:collection']?.['im:name']?.label || "Unknown Album"
          };
        });
        
        // Filter out songs without preview or image to avoid broken UI
        setSongs(mappedSongs.filter((s: Song) => s.previewUrl && s.artworkUrl100));
      } else {
        setError('No se pudieron cargar los éxitos actuales. Reintentando...');
        setTimeout(() => { getSongs(); }, 2000);
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
    return songs.map((song, index) => ({
        title: song.trackName,
        source: song.previewUrl,
        image: song.artworkUrl100,
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
    <section style={{ 
      maxHeight: 'calc(100vh - 180px)', 
      overflowY: 'auto', 
      paddingBottom: '20px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#00BFFF #111'
    }}>
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
        <GuessGame songs={formattedSongs} onNext={getSongs} />
      </div>
    </section>
  );
}
