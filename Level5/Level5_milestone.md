# WD401 Level-5 : Implementing a fully functional CI-CD pipeline

## 1. GitHub Actions Pipeline:

 The GitHub Actions pipeline is for automating the Continuous Integration and Continuous Deployment (CICD) process of a web application. The pipeline includes stages for code validation, testing, and deployment.

```yml
name: CICD pipeline

on:
  push:
    branches:
      - main

env:
  PG_DATABASE: wd-toDo-test
  PG_USER: ${{ secrets.PG_USER }}
  PG_PASSWORD: ${{ secrets.PG_PASSWORD }}

jobs:
  # Run tests
  run-tests:
    runs-on: ubuntu-latest

    # Set up a PostgreSQL service for testing
    services:
      postgres:
        image: postgres:11.7
        env:
          POSTGRES_USER: ${{ secrets.PG_USER }}
          POSTGRES_PASSWORD: ${{ secrets.PG_PASSWORD }}
          POSTGRES_DB: wd-toDo-test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      # Check out repository code
      - name: Checkout code
        uses: actions/checkout@v3

      # Install dependencies
      - name: Install dependencies
        run: cd todo-app && npm ci

      # Run unit tests
      - name: Run unit tests
        run: cd todo-app && npm test

      # Notify on Slack regardless of the outcome
      - name: Slack Notify
        uses: act10ns/slack@v1
        with:
          status: ${{ job.status}}
          channel: "#web-development"
        if: always()

      # Notify on Slack for success
      - name: Success Notify
        if: success()
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"Commit has been successful✅"}' ${{secrets.SLACK_WEBHOOK_URL}}

      # Notify on Slack for failure
      - name: Failure Notify
        if: failure()
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"⚠️Error: The pipeline has failed❗"}' ${{secrets.SLACK_WEBHOOK_URL}}

      # Run the app for further testing or usage
      - name: Run the app
        id: run-app
        run: |
          cd todo-app
          npm install
          npx sequelize-cli db:drop
          npx sequelize-cli db:create
          npx sequelize-cli db:migrate
          PORT=3000 npm start &
          sleep 5

  # Deploy to production
  deploy-to-production:
    runs-on: ubuntu-latest
    needs: run-tests

    steps:
      # Deploy to Production using Render
      - name: Deploy to Production
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.SERVICE_ID}}
          api-key: ${{ secrets.RENDER_API_KEY}}
#       # - name: Run integration tests
#       #   run: |
#       #     cd todo-app
#       #     npm install cypress cypress-json-results
#       #     npx cypress run --env STUDENT_SUBMISSION_URL="http://localhost:3000/"

```

## Stages

### 1. Run Tests

#### Purpose:

- Validate the functionality, performance, and integrity of the application through automated testing.
- Ensure correct interaction with a PostgreSQL database during testing.

#### Execution:

- **Trigger:** On every push to the main branch.
- **Environment:** Ubuntu
- **Service:** PostgreSQL service for testing.

#### Steps:

1. **Checkout Code:**
   - Retrieves the latest code from the repository.

2. **Install Dependencies:**
   - Uses `npm ci` to install project dependencies.

3. **Run Unit Tests:**
   - Executes unit tests using `npm test`.

4. **Slack Notify:**
   - Sends a notification to the `#web-development` Slack channel, regardless of the test outcome.

5. **Success Notify:**
   - Sends a success notification to Slack if the tests pass.

6. **Failure Notify:**
   - Sends a failure notification to Slack if the tests fail.

7. **Run the App:**
   - Sets up the application environment for further testing or usage.
   - Drops, creates, and migrates the database.
   - Starts the app on port 3000.

### 2. Deploy to Production

#### Purpose:

- Deploy the application to a production environment.
- Ensure successful deployment based on the success of the "Run Tests" stage.

#### Execution:

- **Environment:** Ubuntu
- **Dependencies:** Depends on the success of the "Run Tests" stage.

#### Steps:

