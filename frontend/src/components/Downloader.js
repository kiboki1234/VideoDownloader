import React, { useState } from 'react';
import axios from 'axios';
import '../Downloader.css'

function Downloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDownload = async (format) => {
    setLoading(true);
    setStatusMessage('Procesando descarga...');

    try {
      const endpoint = format === 'mp4' ? '/download/mp4/' : '/convert/mp3/';
      const formData = new FormData();
      formData.append('url', url);

      // Solicitud al backend
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setDownloadUrl(response.data.url);
      setStatusMessage('Descarga finalizada.');

      // Crear un enlace para descargar el archivo
      const link = document.createElement('a');
      link.href = `http://localhost:5000${response.data.url}`;
      link.download = true;

      // Simula un clic para abrir el explorador de archivos
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      alert('Error al procesar el video.');
      setStatusMessage('Error durante la descarga.');
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
      {loading && <p>{statusMessage}</p>}
      {!loading && statusMessage && <p>{statusMessage}</p>}
    </div>
  );
}

export default Downloader;
