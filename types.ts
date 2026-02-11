
export interface InventivePrinciple {
  id: number;
  name: string;
  description: string;
  examples: string[];
}

export interface TrizParameter {
  id: number;
  name: string;
}

export interface ContradictionResult {
  improvingParamId: number;
  worseningParamId: number;
  suggestedPrinciples: number[];
}

export interface SavedSession {
  id: string;
  timestamp: number;
  problemDescription: string;
  improvingParamId: number | null;
  worseningParamId: number | null;
  aiExplanation: string;
  suggestedPrinciples: number[];
  aiDraft: any | null;
}

export interface AnalysisSession {
  problemDescription: string;
  improvingParam: number | null;
  worseningParam: number | null;
  selectedPrinciples: number[];
}
