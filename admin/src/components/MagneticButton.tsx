'use client';
import { MouseEvent, useRef, useState } from 'react';
import Link from 'next/link';

export default function MagneticButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [style, setStyle] = useState({ transform: 'translate(0px, 0px)' });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxDistance = 80; // 👈 detection radius
    const strength = 0.6; // 👈 movement intensity

    if (distance < maxDistance) {
      setStyle({
        transform: `translate(${dx * strength}px, ${dy * strength}px)`,
      });
    } else {
      setStyle({ transform: 'translate(0px, 0px)' });
    }
  };

  const reset = () => {
    setStyle({ transform: 'translate(0px, 0px)' });
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={reset} style={{ display: 'inline-block' }}>
      <Link
        ref={ref}
        href="/dashboard"
        style={{
          display: 'inline-block',
          padding: '11px 24px',
          backgroundColor: '#ffffff',
          color: '#000000',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          textDecoration: 'none',
          transition: 'transform 0.2s ease',
          ...style,
        }}
      >
        Go Back
      </Link>
    </div>
  );
}
