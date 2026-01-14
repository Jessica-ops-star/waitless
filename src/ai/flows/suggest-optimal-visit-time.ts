
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
  suggestedTime: z.string().describe('The suggested visit time in a human-readable format (e.g., 5:30 PM).'),
  expectedWaitTime: z
    .number()
    .describe('The expected waiting time in minutes for the suggested time.'),
  reason: z
    .string()
    .describe('The reason for suggesting the particular visit time, explaining why the wait is lower.'),
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
  prompt: `You are an expert in hospital patient flow. Given the current wait time for a department, you suggest an optimal, specific visit time with a lower expected waiting time.

Hospital: {{hospital}}
Department: {{department}}
Current Wait Time: {{currentWaitTime}} minutes
Current Time: {{currentTime}}

If the current wait time is high (over 60 minutes), suggest a single, specific time slot later today that would result in a significantly lower wait time (e.g., 30-45 minutes). Explain a plausible reason, like "visiting after the afternoon shift change usually means shorter waits." Format the suggested time as "h:mm AM/PM".

If the current wait time is already low or medium, you can still suggest a slightly better time, but it's less critical.

Respond in JSON format with "suggestedTime", "expectedWaitTime", and "reason" keys.
Example for high wait time:
{
  "suggestedTime": "5:30 PM",
  "expectedWaitTime": 35,
  "reason": "If you visit at 5:30 PM, your wait is likely to be around 35 minutes as it's after the peak afternoon rush."
}
`,
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
