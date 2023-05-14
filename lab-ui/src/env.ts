export const env = {
  apiUrl:
    process.env.NODE_ENV === "production"
      ? "http://localhost:8080"
      : "http://localhost:5000",
};
