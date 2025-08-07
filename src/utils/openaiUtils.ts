import { OpenAIUsage } from '@/types';
import { GPT4O_INPUT_PRICE, GPT4O_OUTPUT_PRICE } from '@/config/constants';

/**
 * Calculate cost based on OpenAI usage
 */
export function calculateCost(usage: OpenAIUsage | undefined): number {
  if (!usage) return 0;
  
  const inputCost = (usage.prompt_tokens || 0) * GPT4O_INPUT_PRICE;
  const outputCost = (usage.completion_tokens || 0) * GPT4O_OUTPUT_PRICE;
  
  return inputCost + outputCost;
}
