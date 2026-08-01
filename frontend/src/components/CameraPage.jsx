import React, { useRef, useState } from 'react';

export default function CameraPage({ onNavigate, darkMode }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      setError('Could not access camera. Check permissions.');
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    // TODO: send dataUrl to your ingredient-recognition endpoint
    console.log('Captured image', dataUrl.slice(0, 40));
    onNavigate('search');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
      <h2 style={{ color: '#E8591A', marginBottom: 12 }}>Scan your ingredients</h2>
      <p style={{ color: darkMode ? '#A8A098' : '#8A7F70', marginBottom: 20 }}>
        Point your camera at what's in your fridge or pantry.
      </p>

      <video ref={videoRef} autoPlay playsInline style={{
        width: '100%', borderRadius: 14, background: '#000', marginBottom: 16,
      }} />

      {error && <p style={{ color: '#E8591A' }}>{error}</p>}

      {!streaming ? (
        <button onClick={startCamera} style={{
          padding: '10px 24px', borderRadius: 10, border: 'none',
          background: '#E8591A', color: '#fff', fontWeight: 700, cursor: 'pointer',
        }}>
          Enable camera
        </button>
      ) : (
        <button onClick={capture} style={{
          padding: '10px 24px', borderRadius: 10, border: 'none',
          background: '#E8591A', color: '#fff', fontWeight: 700, cursor: 'pointer',
        }}>
          Capture
        </button>
      )}
    </div>
  );
}