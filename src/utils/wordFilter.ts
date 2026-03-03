// Prosta lista wulgaryzmów (można rozszerzyć o zewnętrzną bibliotekę lub API)
const BAD_WORDS = [
  'kurwa', 'chuj', 'jebac', 'pierdole', 'cipa', 'kutas', 'szmata',
  'debil', 'idiota', 'pedał', 'ciota', 'chuju', 'kurwie', 'jebany'
];

export const filterText = (text: string): string => {
  if (!text) return '';
  
  let filteredText = text;
  
  BAD_WORDS.forEach((word) => {
    // Prosty regex z fuzzy matchingiem (np. powtarzające się litery)
    const regex = new RegExp(word.split('').join('+'), 'gi');
    filteredText = filteredText.replace(regex, '####');
  });
  
  return filteredText;
};
