# WD401 Level07 : Dockerizing and Deploying a Node.js Application with CICD Pipeline

## Problem Statement: Dockerizing and Deploying a Node.js Application with CICD Pipeline

You have to containerize a Node.js application using Docker, configuring environment variables within the Docker containers, defining a Docker Compose file for multiple services (including a database service), and setting up a Continuous Integration and Continuous Deployment (CICD) pipeline to deploy the Dockerized application on a server.

## 1. Dockerize the Application:

Docker, a powerful containerization platform, streamlines the deployment of applications by encapsulating them in lightweight and portable containers. These containers include the application's code and all necessary dependencies, ensuring consistent and reliable execution across diverse computing environments.

Dockerfile
```Dockerfile
FROM --platform=$BUILDPLATFORM node:lts-alpine as base
WORKDIR /app
# COPY todo-app/package.json /app/
COPY package.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm install -g husky && pm2
COPY . /app
CMD pm2 start index.js -i max --log ./logs/app.log

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
CMD npm run start
```

Explanation:

1. **Base Stage:**
   - **FROM --platform=$BUILDPLATFORM node:** lts-alpine as base: Specifies the base image as Node.js with Alpine Linux, considering the specified platform.
   - **WORKDIR /app:** Sets the working directory inside the container to /app.
   - **COPY package.json /:** Copies the package.json from the host to the root directory in the container.
   - **EXPOSE 3000:** Informs Docker to expose port 3000, allowing external connections.
     
2. **Production Stage:**
   - **FROM base as production:** Creates a new stage named 'production' based on the 'base' stage.
   - **ENV NODE_ENV=production:** Sets the environment variable NODE_ENV to 'production.'
   - **RUN npm install -g husky && pm2:** Installs global dependencies husky (for Git hooks) and pm2 (process manager).
   - **COPY . /app:** Copies the entire application to the /app directory in the container.
   - **CMD pm2 start index.js -i max --log ./logs/app.log:** Specifies the command to start the application using PM2 in clustered mode, with logs stored in ./logs/app.log.
  
3. **Development Stage:**
   - **FROM base as dev:** Creates a new stage named 'dev' based on the 'base' stage.
   - **ENV NODE_ENV=development:** Sets the environment variable NODE_ENV to 'development.'
   - **RUN npm install -g nodemon && npm install:** Installs global dependencies nodemon (automatic server restarting) and application dependencies from package.json.
   - **COPY . /app:** Copies the entire application to the /app directory in the container.
   - **CMD npm run start:** Specifies the command to run the application during development using npm run start.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/b70a3a0f-7638-4ce5-93ae-1886fbddd297)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/f8af9c8f-22c2-4ff3-b132-a7eb8ae5a2ca)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/e1c8db39-50c0-4ed4-825f-51683a85cb68)



## 2.Configure Environment Variables in Docker:

environment variable used are: 

```env
# .env

#production

NODE_ENV=production
PROD_USERNAME=postgres
PROD_DATABASE=wd-toDo-prod
PROD_PASSWORD=mahi123@#
PROD_HOST=db
PROD_DIALECT=postgres


# development
NODE_ENV=development
DEV_USERNAME=postgres
DEV_DATABASE=wd-toDo-dev
DEV_PASSWORD=mahi123@#
DEV_HOST=db
DEV_DIALECT=postgres

```

1. **Production Environment:**
- **NODE_ENV=production:** Indicates that the application is running in a production environment.
- **PROD_USERNAME=postgres:** Specifies the username for connecting to the PostgreSQL database in the production environment.
- **PROD_DATABASE=wd-toDo-prod:** Specifies the name of the production database.
- **PROD_PASSWORD=mahi123@#:** Provides the password for connecting to the production database.
- **PROD_HOST=db:** Defines the hostname or IP address where the production database is hosted.
- **PROD_DIALECT=postgres:** Specifies the database dialect or type, in this case, PostgreSQL.

2. **Development Environment:**
- **NODE_ENV=development:** Indicates that the application is running in a development environment.
- **DEV_USERNAME=postgres:** Specifies the username for connecting to the PostgreSQL database in the development environment.
- **DEV_DATABASE=wd-toDo-dev:** Specifies the name of the development database.
- **DEV_PASSWORD=mahi123@#:** Provides the password for connecting to the development database.
- **DEV_HOST=db:** Defines the hostname or IP address where the development database is hosted.
- **DEV_DIALECT=postgres:** Specifies the database dialect or type, in this case, PostgreSQL.

This .env file is placed in .gitignore so that info is secured

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/b46c5d9b-6655-4af2-9c5e-031d5f6d42b9)

## Secure Practices for Managing Sensitive Information:

1. **Avoid Embedding Credentials:** Refrain from putting passwords directly in Dockerfiles or code.

2. **Use Docker Secrets:** Leverage Docker's built-in secrets management for secure data handling.

3. **Github secrets:** In the context of GitHub, secrets are encrypted environment variables that you can store and use in your GitHub Actions workflows. They are designed to store sensitive information securely, such as API keys, passwords, and tokens. 

4. **.env file :** It helps manage environment-specific settings without hardcoding them directly into the code.

   

## 3.Define Docker Compose for Multiple Services:

