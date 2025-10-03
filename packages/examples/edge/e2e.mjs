import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log("[Edge]  Starting Wrangler dev server...");

const wrangler = spawn("npm", ["run", "dev"], {
  cwd: __dirname,
  stdio: ["inherit", "pipe", "pipe"]
});

let serverReady = false;
let output = "";

wrangler.stdout.on("data", (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);

  if (!serverReady && (output.includes("Ready on") || output.includes("localhost:8787"))) {
    serverReady = true;
    console.log("\n✓ [Edge] Wrangler ready, running test...\n");
    setTimeout(testEdge, 2000);
  }
});

wrangler.stderr.on("data", (data) => {
  const text = data.toString();
  process.stderr.write(text);
});

async function testEdge() {
  try {
    const url = "http://localhost:8787/";
    console.log("[Edge]  Testing:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const json = await response.json();

    // Check for error response
    if (json.error) {
      console.error("Worker returned error:", json.error);
      if (json.hint) {
        console.log("Hint:", json.hint);
      }
      throw new Error(json.error);
    }

    // Validate response structure
    if (
      typeof json.uuid !== "string" ||
      typeof json.bridged !== "string" ||
      typeof json.owner !== "string" ||
      typeof json.tokenURI !== "string"
    ) {
      console.error("Response:", json);
      throw new Error("Unexpected edge response shape");
    }

    console.log("\n✅ [Edge] Edge e2e test passed");
    console.log("[Edge]  UUID v7:", json.uuid);
    console.log("[Edge]  Bridged:", json.bridged);
    console.log("[Edge]  Owner:", json.owner);
    console.log("[Edge]  Token URI:", json.tokenURI);
    console.log("[Edge]  Tx Hash:", json.txHash);


    process.exit(0);
  } catch (error) {
    console.error("\n❌ [Edge] Edge e2e test failed:", error.message);
    process.exit(1);
  } finally {
    wrangler.kill();
  }
}

// Timeout after 60 seconds
setTimeout(() => {
  if (!serverReady) {
    console.error("\n❌ [Edge] Wrangler failed to start within 60 seconds");
    wrangler.kill();
    process.exit(1);
  }
}, 60000);

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n[Edge]  Interrupted, cleaning up...");
  wrangler.kill();
  process.exit(130);
});
