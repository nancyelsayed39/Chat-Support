// Optional: Advanced Logo Component (SVG-based)
// Save this as: src/components/Logo.jsx

import React from 'react';

export const ChatHubLogo = ({ size = 32, className = '' }) => {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #128c7e, #25d366)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.6,
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
        cursor: 'pointer',
      }}
      title="ChatHub"
    >
      💬
    </div>
  );
};

export const ChatHubBrand = ({ showText = true, size = 32, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
      }}
    >
      <ChatHubLogo size={size} />
      {showText && (
        <span
          style={{
            fontWeight: '700',
            background: 'linear-gradient(135deg, #25d366, #34b7f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: size * 0.75,
          }}
        >
          ChatHub
        </span>
      )}
    </div>
  );
};

// Usage:
// <ChatHubLogo size={40} />
// <ChatHubBrand />
// <ChatHubBrand showText={false} size={36} />


// ============================================
// ALTERNATIVE: Custom SVG Logo (Premium Look)
// ============================================

export const ChatHubSVGLogo = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #128c7e, #25d366)',
        padding: '4px',
      }}
    >
      {/* Chat bubble 1 */}
      <circle cx="12" cy="14" r="4" fill="#ffffff" opacity="0.9" />
      {/* Chat bubble 2 */}
      <circle cx="20" cy="18" r="3" fill="#ffffff" opacity="0.8" />
      {/* Connection line */}
      <line x1="14" y1="12" x2="19" y2="16" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
};

// ============================================
// Avatar Component for User Profile
// ============================================

export const UserAvatar = ({ name = 'User', size = 40 }) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, #128c7e, #25d366)`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: '700',
        fontSize: size * 0.4,
        border: '2px solid #25d366',
        boxShadow: '0 2px 8px rgba(37, 211, 102, 0.2)',
      }}
      title={name}
    >
      {initials || '👤'}
    </div>
  );
};

// ============================================
// Status Indicator Component
// ============================================

export const StatusIndicator = ({ isOnline = true, size = 12 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: isOnline ? '#25d366' : '#ff4757',
        display: 'inline-block',
        animation: isOnline ? 'pulse 2s infinite' : 'none',
        border: `2px solid var(--surface)`,
        boxShadow: isOnline ? '0 0 8px rgba(37, 211, 102, 0.4)' : 'none',
      }}
    />
  );
};

// ============================================
// Branding Guide
// ============================================

/*
ChatHub Branding Guidelines:

PRIMARY COLORS:
  - Teal/Primary: #128c7e (Similar to WhatsApp)
  - Accent/Green: #25d366 (Fresh and energetic)
  - Secondary/Blue: #34b7f1 (Complementary)

DARK THEME:
  - Background: #0a0e27
  - Surface: #1a1f3a
  - Surface Light: #252d48
  - Text Primary: #ffffff
  - Text Secondary: #b0b3b8

GRADIENTS:
  - Primary: linear-gradient(135deg, #128c7e, #25d366)
  - Secondary: linear-gradient(135deg, #34b7f1, #128c7e)
  - Accent: linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(52, 183, 241, 0.2))

SHADOWS:
  - Elevation 1: 0 2px 8px rgba(0, 0, 0, 0.2)
  - Elevation 2: 0 4px 12px rgba(37, 211, 102, 0.3)
  - Elevation 3: 0 6px 20px rgba(25, 211, 102, 0.4)

ROUNDED CORNERS:
  - Small: 8px (inputs, small buttons)
  - Medium: 12px (cards, messages)
  - Large: 16px (large containers)
  - Circular: 50% (avatars, round buttons)

ANIMATIONS:
  - Smooth duration: 0.2s - 0.3s (UI interactions)
  - Standard duration: 0.5s - 0.6s (page transitions)
  - Long duration: 1.5s - 2s (loading states)
  - Easing: ease-out (entrances), ease-in-out (transitions)
*/
