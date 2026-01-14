
'use server';

import { predictDepartmentWaitingTime } from '@/ai/flows/predict-department-waiting-time';
import type { PredictDepartmentWaitingTimeOutput } from '@/ai/flows/predict-department-waiting-time';
import { suggestOptimalVisitTime } from '@/ai/flows/suggest-optimal-visit-time';
import type { SuggestOptimalVisitTimeOutput } from '@/ai/flows/suggest-optimal-visit-time';

export async function getWaitTimePrediction(
  hospital: string,
  department: string,
  currentTime: string
): Promise<PredictDepartmentWaitingTimeOutput> {
  try {
    const result = await predictDepartmentWaitingTime({
      hospital,
      department,
      currentTime,
    });
    return result;
  } catch (error) {
    console.error('Error getting wait time prediction:', error);
    throw new Error('Failed to get prediction from AI. Please try again.');
  }
}

export async function getOptimalVisitTime(
  hospital: string,
  department: string,
  currentWaitTime: number,
  currentTime: string
): Promise<SuggestOptimalVisitTimeOutput> {
  try {
    const result = await suggestOptimalVisitTime({
      hospital,
      department,
      currentWaitTime,
      currentTime,
    });
    return result;
  } catch (error) {
    console.error('Error getting optimal visit time:', error);
    throw new Error('Failed to get suggestion from AI. Please try again.');
  }
}
