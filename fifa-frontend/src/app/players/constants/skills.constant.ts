export const SKILL_FIELDS = [
  'overall', 'potential', 'pace', 'shooting', 'passing', 'dribbling', 'defending', 'physic'
] as const; 
// Usamos 'as const' para que TypeScript lo trate como un array de valores literales y no como un string[] genérico