import { Agent } from "@mastra/core/agent";
import { createAzure } from '@ai-sdk/azure';
import { beautySearchTool } from "../tools/beauty-search-tool";
import { Memory } from "@mastra/memory";
import { MongoDBStore } from "@mastra/mongodb";


const azure = createAzure({
  resourceName: 'openai-gdig', // Azure resource name
//   apiKey: 'your-api-key', // Use default from environment variable
});


export const recommendAgent = new Agent({
  name: "recommend-agent",
  model: azure("gpt-4o"),
  instructions: `
  You are a product recommendation agent. You will use the beautySearchTool to search for product information and user feedback.
  Then, based on the search results, you will recommend the most suitable products to users based on their preferences and needs.
  Include product names, key features, and reasons for recommendation in your responses.
  Process queries using the provided context. Structure responses to be concise and relevant.
  `,
  tools: { beautySearchTool },
  memory: new Memory({
    storage: new MongoDBStore({
      url: process.env.MONGODB_URI!,
      dbName: process.env.MONGODB_DB_NAME!,
    }),
    options: {
      lastMessages: 10,
      threads: {
        generateTitle: true,
      },
    },
  }),

});