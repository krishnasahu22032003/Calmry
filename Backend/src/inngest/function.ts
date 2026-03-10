import {
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
} from "./aiFunction.js";

export const functions = [
  processChatMessage,
  analyzeTherapySession,
  generateActivityRecommendations,
];