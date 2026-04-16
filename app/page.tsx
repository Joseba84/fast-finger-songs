"use client";

import Link from 'next/link';
import { useState } from 'react';

const GENRES = [
  'Pop Hits', 'Rock Classics', 'Dance Party', '80s Anthems', 
  '90s Hits', 'Indie Rock', 'Electronic', 'Jazz Essentials', 
  'Lo-fi Beats', 'Acoustic Morning', 'Latin Hits', 'Reggaeton'
];

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);

  return (
    <section className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ padding: '40px 20px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', border: '1px solid #333' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Bienvenido a Fast Finger Songs</h2>
        <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '40px' }}>
          La app para los que no pueden dejar de mover los dedos al ritmo de la música.
        </p>

        <div style={{ marginBottom: '50px', padding: '20px', border: '1px dashed #00BFFF', borderRadius: '10px' }}>
          <h3 style={{ color: '#00BFFF', marginBottom: '15px' }}>Configuración de la App</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <label htmlFor="genre-select" style={{ fontWeight: 'bold' }}>Elige tu género favorito:</label>
            <select 
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{ 
                padding: '10px 20px', 
                borderRadius: '5px', 
                backgroundColor: '#111', 
                color: '#fff', 
                border: '1px solid #00BFFF',
                fontSize: '1rem',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              {GENRES.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              Este género se usará para generar tu Playlist aleatoria.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Link href={`/playlist?genre=${encodeURIComponent(selectedGenre)}`} style={{ textDecoration: 'none' }}>
            <div className="card-btn" style={{ 
              padding: '30px', 
              border: '2px solid #00BFFF', 
              borderRadius: '10px', 
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '100%'
            }}>
              <h3 style={{ color: '#00BFFF' }}>Reproductor</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Escucha una playlist aleatoria del género seleccionado.</p>
            </div>
          </Link>
          
          <Link href="/guess" style={{ textDecoration: 'none' }}>
            <div className="card-btn" style={{ 
              padding: '30px', 
              border: '2px solid #00BFFF', 
              borderRadius: '10px', 
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              height: '100%'
            }}>
              <h3 style={{ color: '#00BFFF' }}>Adivina el Hit</h3>
              <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Pon a prueba tus oídos con el Top 50 de España.</p>
            </div>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .card-btn:hover {
          background-color: rgba(0, 191, 255, 0.1);
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 191, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
