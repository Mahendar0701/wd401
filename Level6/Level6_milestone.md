# Level 06 : Deploying and Securing a Node.js Application in Cluster Mode with PM2

## 1. Environment Variable Configuration:

Setting up environment variables for your Node.js application is crucial for accommodating various environments. Follow these steps to configure environment variables, document their purpose, and manage sensitive information:

- Identify Environment Variables:
   - API Keys: API_KEY
   - Database Connection String: DATABASE_URL
   - Environment (Development, Production): NODE_ENV
- Use a .env File:
   Create a .env file in your project's root to store environment variables. Example .env file:
   
   example:
   ```env
   # .env

    #production
    
    NODE_ENV=production
    PROD_USERNAME=postgres
    PROD_DATABASE=wd-toDo-prod
    PROD_PASSWORD=mahi123@#
    PROD_HOST=db
    PROD_DIALECT=postgres
    
    # App Service Configuration
    NODE_ENV=development
    DEV_USERNAME=postgres
    DEV_DATABASE=wd-toDo-dev
    DEV_PASSWORD=mahi123@#
    DEV_HOST=db
    DEV_DIALECT=postgres
    
   ```
This .env file  have configurations for both production and development environments.

**1 NODE_ENV**

  - Purpose: Specifies the environment in which the application is running.
  - Expected Values: production for the production environment and development for the development environment.

**2. Production Environment Variables:**

  - **PROD_USERNAME**

    - Purpose: Database username for the production environment.
    - Expected Values: A valid PostgreSQL database username.
      
  - **PROD_DATABASE**

    - Purpose: Database name for the production environment.
    - Expected Values: A valid PostgreSQL database name.

  - **PROD_PASSWORD**

    - Purpose: Database password for the production environment.
    - Expected Values: A secure password for the PostgreSQL database user.

  - **PROD_HOST**

    - Purpose: Database host for the production environment.
    - Expected Values: The host address where the PostgreSQL database is running.

  - **PROD_DIALECT**

    - Purpose: Database dialect for the production environment.
    - Expected Values: postgres indicating the use of PostgreSQL.

**3. Development Environment Variables:**

  - **DEV_USERNAME**

    - Purpose: Database username for the development environment.
    - Expected Values: A valid PostgreSQL database username.

  - **DEV_DATABASE**

    - Purpose: Database name for the development environment.
    - Expected Values: A valid PostgreSQL database name.

  - **DEV_PASSWORD**

    - Purpose: Database password for the development environment.
    - Expected Values: A secure password for the PostgreSQL database user.

  - **DEV_HOST**

    - Purpose: Database host for the development environment.
    - Expected Values: The host address where the PostgreSQL database is running.

  - **DEV_DIALECT**

    - Purpose: Database dialect for the development environment.
    - Expected Values: postgres indicating the use of PostgreSQL.

 **4. Ensure Security:** 
    - Ensure the .env file is listed in your .gitignore to prevent it from being pushed to version control.
    
By configuring environment variables in this way, your Node.js application is prepared for both production and development environments, and sensitive information is handled securely.

## Managing app environments with Docker
###  Docker setup for managing app environments with Docker

```dockerfile
FROM --platform=$BUILDPLATFORM node:lts-alpine as base
WORKDIR /app
COPY package.json /
EXPOSE 3000

FROM base as production
ENV NODE_ENV=production
RUN npm install -g husky && pm2
COPY . /app
CMD pm2 start app.js -i max --log ./logs/app.log

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /app
CMD npm run start

```

- The Dockerfile has two stages, production and dev, for building images optimized for production and development environments, respectively.

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
- docker-compose.yml defines services for development, using the dev target from the Dockerfile.
  
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/948b0e8a-d817-496d-9f80-38ed54ae3168)

docker-compose-prod.yml

