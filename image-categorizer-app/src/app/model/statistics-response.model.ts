export interface StatisticsResponse {
  overall: {
    correct: number;
    incorrect: number;
  };
  user: {
    correct: number;
    incorrect: number;
  };
}