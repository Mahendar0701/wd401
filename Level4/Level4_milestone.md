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

- Unit Test:

```js
/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name = _csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

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

  test("Marks a todo as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy book",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayItems.length;
    const latestTodo = parsedGroupedResponse.dueTodayItems[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: false,
      });
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Marks a todo as incomplete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy bike",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayItems.length;
    const latestTodo = parsedGroupedResponse.dueTodayItems[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const markIncompleteResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: true,
      });
    const parsedUpdateResponse = JSON.parse(markIncompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    // FILL IN YOUR CODE HERE
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy car",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");

    const parsedResponse = JSON.parse(groupedTodosResponse.text);

    expect(parsedResponse.allTodos[3].title).toBe("Buy car");
  });

  test("Deletes a todo ", async () => {
    // FILL IN YOUR CODE HERE
    const agent = request.agent(server);
    await login(agent, "user.a@test.com", "12345678");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Go to market",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const groupedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayItems.length;
    const latestTodo = parsedGroupedResponse.dueTodayItems[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const deleteTodoResponse = await agent
      .delete(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
      });
    const parsedUpdateResponse = JSON.parse(deleteTodoResponse.text);
    expect(parsedUpdateResponse.success).toBe(true);
  });

  test("User A cannot update User B Todos", async () => {
    let res = await agent.get("/signup");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "MS",
      lastName: "Dhoni",
      email: "chennai@csk.com",
      password: "champion",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/todos").send({
      title: "Test todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const userA = res.id;

    await agent.get("/signout");

    res = await agent.get("/signup");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "virat",
      lastName: "kohi",
      email: "ipltrophy@rcb.com",
      password: "play",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const parsedResponse = await agent.put(`/todos/${userA}`).send({
      _csrf: csrfToken,
      completed: true,
    });
    console.log(parsedResponse);
    expect(parsedResponse.statusCode).toBe(422);
  });

  test("User A cannot delete User B Todos", async () => {
    let res = await agent.get("/signup");
    let csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "MS",
      lastName: "Dhoni",
      email: "chennai@csk.com",
      password: "champion",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "virat",
      lastName: "kohi",
      email: "ipltrophy@rcb.com",
      password: "play",
      _csrf: csrfToken,
    });
    const userA = res.id;

    await agent.get("/signout");

    res = await agent.get("/signup");
    csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "User",
      lastName: "B",
      email: "user.b@test.com",
      password: "userb",
      _csrf: csrfToken,
    });

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
    const parsedResponse = await agent.delete(`/todos/${userA}`).send({
      _csrf: csrfToken,
    });
    expect(parsedResponse.statusCode).toBe(422);
  });
});
```

Test cases passing

![image](https://github.com/Mahendar0701/wd401/assets/119734520/d7e8dea4-7141-4ab4-a25c-6497709ae971)

### Cypress Integration Tests

Integration tests cover the interaction between various components and ensure the end-to-end functionality of the application.

- Integration Test:

```js
// cypress/integration/todo_app_spec.js
describe("Todo Application", () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit("/login");
  });

  it("Allows a user to sign up and log in", () => {
    // Sign up
    cy.contains("Sign Up").click();
    cy.get('[name="firstName"]').type("John");
    cy.get('[name="lastName"]').type("Doe");
    cy.get('[name="email"]').type("john.doe@example.com");
    cy.get('[name="password"]').type("password123");
    cy.get('[name="_csrf"]').then(($csrf) => {
      const csrfToken = $csrf.val();
      cy.get("form").submit();
      cy.request({
        method: "POST",
        url: "/session",
        form: true,
        body: {
          email: "john.doe@example.com",
          password: "password123",
          _csrf: csrfToken,
        },
      });
    });

    // Log out
    cy.contains("Log Out").click();
  });

  it("Allows a user to add a new todo", () => {
    // Log in
    cy.get('[name="email"]').type("john.doe@example.com");
    cy.get('[name="password"]').type("password123");
    cy.get("form").submit();

    // Add a new todo
    cy.contains("Add Todo").click();
    cy.get('[name="title"]').type("Buy Groceries");
    cy.get('[name="dueDate"]').type("2023-02-28");
    cy.get('[name="_csrf"]').then(($csrf) => {
      const csrfToken = $csrf.val();
      cy.get("form").submit();
      // Assert that the new todo is visible in the list
      cy.contains("Buy Groceries");
    });
  });

  it("Allows a user to mark a todo as complete", () => {
    // Log in
    cy.get('[name="email"]').type("john.doe@example.com");
    cy.get('[name="password"]').type("password123");
    cy.get("form").submit();

    // Mark a todo as complete
    cy.get(".todo-item")
      .contains("Buy Groceries")
      .parent()
      .find('[name="completeButton"]')
      .click();
    // Assert that the todo is marked as complete
    cy.get(".todo-item")
      .contains("Buy Groceries")
      .should("have.class", "completed");
  });

  it("Allows a user to delete a todo", () => {
    // Log in
    cy.get('[name="email"]').type("john.doe@example.com");
    cy.get('[name="password"]').type("password123");
    cy.get("form").submit();

    // Delete a todo
    cy.get(".todo-item")
      .contains("Buy Groceries")
      .parent()
      .find('[name="deleteButton"]')
      .click();
    // Assert that the todo is deleted
    cy.contains("Buy Groceries").should("not.exist");
  });
});
```

This Cypress test suite includes tests for signing up, logging in, adding a new todo, marking a todo as complete, and deleting a todo.

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
