import { Agent } from "@mastra/core/agent";
import { createAzure } from '@ai-sdk/azure';
import { beautySearchTool } from "../tools/beauty-search-tool";
import { Memory } from "@mastra/memory";


const azure = createAzure({
  resourceName: 'openai-gdig', // Azure resource name
//   apiKey: 'your-api-key', // Use default from environment variable
});


export const recommendAgent = new Agent({
  name: "recommend-agent",
  model: azure("gpt-4o"),
  instructions: `
  You are a product recommendation agent. You will search the amazon-beauty-reviews index for product information and user feedback.
  Process queries using the provided context. Structure responses to be concise and relevant.
  `,
  tools: { beautySearchTool },
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
});