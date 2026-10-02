import React, { useEffect, useRef } from 'react';

export default function AmbientEffects({ mode = "default" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle count: 35 for smooth performance
    const particleCount = mode === 'success' ? 55 : mode === 'timeout' ? 30 : 35;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.6 - 0.2, // drifting upwards like sparks / dust
        alpha: Math.random() * 0.6 + 0.2,
        alphaChange: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: mode === 'timeout'
          ? `rgba(255, ${Math.floor(Math.random() * 60 + 40)}, 40, `
          : mode === 'success'
          ? `rgba(255, ${Math.floor(Math.random() * 80 + 175)}, 50, `
          : `rgba(255, ${Math.floor(Math.random() * 60 + 190)}, 90, `
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaChange;

        if (p.alpha <= 0.1 || p.alpha >= 0.8) {
          p.alphaChange = -p.alphaChange;
        }

        // Wrap around
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = mode === 'timeout' ? 6 : 8;
        ctx.shadowColor = mode === 'timeout' ? '#ff2200' : '#ffcc00';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  return (
    <>
      {/* Canvas for floating glowing dust / embers */}
      <canvas
        ref={canvasRef}
        className="ambient-particles-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      
      {/* Warm lantern corner flickers */}
      <div className={`lantern-glow-left ${mode === 'timeout' ? 'timeout-glow' : ''}`} />
      <div className={`lantern-glow-right ${mode === 'timeout' ? 'timeout-glow' : ''}`} />
    </>
  );
}
