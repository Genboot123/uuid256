import http from "node:http";
import { fileURLToPath } from "node:url";
import { createReadStream } from "node:fs";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer((req, res) => {
  const url = req.url || "/";
  let filePath;
  if (url === "/") filePath = join(__dirname, "index.html");
  else if (url.startsWith("/node_modules/")) filePath = join(__dirname, url);
  else filePath = join(__dirname, url);

  const stream = createReadStream(filePath);
  stream.on("error", () => {
    res.statusCode = 404;
    res.end("not found");
  });
  stream.pipe(res);
});

const port = 8080;
server.listen(port, () => console.log(`http://localhost:${port}`));
