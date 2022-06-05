import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: "todo-api-ddd-typescript",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
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
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  functions: {
    "api-create-list": {
      handler: "src/interfaces/lambda-http/todo/post-lists/main.handler",
      events: [
        {
          http: {
            method: "post",
            path: "/v1/lists",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
