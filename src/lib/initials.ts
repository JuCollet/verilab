/** « Demo User 1 » → « U1 » (le préfixe « Demo » est ignoré), « Jean Dupont » → « JD ». */
export const initials = (name: string) =>
  name
    .replace(/^Demo\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
