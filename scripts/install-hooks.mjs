if (
  process.env.CI !== "true" &&
  process.env.VERCEL !== "1" &&
  process.env.NODE_ENV !== "production"
) {
  const { default: husky } = await import("husky");
  const result = husky();
  if (result) throw new Error(result);
}
