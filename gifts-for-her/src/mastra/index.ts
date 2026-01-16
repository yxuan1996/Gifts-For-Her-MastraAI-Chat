
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { recommendAgent } from './agents/recommend-agent';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';
import { PostgresStore } from "@mastra/pg";

const storage = new PostgresStore({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

// Implement Singleton pattern for Mastra instance
// Global variable to hold the Mastra instance
const globalForMastra = globalThis as unknown as {
  mastra: Mastra | undefined;
};

// Use existing instance if available, otherwise create a new one
export const mastra = 
  globalForMastra.mastra ??
  new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, recommendAgent },
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  // storage: new LibSQLStore({
  //   // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
  //   url: ":memory:",
  // }),
  storage: storage,
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false, 
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true }, 
  },
});

// 3. In development, save the instance to the global object
if (process.env.NODE_ENV !== "production") {
  globalForMastra.mastra = mastra;
}
