'use server';

import { predictDepartmentWaitingTime } from '@/ai/flows/predict-department-waiting-time';
import type { PredictDepartmentWaitingTimeOutput } from '@/ai/flows/predict-department-waiting-time';

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
    // Re-throwing a generic error to be caught by the client
    throw new Error('Failed to get prediction from AI. Please try again.');
  }
}