1. **Deploy to Production:**
   - Utilizes the Render deploy action with the specified service ID and API key.

  
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/b86114b6-4256-41dc-98b4-77cbfb7d7918)
  
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/fa34d7bb-2a8a-4f47-bfcd-c2266ed81836)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/71091e9a-23fa-4060-ae12-96c4ee0cdb92)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/f8441667-de50-4ec6-a8e0-1e4e1aee3cc1)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/d363c0ca-f84f-43a9-8752-fa43e7436847)


## 2. Automated Test Cases:

Automated test cases in GitHub Actions refer to a set of predefined and automated steps that validate the functionality, performance, and integrity of a software application. These test cases are incorporated into the GitHub Actions workflow to automatically execute testing scripts whenever there is a code change. The primary goal is to ensure that the application behaves as expected and to catch any potential issues or regressions early in the development process.

job to run automated tests 

```yml
jobs:
  # Run tests
  run-tests:
    runs-on: ubuntu-latest

    # Set up a PostgreSQL service for testing
    services:
      postgres:
        image: postgres:11.7
        env:
          POSTGRES_USER: ${{ secrets.PG_USER }}
          POSTGRES_PASSWORD: ${{ secrets.PG_PASSWORD }}
          POSTGRES_DB: wd-toDo-test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      # Check out repository code
      - name: Checkout code
        uses: actions/checkout@v3

      # Install dependencies
      - name: Install dependencies
        run: cd todo-app && npm ci

      # Run unit tests
      - name: Run unit tests
        run: cd todo-app && npm test
```

unit tests

```js
  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
```

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/b241851a-079c-4bf3-9df8-78857f4a9458)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/759d6fba-6764-40b3-b8c1-ade464f3c642)


## 3. Environment Variable Configuration:

# Setting Up Environment Variables in CI/CD Pipeline

## Introduction

In the world of CI/CD pipelines, configuring environment variables is crucial for orchestrating application behavior seamlessly across various stages. This guide will help you set up environment variables to manage sensitive information in your GitHub Actions workflow.

## Steps

### 1. Identify Environment Variables

Begin by identifying the specific configurations and sensitive information required for your application. This may include API keys, secrets, database connection strings, and configuration parameters for different deployment environments.

### 2. Configure Secrets in GitHub Repository

1. Navigate to your GitHub repository.
2. Go to the "Settings" tab.
3. In the left sidebar, click on "Secrets."
4. Click on "New repository secret."
5. Add each sensitive environment variable, providing a meaningful name and value.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/96a22df5-96c1-4f6e-a2ec-9423a3fbd54f)

### 3. Reference Secrets in GitHub Actions Workflow

Use the ${{ secrets.SECRET_NAME }} syntax to access secret values within your workflow.

```yml
env:
  PG_DATABASE: wd-todo-test
  PG_USER: ${{ secrets.PG_USER }}
  PG_PASSWORD: ${{ secrets.PG_PASSWORD }}
```

Update your application code to retrieve and utilize environment variables as required. Ensure that your application is configured to fetch sensitive information and environment-specific details from these variables rather than hardcoding values.

```yml

jobs:
  run-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:11.7
        env:
          POSTGRES_USER: ${{ secrets.PG_USER }}
          POSTGRES_PASSWORD: ${{ secrets.PG_PASSWORD }}
          POSTGRES_DB: wd-todo-test
    steps:
      # Other Steps in the workflow
```
## Currently Configured Secrets
- PG_USER: PostgreSQL user name.
- PG_PASSWORD: PostgreSQL user password.
- SERVICE_ID: Service ID for deployment on render.com.
- RENDER_API_KEY: API Key for deployment on render.com.
- SLACK_WEBHOOK_URL : Notify to slack,

## 4. Error Reporting Integration:

Error reporting mechanisms play a critical role in the seamless operation of CI/CD pipelines, ensuring swift identification and resolution of issues. Integrating error reporting into your pipeline enables real-time notifications to the development team, facilitating quick diagnosis and resolution of errors that may occur during execution.

