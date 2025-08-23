import React from 'react';

export const AnimatedBackground = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, 
      overflow: 'hidden',
      background: '#E1E6F7'
    }}>
      {/* Основной SVG слой с плавными градиентами */}
      <svg 
        viewBox="0 0 1080 1920" 
        preserveAspectRatio="xMidYMid slice" 
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      >
        <defs>
          {/* Большой рассеянный градиент - очень деликатный */}
          <radialGradient id="MainGradient" cx="30%" cy="70%" r="80%">
            <animate attributeName="cx" dur="50s" values="20%;80%;20%" repeatCount="indefinite" />
            <animate attributeName="cy" dur="45s" values="60%;30%;60%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(0, 71, 255, 0.04)" />
            <stop offset="60%" stopColor="rgba(64, 123, 255, 0.03)" />
            <stop offset="100%" stopColor="rgba(0, 71, 255, 0)" />
          </radialGradient>

          {/* Верхний акцентный градиент - светлый */}
          <radialGradient id="TopGradient" cx="30%" cy="10%" r="40%">
            <animate attributeName="cx" dur="60s" values="20%;80%;20%" repeatCount="indefinite" />
            <animate attributeName="cy" dur="40s" values="5%;25%;5%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="70%" stopColor="rgba(0, 71, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Нижний акцентный градиент - мягкий */}
          <radialGradient id="BottomGradient" cx="70%" cy="90%" r="45%">
            <animate attributeName="cx" dur="55s" values="60%;40%;60%" repeatCount="indefinite" />
            <animate attributeName="cy" dur="50s" values="85%;95%;85%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(0, 71, 255, 0.12)" />
            <stop offset="60%" stopColor="rgba(64, 123, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(0, 71, 255, 0)" />
          </radialGradient>

          {/* Левый боковой градиент - нежный */}
          <radialGradient id="LeftGradient" cx="0%" cy="60%" r="35%">
            <animate attributeName="cy" dur="65s" values="40%;80%;40%" repeatCount="indefinite" />
            <animate attributeName="r" dur="45s" values="30%;50%;30%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(200, 210, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(0, 71, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(200, 210, 255, 0)" />
          </radialGradient>

          {/* Правый боковой градиент - светлый акцент */}
          <radialGradient id="RightGradient" cx="100%" cy="30%" r="38%">
            <animate attributeName="cy" dur="70s" values="20%;70%;20%" repeatCount="indefinite" />
            <animate attributeName="r" dur="55s" values="35%;55%;35%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="60%" stopColor="rgba(64, 123, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>

          {/* Диагональный градиент - более абстрактный */}
          <linearGradient id="DiagonalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <animate attributeName="x1" dur="40s" values="0%;20%;0%" repeatCount="indefinite" />
            <animate attributeName="y1" dur="35s" values="0%;15%;0%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="50%" stopColor="rgba(0, 71, 255, 0.04)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Дополнительные мелкие акценты - очень мягкие */}
          <radialGradient id="Accent1" cx="25%" cy="25%" r="15%">
            <animate attributeName="cx" dur="80s" values="15%;35%;15%" repeatCount="indefinite" />
            <animate attributeName="cy" dur="90s" values="15%;35%;15%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(0, 71, 255, 0.06)" />
            <stop offset="100%" stopColor="rgba(0, 71, 255, 0)" />
          </radialGradient>

          <radialGradient id="Accent2" cx="75%" cy="75%" r="18%">
            <animate attributeName="cx" dur="75s" values="65%;85%;65%" repeatCount="indefinite" />
            <animate attributeName="cy" dur="85s" values="65%;85%;65%" repeatCount="indefinite" />
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>

        {/* Основные анимированные элементы */}
        <rect width="100%" height="100%" fill="url(#MainGradient)" />
        <rect width="100%" height="100%" fill="url(#TopGradient)" />
        <rect width="100%" height="100%" fill="url(#BottomGradient)" />
        <rect width="100%" height="100%" fill="url(#LeftGradient)" />
        <rect width="100%" height="100%" fill="url(#RightGradient)" />
        <rect width="100%" height="100%" fill="url(#DiagonalGradient)" />
        <rect width="100%" height="100%" fill="url(#Accent1)" />
        <rect width="100%" height="100%" fill="url(#Accent2)" />
      </svg>

      {/* Дополнительный слой с плавающими частицами - светлый */}
      <div style={{ 
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 71, 255, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(200, 210, 255, 0.2) 0%, transparent 50%)
        `,
        animation: 'float 60s ease-in-out infinite'
      }} />

      {/* CSS анимации */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.8;
          }
          33% { 
            transform: translateY(-20px) rotate(120deg);
            opacity: 1;
          }
          66% { 
            transform: translateY(10px) rotate(240deg);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
};