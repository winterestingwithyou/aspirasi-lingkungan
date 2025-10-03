type ProblemType = {
  id: number;
  name: string;
};

type ProblemTypesResponse = {
  data: ProblemType[];
  error?: string;
};

export type { ProblemType, ProblemTypesResponse };
