'use client';
import { useState } from 'react';
import MagneticButton from '@/components/MagneticButton';

export default function NotFoundClient() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        {/* Hover Area (small controlled zone) */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'inline-block',
            padding: '20px 30px', // 👈 controls hover area
          }}
        >
          <div
            style={{
              fontSize: 'clamp(100px, 20vw, 200px)',
              fontWeight: '800',
              letterSpacing: '-8px',
              lineHeight: 1,
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {/* First 4 */}
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                display: 'inline-block',
                transform: hovered ? 'translateX(-40px) rotate(-20deg)' : 'translateX(0)',
                transition: 'all 0.5s ease',
              }}
            >
              4
            </span>

            {/* 0 */}
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                display: 'inline-block',
                transform: hovered ? 'translateY(10px)' : 'translateY(0)',
                transition: 'all 0.5s ease',
              }}
            >
              0
            </span>

            {/* Last 4 */}
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                display: 'inline-block',
                transform: hovered ? 'translateX(40px) rotate(20deg)' : 'translateX(0)',
                transition: 'all 0.5s ease',
              }}
            >
              4
            </span>
          </div>
        </div>

        <div
          style={{
            width: '40px',
            height: '1px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            margin: '1.5rem auto',
          }}
        />

        <h1
          style={{
            color: '#ffffff',
            fontSize: 'clamp(18px, 3vw, 28px)',
            fontWeight: '600',
            margin: '0 0 12px',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            color: '#444444',
            fontSize: '15px',
            margin: '0 0 2.5rem',
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>

        <MagneticButton />
      </div>
    </div>
  );
}