Docker Compose is a tool for defining and running multi-container Docker applications. It allows you to define a multi-container environment in a single file, making it easy to spin up and manage complex applications. Docker Compose uses a YAML file to configure application services, networks, and volumes.

docker-compose.yml
```yml
version: "3.4"

services:
  app:
    build:
      context: .
      target: dev
    image: todo-app:development
    volumes:
      - .:/app
    ports:
      - 3000:3000
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:15
    volumes:
      - pg-dev-data:/var/lib/postgresql/data
    env_file:
      - .env
    environment:
      POSTGRES_USER: $DEV_USERNAME
      POSTGRES_DB: $DEV_DATABASE
      POSTGRES_PASSWORD: $DEV_PASSWORD

volumes:
  pg-dev-data:

```

**Explaination:**

1. Version: Specifies the version of the Docker Compose file format being used.

2. Services: Defines multiple services, each representing a Docker container.

3. Node.js Application Service:

- Configures the Node.js application service.
- Builds the service using the provided Dockerfile (target: dev).
- Sets the image name to todo-app:development.
- Mounts the current directory as a volume to /app in the container.
- Maps port 3000 of the container to port 3000 of the host machine.
- Loads environment variables from the .env file.
- Depends on the db service, ensuring that the database service is started before the application service.

4. Database Service (Postgres):

- Sets up the database service using the PostgreSQL 15 Docker image.
- Mounts a volume (pg-dev-data) to persist the database data.
- Loads environment variables from the .env file.
- Sets the PostgreSQL user, database name, and password using environment variables.

5.Volumes: Defines a named volume (pg-dev-data) to persist the database data.

![image](https://github.com/Mahendar0701/wd401/assets/119734520/b7b79a5a-c988-49d2-97cb-ac22a9e0b617)

![image](https://github.com/Mahendar0701/wd401/assets/119734520/79dec5a6-f6aa-455d-8d8e-724a1cb8caf0)


## 4.Setup CICD Pipeline:


The Docker job in the provided GitHub Actions workflow automates the containerization and deployment process of a Node.js application. Here's a brief explanation of the key steps in the Docker job:

cicd.yml
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

    #Set up a PostgreSQL service for testing
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

      # - name: Run integration tests
      #   run: |
      #     cd todo-app
      #     npm install cypress cypress-json-results
      #     npx cypress run --env STUDENT_SUBMISSION_URL="http://localhost:3000/"

      # Notify on Slack regardless of the outcome
      - name: Slack Notify
        uses: act10ns/slack@v1
        with:
          status: ${{ job.status}}
          steps: ${{toJson(steps)}}
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

  docker:
    runs-on: ubuntu-latest
    needs: run-tests

    steps:
      - uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build the Docker image
        run: docker build . --file todo-app/Dockerfile --tag ${{ secrets.DOCKERHUB_USERNAME }}/todo

      - name: Docker Push
        run: docker push ${{ secrets.DOCKERHUB_USERNAME }}/todo

  # Deploy to production
  deploy-to-production:
    runs-on: ubuntu-latest
    needs: docker

    steps:
      # Deploy to Production using Render
      - name: Deploy to Production
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.SERVICE_ID}}
          api-key: ${{ secrets.RENDER_API_KEY}}


```

explaination:

- **Docker Setup:**

  **runs-on:** ubuntu-latest: Specifies the environment for the job as Ubuntu, ensuring compatibility.

  **needs:** run-tests: Establishes a dependency on the "run-tests" job, ensuring that Docker-related tasks only proceed if tests are successful.

- **Checkout Code:**

  Utilizes actions/checkout@v3 to retrieve the source code, facilitating subsequent build and deployment steps.

- **Login to Docker Hub:

  Uses docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9 to securely log in to Docker Hub with secret credentials.

- **Build Docker Image:**

  **docker build ...:** Initiates the construction of a Docker image from the specified Dockerfile (todo-app/Dockerfile).

  **--tag ${{ secrets.DOCKERHUB_USERNAME }}/todo:** Assigns a tag to the image, associating it with the Docker Hub username and repository name.

- **Push Docker Image:**

  **docker push ...:** Uploads the created Docker image to the designated repository on Docker Hub.

- **Deploy to Production:**

  **johnbeynon/render-deploy-action@v0.0.8:** Leverages the Render Deploy Action to automate deployment on the Render platform.
  Requires sensitive information (service ID, API key) stored as secrets for secure access.

This Docker job automates the build, push, and deployment steps, ensuring a streamlined CI/CD pipeline for a Node.js application. The job is triggered when the "run-tests" job completes successfully, indicating that the application's tests have passed.


![image](https://github.com/Mahendar0701/git-learn/assets/119734520/7aa57e97-9456-4dea-a522-a67ff016ef23)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/5a4deb92-f992-4ee8-9441-3a25c5f228cb)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/f3e73eea-8d83-4733-b800-8e625d1e8732)

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/fb674dbe-5281-4d0b-96e3-b506fe2d401f)



# Video links 

[video 1](https://www.loom.com/share/0ff3b3b349a54479a8b5348217286fe5)

[video 2](https://www.loom.com/share/2bb1c7304b084d59a71db215368a6b23)







