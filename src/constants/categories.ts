export const categories = [
  { id: 'all', label: 'Todas', query: '' },
  { id: 'technology', label: 'Tecnologia', query: 'tecnologia' },
  { id: 'business', label: 'Negócios', query: 'negócios' },
  { id: 'sports', label: 'Esportes', query: 'esportes' },
  { id: 'health', label: 'Saúde', query: 'saúde' },
  { id: 'science', label: 'Ciência', query: 'ciência' },
  { id: 'entertainment', label: 'Entretenimento', query: 'entretenimento' },
  { id: 'politics', label: 'Política', query: 'política' },
] as const;

export type Category = typeof categories[number];
