'use server';

/**
 * @fileOverview An AI agent that suggests an optimal visit time based on current waiting times.
 *
 * - suggestOptimalVisitTime - A function that suggests an optimal visit time.
 * - SuggestOptimalVisitTimeInput - The input type for the suggestOptimalVisitTime function.
 * - SuggestOptimalVisitTimeOutput - The return type for the suggestOptimalVisitTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalVisitTimeInputSchema = z.object({
  hospital: z.string().describe('The hospital name.'),
  department: z.string().describe('The department name.'),
  currentWaitTime: z
    .number()
    .describe('The current estimated waiting time in minutes.'),
  currentTime: z.string().describe('The current time of day.'),
});
export type SuggestOptimalVisitTimeInput = z.infer<
  typeof SuggestOptimalVisitTimeInputSchema
>;

const SuggestOptimalVisitTimeOutputSchema = z.object({
  suggestedTime: z.string().describe('The suggested visit time.'),
  expectedWaitTime: z
    .number()
    .describe('The expected waiting time in minutes for the suggested time.'),
  reason: z
    .string()
    .describe('The reason for suggesting the particular visit time.'),
});
export type SuggestOptimalVisitTimeOutput = z.infer<
  typeof SuggestOptimalVisitTimeOutputSchema
>;

export async function suggestOptimalVisitTime(
  input: SuggestOptimalVisitTimeInput
): Promise<SuggestOptimalVisitTimeOutput> {
  return suggestOptimalVisitTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalVisitTimePrompt',
  input: {schema: SuggestOptimalVisitTimeInputSchema},
  output: {schema: SuggestOptimalVisitTimeOutputSchema},
  prompt: `You are an expert in hospital patient flow. Given the current wait time, hospital, department and current time, you suggest an optimal visit time with a lower expected waiting time.

Hospital: {{hospital}}
Department: {{department}}
Current Wait Time: {{currentWaitTime}} minutes
Current Time: {{currentTime}}

Suggest a visit time that would result in a lower wait time, and explain why this time is optimal. Format the suggested time to be human readable.

Respond in JSON format with "suggestedTime",  "expectedWaitTime", and "reason" keys.`,
});

const suggestOptimalVisitTimeFlow = ai.defineFlow(
  {
    name: 'suggestOptimalVisitTimeFlow',
    inputSchema: SuggestOptimalVisitTimeInputSchema,
    outputSchema: SuggestOptimalVisitTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
