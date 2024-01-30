# PupilFirst WD401 Level-1 Submission Documentation

## Problem Statement:

You've been assigned to a project that involves enhancing a critical feature for a web application. The team places a strong emphasis on the pull-request workflow, with a focus on code reviews, merge conflict resolution, and the recent integration of CI/CD. As you navigate through the development task, you encounter challenges such as feedback during code reviews and discussions on effective merge conflict resolution. The team looks to you to demonstrate your understanding of these challenges and your ability to adapt to the added complexity of CI/CD integration.

### Handling Code Review Feedback:

Sample Code:
![image](https://github.com/Mahendar0701/wd401/assets/119734520/7e078855-4c4f-4d03-a682-4b5942bbb3bb)

Code Review:

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    //Sign-up of user
    const response = await fetch(`${API_ENDPOINT}/organisations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Feedback: The variable naming is inconsistent (e.g., organisationName vs. userName).
        //Consistency in variable names improves code readability.
        name: organisationName,
        user_name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      // Feedback: Improve error handling by providing more detailed error messages or logging additional details for debugging.
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    // Feedback: Ensure navigation happens only on successful sign-up.
    navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

![image](https://github.com/Mahendar0701/wd401/assets/119734520/eb99cf78-5fe9-4e65-b6c1-5ca9b039af9f)

![image](https://github.com/Mahendar0701/wd401/assets/119734520/1cd410a5-a358-4864-934d-e880d15099c5)

![image](https://github.com/Mahendar0701/wd401/assets/119734520/c828c5cb-8df8-4f17-88c3-bce2d205145d)

### Iterative Development Process

Iterative development involves a cyclic process of receiving feedback, making improvements, and repeating the cycle.

![image](https://github.com/Mahendar0701/wd401/assets/119734520/db302da1-ab06-400b-9288-1907d826d51d)

### Resolving Merge Conflicts:

A merge conflict occurs when multiple contributors make conflicting changes to the same part of a file within parallel branches, and an attempt is made to merge these branches together.

## Main branch code:

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      //updated to organizations
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: organizationName,
        userName: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

## Code in feature branch

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      //updated to organizations
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgName: organizationName,
        user_name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

Merge confict occurs in the main branch when branch "branch01" is merged with the main branch then:

![image](https://github.com/Mahendar0701/wd401/assets/119734520/59ea14c5-8809-42a6-8edc-7d73f4b61ff5)

![image](https://github.com/Mahendar0701/wd401/assets/119734520/5fc6de54-ff9d-4775-9541-2b808c58833c)

> There are two options to resolve the conflicts:
>
> - Accept Incoming changes.
> - Keep current changes.
>   By accepting the incoming changes, the conflict of branch "main" is resolved with the branch "branch".
>   By keeping the current changes, the conflict of branch "main" merging with develop will be resolved with current changes.
>   >     The main AIM is to resolve the merge conflicts such a way that the application works as expected without producing new errors.
>   > 

Final code after resolving merge conflict:

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      //updated to organizations
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgName: organizationName,
        userName: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

## CI/CD Integration

Continuous Integration (CI) and Continuous Deployment (CD) are practices in software development that aim to automate and streamline the process of delivering high-quality software.

Using node packages like prettier, eslint, jest, husky to format the code and these ensures the code quality standards. These tests run after committing the changes to the files.

## Example.tsx code required imports and statements:

import React from "react";

const API_ENDPOINT = "your_api_endpoint_here";

const organisationName = "your_org_name";
const userName = "your_user_name";
const userEmail = "your_email@example.com";
const userPassword = "your_password";

const navigate = (path: string) => {
  // navigation logic here
};

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  try {
    const response = await fetch(`${API_ENDPOINT}/organizations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: organisationName,
        user_name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Sign-up failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    console.log("Sign-up successful");

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    navigate("/dashboard");
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};

## .github/workflows/cicd.yml

# .github/workflows/ci-cd.yml

name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js and TypeScript
        uses: actions/setup-node@v3
        with:
          node-version: 14
          typescript: 4.5.5

      - name: Install dependencies
        run: npm install

      - name: Run TypeScript build
        run: npx tsc

      - name: Run tests
        run: npm test


![image](https://github.com/Mahendar0701/wd401/assets/119734520/9e953343-b75d-4174-9608-4fb7bd7a77af)









