"use server";

import { mastra } from "../src/mastra";

export async function askAgent(query: string) {
  const agent = mastra.getAgent('recommendAgent');
  const result = await agent.generate(query);
  console.log("Agent result:", result.text);
  return result;
}