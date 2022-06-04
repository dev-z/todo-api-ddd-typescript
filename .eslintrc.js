module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  globals: {
    analytics: false,
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  rules: {
    "prettier/prettier": "error",
    "no-console": "error",
    "no-duplicate-imports": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      rules: {
        // We need to disable this rule in tests because we want to allow
        // expect(x.method).toHaveBeenCalled()
        // which would be otherwise blocked.
        "@typescript-eslint/unbound-method": "off",
        // We don't want to be explicit with types in test as we usually create
        // utility functions to make test more readable.
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
