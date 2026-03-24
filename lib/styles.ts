/**
 * STYLEGUIDE.md Inline Style Helpers
 * Centralized style definitions for consistency across mission-control-dashboard
 */

export const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Colors
export const colors = {
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.6)',
    tertiary: 'rgba(255, 255, 255, 0.4)',
  },
  background: {
    card: 'rgba(255, 255, 255, 0.08)',
    cardHover: 'rgba(255, 255, 255, 0.15)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.12)',
    hover: 'rgba(255, 255, 255, 0.25)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  },
};

// Spacing (8px base)
export const spacing = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
};

// Typography
export const typography = {
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: '1.2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  body: {
    fontSize: '0.95rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  small: {
    fontSize: '0.85rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
};

// Border radius
export const borderRadius = {
  sm: '12px',
  md: '16px',
};

// Common style objects
export const styles = {
  // Page background
  pageBackground: {
    minHeight: '100vh',
    background: colors.gradient,
    color: colors.text.primary,
    fontFamily,
    padding: spacing.md,
  },

  // Card/Container base
  card: {
    background: colors.background.card,
    backdropFilter: 'blur(12px)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    border: `1px solid ${colors.border.default}`,
  },

  // Card hover state helper (use with onMouseEnter/onMouseLeave)
  cardHoverEnter: (el: HTMLElement) => {
    el.style.background = colors.background.cardHover;
    el.style.borderColor = colors.border.hover;
    el.style.transition = 'all 0.3s ease';
  },

  cardHoverLeave: (el: HTMLElement) => {
    el.style.background = colors.background.card;
    el.style.borderColor = colors.border.default;
  },

  // Button primary
  buttonPrimary: {
    background: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    padding: '0.75rem 1rem',
    color: colors.text.primary,
    cursor: 'pointer',
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    transition: 'all 0.3s ease',
  },

  // Button secondary (transparent)
  buttonSecondary: {
    background: 'transparent',
    border: 'none',
    color: colors.text.primary,
    cursor: 'pointer',
    fontSize: typography.body.fontSize,
    fontWeight: 500,
    padding: 0,
    transition: 'all 0.3s ease',
  },

  // Back button (← Zurück)
  backButton: {
    background: 'transparent',
    border: 'none',
    color: colors.text.primary,
    cursor: 'pointer',
    marginBottom: spacing.md,
    fontSize: typography.body.fontSize,
    fontWeight: 500,
    padding: 0,
  },

  // Status dot
  statusDot: {
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: spacing.xs,
  },

  // Container max width
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // Grid responsive
  gridResponsive: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: spacing.sm,
  },
};

// Helper to merge styles
export const mergeStyles = (
  ...styleObjects: (React.CSSProperties | undefined | false)[]
): React.CSSProperties => {
  return Object.assign({}, ...styleObjects.filter(Boolean));
};
