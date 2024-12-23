import React, { useState } from 'react';
import axios from 'axios';

function Downloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDownload = async (format) => {
    setLoading(true);
    try {
      const endpoint = format === 'mp4' ? '/download/mp4/' : '/convert/mp3/';
      const formData = new FormData();
      formData.append('url', url); // Enviar el campo como FormData
  
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      setDownloadUrl(response.data.url);
    } catch (error) {
      alert('Error al procesar el video.');
    }
    setLoading(false);
  };
  
  return (
    <div className="downloader">
      <h1>Descargar Videos y Convertir a MP3</h1>
      <input
        type="text"
        placeholder="Introduce la URL del video"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={() => handleDownload('mp4')} disabled={loading}>
        Descargar MP4
      </button>
      <button onClick={() => handleDownload('mp3')} disabled={loading}>
        Convertir a MP3
      </button>
      {downloadUrl && (
        <div>
          <p>Archivo listo:</p>
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            Descargar
          </a>
        </div>
      )}
    </div>
  );
}

export default Downloader;
