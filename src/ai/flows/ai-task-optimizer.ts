'use server';
/**
 * @fileOverview An AI Productivity Consultant flow that analyzes task lists
 * and suggests optimized deadlines and priority rankings.
 *
 * - optimizeTasks - A function that handles the task optimization process.
 * - OptimizeTasksInput - The input type for the optimizeTasks function.
 * - OptimizeTasksOutput - The return type for the optimizeTasks function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TaskInputSchema = z.object({
  id: z.string().describe('Unique identifier for the task.'),
  name: z.string().describe('Name of the task.'),
  description: z.string().optional().describe('Detailed description of the task.'),
  currentDeadline: z.string().describe('The current deadline for the task (e.g., "YYYY-MM-DD", "Tomorrow", "End of next week").'),
  currentPriority: z.string().describe('The current priority of the task (e.g., "High", "Medium", "Low", "Critical", "Optional").'),
  status: z.string().describe('The current status of the task (e.g., "pending", "in progress", "completed", "blocked").'),
  estimatedEffortHours: z.number().optional().describe('Estimated time in hours to complete the task.'),
});

const OptimizeTasksInputSchema = z.object({
  tasks: z.array(TaskInputSchema).describe('A list of tasks to be analyzed for optimization.'),
});
export type OptimizeTasksInput = z.infer<typeof OptimizeTasksInputSchema>;

const OptimizedTaskOutputSchema = z.object({
  id: z.string().describe('The unique identifier of the optimized task, matching the input task ID.'),
  suggestedDeadline: z.string().describe('The AI-suggested optimized deadline for the task (e.g., "YYYY-MM-DD", "Next Monday").'),
  suggestedPriority: z.string().describe('The AI-suggested optimized priority for the task (e.g., "Critical", "High", "Medium", "Low").'),
  reasoning: z.string().describe('A brief explanation for the suggested deadline and priority changes.'),
});

const OptimizeTasksOutputSchema = z.array(OptimizedTaskOutputSchema).describe('A list of optimized task suggestions.');
export type OptimizeTasksOutput = z.infer<typeof OptimizeTasksOutputSchema>;

export async function optimizeTasks(input: OptimizeTasksInput): Promise<OptimizeTasksOutput> {
  return optimizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskOptimizerPrompt',
  input: { schema: OptimizeTasksInputSchema },
  output: { schema: OptimizeTasksOutputSchema },
  prompt: `You are an AI Productivity Consultant. Your goal is to analyze a given list of tasks and suggest optimal deadlines and priority rankings to maximize productivity and efficiency for the user.\n\nFor each task, consider its name, description, current deadline, current priority, status, and estimated effort. Propose a new 'suggestedDeadline' and 'suggestedPriority' if you believe an optimization is possible. Provide a concise 'reasoning' for each suggestion.\n\nThe suggested deadlines should be realistic and actionable (e.g., "YYYY-MM-DD", "Next Monday", "End of the week"). The suggested priorities should be clear and concise (e.g., "Critical", "High", "Medium", "Low").\n\nHere is the current list of tasks to analyze:\n\n\`\`\`json\n{{json tasks}}\n\`\`\`\n\nPlease output a JSON array of optimized task suggestions, adhering strictly to the following schema:\n`,
});

const optimizeTasksFlow = ai.defineFlow(
  {
    name: 'optimizeTasksFlow',
    inputSchema: OptimizeTasksInputSchema,
    outputSchema: OptimizeTasksOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);