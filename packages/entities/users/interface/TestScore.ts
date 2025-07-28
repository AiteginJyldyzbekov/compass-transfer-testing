/**
 * Интерфейс TestScore
 * @interface
 */
export interface TestScore {
  testName: string;
  score: number;
  maxPossibleScore: number;
  passedDate: string;
  expiryDate?: string | null;
  comments?: string | null;
}