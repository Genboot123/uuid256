import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!CONTRACT_ADDRESS) {
  console.error("Missing CONTRACT_ADDRESS env var");
  process.exit(1);
}
if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY env var");
  process.exit(1);
}

console.log("Starting Wrangler dev server (Base Sepolia)...");
const wrangler = spawn("npm", ["run", "dev"], {
  cwd: __dirname,
  stdio: ["inherit", "pipe", "pipe"]
});

let serverReady = false;
let output = "";

wrangler.stdout.on("data", (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text); // Show wrangler output

  if (!serverReady && (output.includes("Ready on") || output.includes("http://127.0.0.1:8787"))) {
    serverReady = true;
    console.log("\n✓ Wrangler ready, running test...\n");
    // Wait a bit for server to be fully ready
    setTimeout(testEdge, 2000);
  }
});

wrangler.stderr.on("data", (data) => {
  const text = data.toString();
  process.stderr.write(text);
});

async function testEdge() {
  try {
    const url = `http://127.0.0.1:8787/?addr=${encodeURIComponent(CONTRACT_ADDRESS)}&pk=${encodeURIComponent(PRIVATE_KEY)}`;
    console.log("Testing:", url);

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const json = await response.json();

    if (typeof json.uuid !== "string" || typeof json.bridged !== "string" || typeof json.owner !== "string" || typeof json.uri !== "string") {
      console.error("Response:", json);
      throw new Error("Unexpected edge response shape");
    }

    console.log("\n✅ Edge e2e test passed");
    console.log("Response:", {
      uuid: json.uuid,
      bridged: json.bridged.substring(0, 20) + "...",
      owner: json.owner
    });

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Edge e2e test failed:", error.message);
    process.exit(1);
  } finally {
    wrangler.kill();
  }
}

// Timeout after 60 seconds
setTimeout(() => {
  if (!serverReady) {
    console.error("\n❌ Wrangler failed to start within 60 seconds");
    wrangler.kill();
    process.exit(1);
  }
}, 60000);

// Handle process termination
process.on("SIGINT", () => {
  console.log("\nInterrupted, cleaning up...");
  wrangler.kill();
  process.exit(130);
});
