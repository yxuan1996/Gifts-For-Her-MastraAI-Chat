# Installation
## Mastra Backend
Start by installing Mastra
```
npm create mastra@latest
```

We can then start the Mastra Backend using `npm run dev`

## Next JS Frontend
We will install the packages and manually configure the app to prevent the npx installer from overwriting the existing package json

```
npm install next@latest react@latest react-dom@latest
```

Install types for typescript
```
npm install --save-dev typescript @types/node @types/react @types/react-dom
```

Configure `next.config.ts`

```TS
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/*"],
};

export default nextConfig;
```

In the root directory of the project, create the `app` directory with 2 basic files

`app/layout.tsx`

```TS
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`
```TS
export default function Page() {
  return <h1>Mastra AI Frontend</h1>;
}
```

In `package.json` add an extra script to run the frontend
```
"web": "next dev",
```

We can then start the frontend using `npm run web`

## AI Providers
Vercel AI Gateway provides an integrated way to access various LLM models. 
It also has SDKs for various providers, providing an easy, standardized way to connect to LLMs

https://ai-sdk.dev/providers/ai-sdk-providers/ai-gateway

We will connect to Azure OpenAI. We start by installing the correct SDK and following the guide: https://ai-sdk.dev/providers/ai-sdk-providers/azure

Install ai-sdk version 2 to be compatible with v0 of Mastra

```
npm install @ai-sdk/azure@"^2.0.0"
```

Then, set the `AZURE_API_KEY` environment variable.

## Creating Agents
- We define our agents in the `src/mastra/agents` folder
- After that, we register our agent in `src/mastra/index.ts`

## Connecting to Vector DB
We are using Pinecone for our vector DB. We start by installing the SDK.
```
npm install @mastra/pinecone @mastra/rag @pinecone-database/pinecone
```

Then, set the `PINECONE_API_KEY` and `PINECONE_HOST` environment variable.

## Creating Tools
We define our tools in the `src/mastra/tools` folder

## Configuring Memory
We install the memory package as well as the storage provider. In this case, we are using Postgres (Supabase)
```
npm install @mastra/memory@latest @mastra/pg@latest
```

In `src/mastra/index.ts` we create a new storage provider. The storage provider will host the memories (Messages, threads etc)
```TS
import { PostgresStore } from "@mastra/pg";

const storage = new PostgresStore({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});
```

We can then add memory to our agents within the agent file of each agent.

Then, set the `POSTGRES_CONNECTION_STRING` environment variable.





