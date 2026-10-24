import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "src/resume/data/site.config.json");
const resumePath = path.resolve(__dirname, "src/resume/data/resume.json");

const readJsonFile = async (filePath) => {
  const content = await readFile(filePath, "utf-8");
  return JSON.parse(content);
};

const writeJsonFile = async (filePath, payload) => {
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
};

const configApiPlugin = {
  name: "config-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestPath = req.url?.split("?")[0] ?? "/";
      const normalizedPath = requestPath.startsWith("/resume") ? requestPath.replace("/resume", "") : requestPath;

      if (normalizedPath !== "/api/config" && normalizedPath !== "/api/resume") {
        next();
        return;
      }

      const targetPath = normalizedPath === "/api/config" ? configPath : resumePath;
      const resourceName = normalizedPath === "/api/config" ? "site config" : "resume data";

      if (req.method === "GET") {
        try {
          const payload = await readJsonFile(targetPath);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(payload));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: `Unable to read ${resourceName}.` }));
        }
        return;
      }

      if (req.method === "PUT") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk;
        });

        req.on("end", async () => {
          try {
            const parsed = JSON.parse(body || "{}");
            await writeJsonFile(targetPath, parsed);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(parsed));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: `Invalid ${resourceName} payload.` }));
          }
        });
        return;
      }

      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method not allowed." }));
    });
  }
};

export default defineConfig({
  plugins: [react(), configApiPlugin],
  base: "/resume/"
});
