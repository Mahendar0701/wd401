# WD401 - Level4 : Testing

## Configuration of Testing Framework

### Jest Configuration

Jest is utilized as the testing framework for unit tests in the Node.js project. To configure Jest, the following steps are taken:

1. **Installation of Jest:**

   ```
      npm install jest --save-dev
   ```

2. **Create a Test Directory:**

   - A directory named **tests** is created in the root of the project to house the unit test files.

3. **Run Jest:**
   - The command npm test is configured in the project's package.json file to run Jest.
     ```json
     "scripts": {
      "test": "jest"
      }
     ```
4. **Sample Unit Test:**

   A sample unit test is created in **tests**/todo.test.js.

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

### Cypress Configuration

Cypress is chosen for integration tests in a project. Configuration steps for Cypress include:

1. **Installation of Cypress:**

   ```
   npm install cypress --save-dev
   ```

2. **Create Cypress Folder Structure:**

   - A cypress directory is created in the project root.
   - Inside the cypress directory, an integration folder is added to store integration test files.

3. **Cypress Configuration File:**

   - A cypress.config.js file is created in the project root to configure Cypress.

   ```js
   const { defineConfig } = require("cypress");

   module.exports = defineConfig({
     integration: {
       setupNodeEvents(on, config) {
         require("cypress-json-results")({
           on,
           filename: "results.json",
         });
       },
     },
   });
   ```

4. **Update package.json Scripts:**

   - A script is added to run Cypress tests.

   ```json
   "scripts": {
    "cy:test": "npx cypress run"
   }
   ```

## Test Suite Coverage

### Jest Unit Tests

Unit tests focus on individual functions, components, or modules of the application. A sample unit test is created to ensure basic functionality.

- Sample Unit Test:

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

  Test cases passing

  ![image](https://github.com/Mahendar0701/wd401/assets/119734520/a7da31d3-3abe-4948-b6a9-6b70312f5c19)

### Cypress Integration Tests

Integration tests cover the interaction between various components and ensure the end-to-end functionality of the application.

- Sample Integration Test:

  ```js
  // cypress/integration/sample.spec.js
  describe("Sample Test", () => {
    it("Should add items to the to-do list", () => {
      cy.visit("http://localhost:3000");
      cy.get("[data-cy=addButton]").click();
      cy.get("[data-cy=todoItem]").should("have.length", 1);
    });
  });
  ```

## Automatic Test Suite Execution on GitHub

GitHub Actions are set up to automate the test suite execution on every push to the repository.

```yml
name: Auto test
on: push
env:
  PG_DATABASE: wd-toDo-test
  PG_USER: postgres
  PG_PASSWORD: mahi123@#
jobs:
  # Label of the container job
  run-tests:
    # Containers must run in Linux based operating systems
    runs-on: ubuntu-latest

    # Service containers to run with `container-job`
    services:
      # Label used to access the service container
      postgres:
        # Docker Hub image
        image: postgres:11.7
        # Provide the password for postgres
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: mahi123@#
          POSTGRES_DB: wd-toDo-test
        # Set health checks to wait until postgres has started
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      # Downloads a copy of the code in your repository before running CI tests
      - name: Check out repository code
        uses: actions/checkout@v3

      # Performs a clean installation of all dependencies in the `package.json` file
      # For more information, see https://docs.npmjs.com/cli/ci.html
      - name: Install dependencies
        run: cd todo-app && npm ci

      - name: Run unit tests
        run: cd todo-app && npm test
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

      - name: Run integration tests
        run: |
          cd l10
          npm install cypress cypress-json-results
          npx cypress run --env STUDENT_SUBMISSION_URL="http://localhost:4000/"
```

Automated test are executed in github workflow

![image](https://github.com/Mahendar0701/wd401/assets/119734520/2cd20da0-f6f3-4820-a431-acfbbc3412c9)

This GitHub Actions workflow:

- Triggers on every push to the main branch.
- Sets up a PostgreSQL service container.
- Checks out the repository code.
- Installs dependencies and runs unit tests using Jest.
- Sets up and runs the application, including necessary database operations.
- Runs integration tests using Cypress.

## GitHub Actions Walkthrough

1. Trigger:

   The workflow triggers on every push event targeting the main branch.

2. Job Creation:

   The run-tests job is initialized, specifying it runs on the latest version of Ubuntu.

3. Service Config:

   A PostgreSQL service is configured to provide a test database for the application.

4. Steps Execution:

   - Code is checked out, dependencies are installed, and unit tests are executed.
   - The application is set up, including database operations, and started on port 3000.
   - Integration tests are then run using Cypress, simulating interactions with the application.
   - This GitHub Actions workflow automates the entire testing process on GitHub, providing a seamless and reliable approach to test suite execution.
