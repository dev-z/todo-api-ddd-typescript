import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: "todo-api-ddd-typescript",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    stage: '${opt:stage, "development"}',
    region: '${opt:region, "us-east-1"}',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      REGION: "${self:provider.region}",
      STAGE: "${self:provider.stage}",
      CORRELATION_ID_HEADER_NAME: "${env:CORRELATION_ID_HEADER_NAME}",
      ACTOR_HEADER_NAME: "${env:ACTOR_HEADER_NAME}",
      TODO_DATABASE_URL: "${env:TODO_DATABASE_URL}",
    },
    versionFunctions: false,
  },
  package: { individually: true },
  useDotenv: true,
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [
        "aws-sdk",
        "better-sqlite3",
        "tedious",
        "oracledb",
        "mysql",
        "sqlite3",
        "pg-native",
        "mysql2",
        "pg-query-stream",
      ],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
    "serverless-offline": {
      httpPort: "8000",
      lambdaPort: "8002",
      noPrependStageInUrl: true,
    },
  },
  functions: {
    api_create_list: {
      handler: "src/interfaces/rest/lists/post/main.handler",
      events: [
        {
          http: {
            method: "post",
            path: "/v1/lists",
          },
        },
      ],
    },
    api_list_lists: {
      handler: "src/interfaces/rest/lists/get/main.handler",
      events: [
        {
          http: {
            method: "get",
            path: "/v1/lists",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
