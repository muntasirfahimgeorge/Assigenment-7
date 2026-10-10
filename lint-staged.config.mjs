const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  "*.{json,css,md,yml,yaml}": "prettier --write",
};

export default config;
