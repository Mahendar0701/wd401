# Level 09 Milestone : Integrating error tracking and debugging features in React.js application


## 1. Error Tracking System:

### Tools and Libraries
When it comes to error tracking, selecting the right tool is crucial for maintaining application stability and performance. Here are two top-tier options:

**Sentry**: Known for its robust error tracking and monitoring capabilities, Sentry offers real-time insights into application errors. It supports multiple platforms and programming languages, making it versatile for various projects, including JavaScript/React.

**Rollbar**: Another trusted solution is Rollbar, offering real-time error monitoring, alerting, and debugging features tailored specifically for JavaScript/React applications.

**Install**
```
npm install --save @sentry/react
```

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/35551628-6d4d-4a23-ba65-efbc64291879)

**index.js**
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./context/theme";

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://1ee785c1b19632cf727e169fb5c6471d@o4506943899435008.ingest.us.sentry.io/4506943986794496",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

```




### Configuration and Set up


To add readable stack traces to errors and set up uploading source maps with Sentry CLI and tsc, follow these steps:

Use the Sentry Wizard for automatic setup by running the following command in your terminal:
```
npx @sentry/wizard@latest -i sourcemaps
```
The Sentry Wizard will prompt you to:

a. Log into Sentry and select a project.

b. Install the necessary Sentry packages.

c. Configure your build tool to generate and upload source maps.

d. Configure your CI (Continuous Integration) pipeline to upload source maps.

Ensure your Vite configuration file (e.g., vite.config.js) includes the necessary settings for source map generation and Sentry Vite plugin integration:

```tsx
import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "chaitanya-bharathi-institut-cd",
      project: "wd301",
    }),
  ],
});
```

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/2e309906-2369-4af4-8af1-2c2f9e0b8cae)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/c4d40698-9c59-46b5-bf08-03c97ab27022)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/6d5b32c5-f105-452f-8514-dcbb52298abc)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/ece4aff3-5601-4870-a261-b55fdfd1fb36)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/be541a23-5c8d-4bdc-bb2b-1d9ca37a1007)

└  That's it - everything is set up!

   Test and validate your setup locally with the following Steps:

   1. Build your application in production mode.
      → For example, run npm run build.
      → You should see source map upload logs in your console.
   2. Run your application and throw a test error.
      → The error should appear in Sentry:
      → https://chaitanya-bharathi-institut-cd.sentry.io/issues/?project=4506943986794496
   3. Open the error in Sentry and verify that it's source-mapped.
      → The stack trace should show your original source code.

### Testing
Open sentry and view error

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/9217c713-2b5b-408a-9a73-58a6db4f0da8)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/49b2fdb6-f115-4051-9971-bd48704c5fb9)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/5e5245a8-4e80-4016-889e-e9c25095d3bb)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/5d1a6db0-8670-48c2-b87f-8bf70855282c)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/d9461c3c-85fb-423d-8da9-954faeec0b44)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/b40f9d61-d16c-4806-bcc8-2f41511ea401)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/4067c236-2cd3-4229-a1fa-146befee3ed8)


## Debugger Capability:

### Introduction
Debugging is essential for developers to identify and resolve code issues effectively. Different techniques and tools, such as console logging, breakpoints, and debugger statements, aid in this process.

Console Logging: Developers commonly use console.log() statements to print values, messages, or variables to the browser console. While straightforward, it offers limited insight and may clutter the codebase if not removed post-debugging.

Example:
```jsx
export default function ProjectListItems() {
  let state: any = useProjectsState();
  const { projects, isLoading, isError, errorMessage } = state;

  console.log(projects); //Console Log Statement for debugging

  if (projects.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  return <>{/*Return statements*/}</>;
}
```


Regarding the Root Cause Analysis (RCA) of the bug identified using console.log statements, this involves investigating the underlying reason for the bug's occurrence by examining the information displayed in the console.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/c288fb65-9e14-468d-913c-b87539c52b78)

**Breakpoints:** Developers set breakpoints in code using browser developer tools. Execution pauses at these breakpoints, allowing variable and call stack inspection, offering an interactive debugging experience.

**Debugger Statements:** Debugger statements, like debugger;, are inserted directly into code. Execution halts at these points, mimicking breakpoints without reliance on developer tools. Quick and easy to implement, but should be removed post-debugging.

ProjectListItems.tsx

```jsx
export default function ProjectListItems() {
  let state = useProjectsState();
  const { projects, isLoading, isError, errorMessage } = state;

  console.log(projects);
  debugger; // Debugger statement for debugging

  if (projects.length === 0 && isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>{errorMessage}</span>;
  }

  return <>{/* Return statements */}</>;
}

```

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/bd07f815-9ddb-4902-b2cb-d5590362e548)


Browser Developer Tools encompass a diverse set of utilities furnished by web browsers to scrutinize and debug web applications. Components such as the Elements panel, Console, Sources, and Network facilitate real-time examination of the Document Object Model (DOM), Cascading Style Sheets (CSS), and JavaScript. However, mastering these tools may require an initial learning curve.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/1b7fcfc4-154e-4e9f-b24e-2f35d0d862ee)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/4a0af1a4-ab10-4482-a6b3-57a1365e1366)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/59b600d0-15b2-4050-b223-728b36356e78)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/1703c6c8-2106-4c13-ba5f-652e183f2663)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/fa16b458-bf91-42c5-b08c-921b9361ef65)


**Bug Description:** The issue arises during the retrieval of the project list.

Symptoms: Clicking on a project consistently results in an error message indicating "something went wrong."

Root Cause: The problem might stem from delays in backend processing or attempting to fetch projects before they're fully created.

Resolution: Delaying the retrieval of projects until after they've been fully created could resolve the issue.

Impact Analysis: Currently, the impact may be minimal, but as additional features are added, this issue could escalate into a more significant problem.














   





