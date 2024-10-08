// src/components/VideoDownloader.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VideoDownloader.css';

const VideoDownloader = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const ws = new WebSocket('wss://videodownloaderbackend.onrender.com');
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.progress !== null) {
                setProgress(message.progress);
            }
        };

        return () => {
            ws.close();
        };
    }, []);

    const handleDownload = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await axios.post('https://videodownloaderbackend.onrender.com/api/download', { url }, { responseType: 'blob' });

            const contentType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: contentType });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'video.mp4';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error during download:', err);
            setError('Error downloading the video');
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="video-downloader">
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube video URL"
            />
            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Downloading...' : 'Download Video'}
            </button>
            {loading && <p className="progress">Progress: {progress}%</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default VideoDownloader;
