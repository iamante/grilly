const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const target = path.join(
  projectRoot,
  "node_modules",
  "react-native-css",
  "dist",
  "commonjs",
  "compiler",
  "lightningcss-loader.js",
);

if (process.platform !== "android") {
  process.exit(0);
}

if (!fs.existsSync(target)) {
  console.warn(`[patch-react-native-css-lightningcss] Missing file: ${target}`);
  process.exit(0);
}

const next = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lightningcssLoader = lightningcssLoader;
/* eslint-disable @typescript-eslint/no-require-imports */
function lightningcssLoader() {
  const useWasm = process.platform === "android";

  if (useWasm) {
    const {
      transform: lightningcss,
      Features
    } = require("lightningcss-wasm");
    return {
      lightningcss,
      Features
    };
  }

  let lightningcssPath;

  try {
    lightningcssPath = require.resolve("lightningcss", {
      paths: [require.resolve("@expo/metro-config/package.json").replace("/package.json", "")]
    });
  } catch {}

  try {
    lightningcssPath ??= require.resolve("lightningcss");
  } catch {}

  if (!lightningcssPath) {
    throw new Error("react-native-css was unable to determine the path to lightningcss");
  }

  const {
    transform: lightningcss,
    Features
  } = require(lightningcssPath);

  try {
    const lightningcssPackageJSONPath = require.resolve("../../package.json", {
      paths: [lightningcssPath]
    });
    const packageJSON = require(lightningcssPackageJSONPath);
    if (packageJSON.version === "1.30.2") {
      throw new Error("[react-native-css] lightningcss version 1.30.2 has a critical bug that breaks compilation. Please pin the version of lightningcss to 1.30.1; or try upgrading.");
    }
  } catch {}

  return {
    lightningcss,
    Features
  };
}
//# sourceMappingURL=lightningcss-loader.js.map
`;

const current = fs.readFileSync(target, "utf8");
if (current === next) {
  process.exit(0);
}

fs.writeFileSync(target, next);
console.log("[patch-react-native-css-lightningcss] Patched react-native-css to use lightningcss-wasm on Android.");
