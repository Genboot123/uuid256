import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  typeCheck: "both",
  test: false,
  compilerOptions: {
    target: "ES2020",
    lib: ["ES2020", "DOM"],
  },
  package: {
    // package.json properties
    name: "u256id",
    version: Deno.args[0],
    types: "./esm/mod.d.ts",
    author: "posaune0423",
    description:
      "U256ID v2 (canonical: 0x + 64 hex; HR: Base58; versions: v0, v1)",
    license: "MIT",
    keywords: [
      "u256id",
      "uint256",
      "ethereum",
      "solidity",
      "canonical",
      "base58",
      "hex",
      "uniqueentifier",
      "web3",
      "blockchain",
      "solidity library",
      "typescript sdk",
      "deno sdk",
      "crypto",
      "id encoding",
      "id versioning",
      "address encoding",
      "token",
      "smart contract",
      "cross-platform",
      "open source",
      "foundry compatible",
      "canonicalization",
      "id generator",
      "id parser",
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/posaune0423/u256id.git",
    },
    bugs: {
      url: "https://github.com/posaune0423/u256id/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
