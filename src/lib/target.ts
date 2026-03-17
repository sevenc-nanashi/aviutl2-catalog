export const target: "web" | "desktop" = import.meta.env.VITE_TARGET === 'desktop' ? 'desktop' : 'web';

export const isWeb = target === 'web';
export const isDesktop = target === 'desktop';
