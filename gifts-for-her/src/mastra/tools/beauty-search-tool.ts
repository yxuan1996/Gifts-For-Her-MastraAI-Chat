import { createAzure } from '@ai-sdk/azure';
import { embed } from "ai";
import { Pinecone } from '@pinecone-database/pinecone'
import { createTool } from "@mastra/core";
import { z } from "zod";
import { PineconeVector, PINECONE_PROMPT } from "@mastra/pinecone";
import { createVectorQueryTool } from "@mastra/rag";

const azure = createAzure({
  resourceName: 'openai-gdig', // Azure resource name
//   apiKey: 'your-api-key', // Use default from environment variable
});

// 1. Initialize Pinecone
const pineconeStore = new PineconeVector({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Pinecone with namespace
// const pineconeQueryTool = createVectorQueryTool({
//   vectorStoreName: "pinecone",
//   indexName: "amazon-beauty-reviews",
//   model: azure.embedding("text-embedding-3-small"),
//   databaseConfig: {
//     pinecone: {
//       namespace: "__default__", // Isolate data by environment
//     },
//   },
// });

// We define a custom function for 2 step retrieval
// First step does vector search over amazon-beauty-reviews to find relevant reviews
// Second step extracts parent_asin from review metadata, and uses it to query amazon-beauty-items by id

async function getProductDetailsFromReviews(queryText: string) {
  // 1. Generate embedding for the user query
  const { embedding } = await embed({
    value: queryText,
    model: azure.embedding("text-embedding-3-small"),
  });

  // 2. Search 'amazon-beauty-reviews' index
  const reviewResults = await pineconeStore.query({
    indexName: "amazon-beauty-reviews",
    queryVector: embedding,
    topK: 25,
  });

  console.log(reviewResults)
  // 3. Extract unique 'parent_asin' from metadata
  const asins = [...new Set(reviewResults.map(r => r.metadata?.parent_asin))].filter(Boolean);
  console.log(asins)


  // 4. Query 'amazon-beauty-items' by ID (parent_asin)
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })

  const index = pc.index("amazon-beauty-items", process.env.PINECONE_HOST)

  const fetchResult = await index.namespace('__default__').fetch(asins);
  console.log(fetchResult)

  return { reviews: reviewResults, items: "items" };
}



export const beautySearchTool = createTool({
  id: "search-reviews-and-items",
  description: "Searches for beauty product reviews and fetches the corresponding product item details.",
  inputSchema: z.object({
    query: z.string().describe("The user's search query about beauty products"),
  }),
  execute: async ({ context }) => {
    const {query} = context;
    return await getProductDetailsFromReviews(query);
  },
});