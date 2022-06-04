# Serverless - AWS Node.js Typescript

A simple REST API meant for a Todo App. Written in Typescript, structured using DDD principles and meant to be deployed in a serverless infrastructure using the [Serverless framework](https://www.serverless.com/)

## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `domain`      - business definitions of types and use-cases
- `adapters`    - adapters for the repos defined in the domain layer
- `interfaces`  - interfaces for the outside world to execute your use-cases, for example http interface for exposing your use-cases via HTTP endpoints
- `mocks`       - mock types and repos to be used for testing
- `utils`       - shared code base

```
.
├── src
│   ├── domain                      # Domain layer containing all your business logic
│   │   ├── todo                    # Use cases for Todo app
│   │   │   ├── create-list.ts
│   │   │   ├── list-lists.ts
│   │   │   ├── get-items.ts
│   │   │   ├── add-item.ts
│   │   │   └── remove-item.ts
│   │   │
│   │   ├── system
│   │   │   └── health.ts           # use case for system health check
│   │   │
│   │   └── types                   # Type, Interface definitions
│   │       ├── todo.ts
│   │       └── errors.ts
│   │
│   ├── adapters                    # Adapters for your repositories
│   │   └── pg
│   │       └── todo.ts             # Postgres adapter
│   │
│   ├── interfaces                  # Interface for the outside world
│   │   └── lambda-http
│   │       ├── health
│   │       │   ├── handler.ts
│   │       │   └── main.ts
│   │       ├── todo
│   │       │   ├── post-lists
│   │       │   │   ├── handler.ts
│   │       │   │   └── main.ts
│   │       │   ├── get-lists
│   │       │   │   ├── handler.ts
│   │       │   │   └── main.ts
│   │       │   └── others
│   │       └── utils               # Code specific for lambda http interfaces only
│   │           ├── capture-context.ts
│   │           └── with-logger.ts
│   │
│   └── utils                       # Shared code
│   │   └── logger.ts
│   └── version.ts
│       
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

## Developer setup and running locally

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

### Dependencies

- node 14+
- npm 8+
- docker 20.10.13 + [For local development only]

### Local setup
```bash
# Clone the repo
git clone https://github.com/dev-z/todo-api-ddd-typescript.git
cd todo-api-ddd-typescript

# Create your env file by copying .env.sample
# NOTE: You have to provide the values for the variables listed in the env file
cp env.sample .env

# Install dependencies
npm install
```

### Running locally

TODO

## Testing

TODO
