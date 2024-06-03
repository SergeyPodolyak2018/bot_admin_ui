export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const minRGBValue = parseInt('7E', 16); // #7E7E7E
  const maxRGBValue = parseInt('A6', 16); // #A6A6A6

  const r = Math.max(minRGBValue, Math.min(hash & 0xff, maxRGBValue));
  const g = Math.max(minRGBValue, Math.min((hash >> 8) & 0xff, maxRGBValue));
  const b = Math.max(minRGBValue, Math.min((hash >> 16) & 0xff, maxRGBValue));

  const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
    .toString(16)
    .padStart(2, '0')}`;

  return color;
};

export const stringAvatar = (name: string, color?: string) => {
  if (name === '') return;
  return {
    style: {
      backgroundColor: color || stringToColor(name),
    },
    children: `${name[0]?.toUpperCase()}`,
  };
};

export const validateEmails = (emails: string) => {
  const arr = emails.split(',').map((e) => e.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return arr.every((email) => emailRegex.test(email));
};
