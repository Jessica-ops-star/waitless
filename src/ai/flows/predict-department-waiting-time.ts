'use server';

/**
 * @fileOverview Predicts waiting times for different hospital departments based on real-time data and historical trends.
 *
 * - predictDepartmentWaitingTime - A function that predicts the waiting time.
 * - PredictDepartmentWaitingTimeInput - The input type for the predictDepartmentWaitingTime function.
 * - PredictDepartmentWaitingTimeOutput - The return type for the predictDepartmentWaitingTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDepartmentWaitingTimeInputSchema = z.object({
  hospital: z.string().describe('The name of the hospital.'),
  department: z.string().describe('The department within the hospital (e.g., Cardiology, Orthopedics).'),
  currentTime: z.string().describe('The current time, in HH:mm format.'),
});
export type PredictDepartmentWaitingTimeInput = z.infer<typeof PredictDepartmentWaitingTimeInputSchema>;

const PredictDepartmentWaitingTimeOutputSchema = z.object({
  estimatedWaitTimeMinutes: z.number().describe('The estimated waiting time in minutes.'),
  queueStatus: z.enum(['Low', 'Medium', 'High']).describe('The current queue status (Low, Medium, or High).'),
  suggestedVisitTime: z.string().optional().describe('A suggested visit time with a lower expected waiting time, in HH:mm format.'),
  reasoning: z.string().describe('The reasoning behind the wait time prediction and any suggestions.'),
});
export type PredictDepartmentWaitingTimeOutput = z.infer<typeof PredictDepartmentWaitingTimeOutputSchema>;

export async function predictDepartmentWaitingTime(input: PredictDepartmentWaitingTimeInput): Promise<PredictDepartmentWaitingTimeOutput> {
  return predictDepartmentWaitingTimeFlow(input);
}

const predictDepartmentWaitingTimePrompt = ai.definePrompt({
  name: 'predictDepartmentWaitingTimePrompt',
  input: {schema: PredictDepartmentWaitingTimeInputSchema},
  output: {schema: PredictDepartmentWaitingTimeOutputSchema},
  prompt: `You are an AI assistant that predicts waiting times for hospital departments.

You are provided with the hospital name, the department, and the current time.

Based on historical trends, real-time data (if available), and your general knowledge, estimate the waiting time in minutes, determine the queue status (Low, Medium, or High), and suggest a better visit time if the system detects high crowding.

Hospital: {{hospital}}
Department: {{department}}
Current Time: {{currentTime}}

Respond with the estimated wait time in minutes, the queue status, a suggested visit time (if applicable), and your reasoning.

Make sure to output a valid JSON according to this schema:
\`\`\`json
{{{output.schema.description}}}
\`\`\`
`,  
});

const predictDepartmentWaitingTimeFlow = ai.defineFlow(
  {
    name: 'predictDepartmentWaitingTimeFlow',
    inputSchema: PredictDepartmentWaitingTimeInputSchema,
    outputSchema: PredictDepartmentWaitingTimeOutputSchema,
  },
  async input => {
    const {output} = await predictDepartmentWaitingTimePrompt(input);
    return output!;
  }
);
