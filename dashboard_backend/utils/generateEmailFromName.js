export const generateEmailFromName = (name) => {
  if (!name) return null;

  // 🧩 Format name
  const formattedName = name
    .trim()
    .toLowerCase()
    .normalize("NFD") // remove accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s]/g, "") // remove special chars
    .replace(/\s+/g, "."); // replace spaces with dots

  // 🔢 Generate random 3-digit number (100–999)
  const randomNum = Math.floor(100 + Math.random() * 900);

  // 📧 Return full email
  return `${formattedName}${randomNum}@smab.com`;
};
