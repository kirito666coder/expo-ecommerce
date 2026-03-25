'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect } from 'react';
import './sign-in.css';

export default function SignInPage() {
  useEffect(() => {
    const remove = () => {
      document.querySelectorAll('*').forEach((el) => {
        const style = window.getComputedStyle(el);
        const bg = style.backgroundColor;
        if (bg.includes('251, 191') || bg.includes('246, 192') || bg.includes('234, 179')) {
          (el as HTMLElement).style.backgroundColor = '#1a1a1a';
          (el as HTMLElement).style.color = '#555555';
          (el as HTMLElement).style.borderColor = '#2a2a2a';
        }
      });
    };
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true, subtree: true });
    remove();
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sign-in-wrapper">
      {/* LEFT — black side */}
      <div className="left-panel">
        <div className="dot-white" />
        <div className="left-content">
          <div className="left-logo">⚡</div>
          <h1>Your App</h1>
          <p>A modern workspace built for teams that move fast.</p>
        </div>
      </div>

      {/* RIGHT — white side */}
      <div className="right-panel">
        <div className="dot-black" />
        <div className="right-content">
          <SignIn
            appearance={{
              variables: {
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorPrimary: '#000000',
                colorInputBackground: '#f5f5f5',
                colorInputText: '#000000',
                colorTextSecondary: '#888888',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              elements: {
                rootBox: { width: '100%' },

                card: {
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0',
                  boxShadow: 'none',
                  padding: '30px 0',
                },

                headerTitle: { display: 'block' },
                headerSubtitle: { display: 'block' },

                socialButtonsBlockButton: {
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  color: '#000000',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '11px 16px',
                  transition: 'all 0.15s ease',
                },

                socialButtonsBlockButtonText: {
                  color: '#000000',
                  fontWeight: '500',
                },

                dividerLine: { background: '#e5e5e5' },
                dividerText: { color: '#aaaaaa', fontSize: '12px' },

                formFieldLabel: {
                  color: '#666666',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                },

                formFieldInput: {
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  borderRadius: '10px',
                  color: '#000000',
                  fontSize: '14px',
                  padding: '11px 14px',
                },

                formButtonPrimary: {
                  background: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '14px',
                  letterSpacing: '0.3px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
                formButtonPrimary__hover: {
                  background: '#111111',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                },

                footerActionLink: { color: '#000000', fontWeight: '600' },
                footerActionText: { color: '#aaaaaa' },

                identityPreviewText: { color: '#000000' },
                identityPreviewEditButton: { color: '#000000' },

                formFieldInputShowPasswordButton: { color: '#aaaaaa' },
                alertText: { color: '#000000' },
                formResendCodeLink: { color: '#000000' },

                footer: {
                  display: 'none',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
