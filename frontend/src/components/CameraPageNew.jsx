import React, { useRef, useState, useEffect } from 'react';

export default function CameraPage({ onNavigate, darkMode, onCapture }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const isSecure = window.isSecureContext || location.protocol === 'https:';

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = s;
      setStream(s);
      setStreaming(true);
    } catch (err) {
      console.error('getUserMedia error', err);
      setError('Could not access camera. Check permissions or use the button below.');
    }
  };

  const sendImage = async (blob) => {
    setAnalyzing(true);
    setError(null);
    try {
      await onCapture(blob);
      if (stream) stream.getTracks().forEach(t => t.stop());
      onNavigate('search');
    } catch (err) {
      console.error(err);
      setError('Could not analyze the photo. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) sendImage(blob);
    }, 'image/jpeg', 0.9);
  };

  // Fallback: file input that opens camera on mobile browsers even over HTTP
  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    sendImage(file);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
      <h2 style={{ color: '#E8591A', marginBottom: 12 }}>Scan your ingredients</h2>
      <p style={{ color: darkMode ? '#A8A098' : '#8A7F70', marginBottom: 20 }}>
        Point your camera at what's in your fridge or pantry.
      </p>

      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', borderRadius: 14, background: '#000', marginBottom: 16 }} />

      {error && <p style={{ color: '#E8591A' }}>{error}</p>}
      {analyzing && <p style={{ color: darkMode ? '#A8A098' : '#8A7F70' }}>🔍 Analyzing your photo…</p>}

      {isSecure && navigator.mediaDevices ? (
        !streaming ? (
          <button onClick={startCamera} disabled={analyzing} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#E8591A', color: '#fff', fontWeight: 700, cursor: analyzing ? 'default' : 'pointer', opacity: analyzing ? 0.6 : 1 }}>
            Enable camera
          </button>
        ) : (
          <button onClick={capture} disabled={analyzing} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: analyzing ? '#F0A47D' : '#E8591A', color: '#fff', fontWeight: 700, cursor: analyzing ? 'default' : 'pointer' }}>
            {analyzing ? 'Analyzing…' : 'Capture'}
          </button>
        )
      ) : (
        <div>
          <p style={{ color: darkMode ? '#A8A098' : '#8A7F70' }}>Camera via browser requires HTTPS. Use the button below as a fallback.</p>
          <label style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 10, background: '#E8591A', color: '#fff', fontWeight: 700, cursor: 'pointer', opacity: analyzing ? 0.6 : 1 }}>
            {analyzing ? 'Analyzing…' : 'Open camera'}
            <input type="file" accept="image/*" capture="environment" onChange={onFileChange} disabled={analyzing} style={{ display: 'none' }} />
          </label>
        </div>
      )}
    </div>
  );
}