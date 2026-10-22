import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, "src/resume/data/site.config.json");

const configApiPlugin = {
  name: "config-api",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const requestPath = req.url?.split("?")[0] ?? "/";
      const normalizedPath = requestPath.startsWith("/resume") ? requestPath.replace("/resume", "") : requestPath;

      if (normalizedPath !== "/api/config") {
        next();
        return;
      }

      if (req.method === "GET") {
        try {
          const config = await readFile(configPath, "utf-8");
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(config);
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Unable to read site config." }));
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
            const output = `${JSON.stringify(parsed, null, 2)}\n`;
            await writeFile(configPath, output, "utf-8");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(parsed));
          } catch (error) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Invalid site config payload." }));
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