```yml
version: "3.8"

services:
  app:
    build:
      context: .
      target: production
    image: todo-app:production

    ports:
      - 3010:3000
    env_file:
      - .env
    depends_on:
      - db

  db:
    image: postgres:15
    volumes:
      - pg-prod-data:/var/lib/postgresql/data
    env_file:
      - .env
    environment:
      POSTGRES_USER: $PROD_USERNAME
      POSTGRES_DB: $PROD_DATABASE
      POSTGRES_PASSWORD: $PROD_PASSWORD

volumes:
  pg-prod-data:

```
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/3c03373a-86b3-4f16-b925-bfd6f2bd881d)


- docker-compose-prod.yml defines services for production, using the production target from the Dockerfile.
- Environment variables are loaded from the .env file to configure both the application and the database for each environment.
- Volume configurations are used to persist data for both development and production databases.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/0309efce-84a9-4b40-ad2a-25d42c5a244d)


This setup allows to seamlessly switch between development and production environments using Docker Compose, and it ensures a consistent and reproducible deployment process.


## 2. PM2 Cluster Mode Deployment:

Cluster mode allows our Node.js application to take full advantage of multi-core systems, by launching multiple instances of the application across several CPU cores. This process is managed seamlessly by PM2, which automatically handles the distribution of incoming connections among the various instances. This means that the workload is evenly spread, preventing any single instance from becoming a bottleneck.

To deploy our Node.js application using PM2 in cluster mode and ensure proper documentation,we have to follow these steps:

1. Install PM2:
   ```
   npm install pm2 -g
   ```
2. Update Start Script:
   
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/41d05cd9-e7ff-4694-a4be-4572e012b550)

3. run pm2:

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/6dd72b3e-26f1-478d-bb04-c5ee956b0344)

4. Usage example:
 
![image](https://github.com/Mahendar0701/git-learn/assets/119734520/18e4b817-7364-454b-b8d3-48d604ad065d)

Make following changes in dockerfile

```dockerfile
FROM base as production
ENV NODE_ENV=production
RUN npm install -g husky && pm2
COPY . /app
CMD pm2 start index.js -i max --log ./logs/app.log
```

5. Ensure Proper Logging:

Verify that the specified log files (./logs/app-out.log and ./logs/app-error.log in this example) are being created and updated properly during the application's runtime. Adjust file paths and configurations as needed.

![image](https://github.com/Mahendar0701/git-learn/assets/119734520/01b9d800-21b6-491e-9141-64d27e7b7ffd)


## 3. Security Measures:

### Best Practices for Securing Environment Variables:

1. Use a .env File:

  - Best Practice: Store environment variables in a separate .env file.
  - Rationale: Keeping sensitive information in a dedicated file makes it easier to manage and ensures that these variables are not inadvertently exposed in version control systems.

    ![image](https://github.com/Mahendar0701/git-learn/assets/119734520/c38ca43b-7bd6-46a0-a6f5-8dde83f5c15b)


2. Use dotenv Library:

  - Best Practice: Leverage the dotenv library to load environment variables from the .env file.
  - Rationale: dotenv provides a secure way to load environment variables, preventing unintentional exposure and making it a standard practice across different environments.

3. Keep .env File in .gitignore:

  - Best Practice: Add the .env file to the .gitignore to prevent it from being included in version control.
  - Rationale: Excluding the .env file from version control ensures that sensitive information is not exposed to unauthorized users or stored in public repositories.

    ![image](https://github.com/Mahendar0701/git-learn/assets/119734520/f7e6606a-9f5d-4c05-8111-780a509bf257)


4. Avoid Hardcoding Sensitive Information:

  - Best Practice: Refrain from hardcoding sensitive information directly in the code.
  - Rationale: Hardcoding sensitive data increases the risk of unintentional exposure. Utilizing environment variables provides a more secure and flexible approach.

5. Use Encrypted Secrets for CI/CD:

  - Best Practice: In CI/CD pipelines, encrypt sensitive environment variables and secrets.
  - Rationale: Encrypting secrets during CI/CD prevents them from being exposed in build logs or during the pipeline execution, maintaining confidentiality.

    ![image](https://github.com/Mahendar0701/git-learn/assets/119734520/fb4d3452-f793-4fc2-8f9e-43bf392eede6)










   
