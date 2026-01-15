"use server";

import { mastra } from "../src/mastra";

export async function askAgent(query: string) {
  const agent = mastra.getAgent('recommendAgent');
  const result = await agent.generate(query);
  return result.text;
}