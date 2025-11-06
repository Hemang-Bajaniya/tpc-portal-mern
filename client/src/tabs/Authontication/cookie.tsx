export function getUserFromCookie(): any | null {
  const match = document.cookie.match(/(^| )student_user=([^;]+)/);
  if (!match) return null;

  try {
    const raw = decodeURIComponent(match[2]);
    const clean = raw.startsWith('j:') ? raw.slice(2) : raw;
    return JSON.parse(clean);
  } catch (error) {
    console.error('Invalid user cookie:', error);
    return null;
  }
}