Steps:

1. Set Up Webhook in Slack or Discord:
  - Create a webhook in your Slack or Discord workspace dedicated to receiving error notifications.
  - Follow the platform-specific documentation to generate a webhook URL and configure the destination channel.

2. Configure Error Reporting in CI/CD Pipeline:
  - Modify your CI/CD pipeline configuration file to incorporate error reporting mechanisms.
  - Add steps or scripts within the pipeline that capture error messages and logs during execution.
    
3. Send Error Notifications to Slack or Discord:
  - Develop a script or leverage existing tools to send error notifications to the designated Slack or Discord channel.
  - Ensure the script includes crucial information such as error messages, stack traces, details of affected components, and timestamps.

4. Integrate Error Reporting Script into Pipeline:
  -  Integrate the error reporting script into your CI/CD pipeline workflow.
  - Call the script whenever an error or failure is detected during the pipeline execution.

5. Test Error Reporting Integration:
  - Conduct thorough testing of the error reporting integration by intentionally triggering errors or failures in your pipeline.
  - Verify that error notifications are promptly sent to the designated Slack or Discord channel.
  - Confirm that the notifications contain relevant information for effective diagnosis and resolution, such as detailed error messages and contextual data.

workflow file

```yml
name: CICD pipeline

on:
  push:
    branches:
      - main

env:
  PG_DATABASE: wd-toDo-test
  PG_USER: ${{ secrets.PG_USER }}
  PG_PASSWORD: ${{ secrets.PG_PASSWORD }}

jobs:
  # Run tests
  run-tests:
    runs-on: ubuntu-latest

    # Set up a PostgreSQL service for testing
    services:
      postgres:
        image: postgres:11.7
        env:
          POSTGRES_USER: ${{ secrets.PG_USER }}
          POSTGRES_PASSWORD: ${{ secrets.PG_PASSWORD }}
          POSTGRES_DB: wd-toDo-test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      # Check out repository code
      - name: Checkout code
        uses: actions/checkout@v3

      # Install dependencies
      - name: Install dependencies
        run: cd todo-app && npm ci

      # Run unit tests
      - name: Run unit tests
        run: cd todo-app && npm test

      # Notify on Slack regardless of the outcome
      - name: Slack Notify
        uses: act10ns/slack@v1
        with:
          status: ${{ job.status}}
          channel: "#web-development"
        if: always()

      # Notify on Slack for success
      - name: Success Notify
        if: success()
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"Commit has been successful✅"}' ${{secrets.SLACK_WEBHOOK_URL}}

      # Notify on Slack for failure
      - name: Failure Notify
        if: failure()
        run: |
          curl -X POST -H 'Content-type: application/json' --data '{"text":"⚠️Error: The pipeline has failed❗"}' ${{secrets.SLACK_WEBHOOK_URL}}

      # Run the app for further testing or usage
      - name: Run the app
```



This GitHub Actions workflow segment is designed to notify a Slack channel, "#web-development," about the status of a CI/CD pipeline run. Here's a breakdown:

1. Slack Notify:

 - Utilizes the act10ns/slack@v1 action to post messages to the specified Slack channel.
 - The status: ${{ job.status}} dynamically includes the current job status (success, failure, etc.).
 - The if: always() condition ensures this notification occurs regardless of the job's outcome.

2. Success Notify:

 - This step triggers when the job is successful (if: success()).
 - Utilizes the curl command to send a POST request to the Slack webhook URL (${{secrets.SLACK_WEBHOOK_URL}}).
 - Sends a success message indicating that the commit has been successful.

3. Failure Notify:

- This step triggers when the job fails (if: failure()).
 - Uses the curl command to send a POST request to the Slack webhook URL.
 - Sends a warning message with an emoji, signaling that the pipeline has encountered an error.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/98af49f6-751e-4725-88bc-e1a84c3aa3a3)








