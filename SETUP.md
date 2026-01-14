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


