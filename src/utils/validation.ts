export const isValidTebEmail = (email: string): boolean => {
  return email.endsWith('@teb.edu.pl');
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
};
