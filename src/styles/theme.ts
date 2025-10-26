export const theme = {
  colors: {
    background: '#FDFBF6',
    text: '#4A443F',
    primary: '#F9B572', // 蜜桃橙
    accentYellow: '#FEEA91', // 便利贴黄
    accentGreen: '#B4D9D0', // 真诚绿
    neutral: '#D9D6D2',
    white: '#FFFFFF',
  },
  fonts: {
    heading: "'Nunito', sans-serif",
    body: "'Inter', sans-serif",
    handwriting: "'Caveat', cursive",
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
    pill: '50px',
  },
  shadows: {
    soft: '0 2px 8px rgba(74, 68, 63, 0.08)',
    medium: '0 4px 16px rgba(74, 68, 63, 0.12)',
    strong: '0 8px 24px rgba(74, 68, 63, 0.16)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  transitions: {
    fast: '0.15s ease-out',
    medium: '0.25s ease-out',
    slow: '0.4s ease-out',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
};

export type Theme = typeof theme;