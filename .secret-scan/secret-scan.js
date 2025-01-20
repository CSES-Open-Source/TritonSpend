const child_process = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const util = require("node:util");
const tty = require("node:tty");

const CACHE_PATH = path.join(__dirname, "secret-scan-cache.json");
const CONFIG_PATH = path.join(__dirname, "secret-scan-config.json");
const REPORT_PATH = path.join(__dirname, "secret-scan-report.json");
const JSON_ENCODING = "utf8";

const EOL = /\r?\n/;

const secretRemovalAdvice = `
1. If you are absolutely confident that the reported
   secrets are not actually secrets, see
   ${CONFIG_PATH}
   for next steps and try again. Ask your engineering
   manager or VP Technology if you have any uncertainty
   whatsoever.

2. If the secrets are in a file in the working tree, and
   this file should not be committed to Git, update your
   .gitignore and try again.

3. If the secrets are in the index, unstage them with
   git restore --staged <file> and try again.

4. If the secrets are in an existing commit, you are
   REQUIRED to report this to your engineering manager AND
   VP Technology, even if you are sure that the commit was
   never pushed. This is because a secret being committed
   anywhere (even locally) indicates a potential issue with
   the implementation or configuration of this secret
   scanning tool.

   If the commit was pushed, assume that the secret is now
   publicly known, and revoke it as soon as possible.

   Proper secret management is an important part of building
   secure software for our clients. You'll never be punished
   for reporting a problem; please err on the side of
   letting us know if you're unsure. If something goes wrong
   and is reported promptly, our policy is that the
   responsibility belongs to the processes and tooling, not
   the individual.
`.trim();

/**
 * @param {string} text
 * @returns {string}
 */
function redText(text) {
  if (process.stdout.isTTY && process.stdout.hasColors()) {
    // https://github.com/nodejs/node/issues/42770#issuecomment-1101093517
    const red = util.inspect.colors.red;
    if (red !== undefined) {
      return `\u001b[${red[0]}m` + text + `\u001b[${red[1]}m`;
    }
  }
  return text;
}

/**
 * @param {string} filePath
 * @returns {unknown}
 */
function parseJSONFromFile(filePath) {
  const text = fs.readFileSync(filePath, { encoding: JSON_ENCODING });
  return JSON.parse(text);
}

/**
 * @template T
 * @param {() => T} callback
 * @returns {T | null}
 */
function nullIfFileNotFound(callback) {
  try {
    return callback();
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e.code === "ENOENT" || e.code === "EISDIR")
    ) {
      return null;
    }
    throw e;
  }
}

/**
 * @param {unknown} array
 * @returns {string[]}
 */
function asStringArray(array) {
  if (!Array.isArray(array)) {
    throw new Error(`Not a string array: ${JSON.stringify(array)}`);
  }

  return array.map((s) => {
    if (typeof s === "string") {
      return s;
    }
    throw new Error(`Not a string: ${JSON.stringify(s)}`);
  });
}

/**
 * @typedef {{
 *   allowedStrings: string[];
 *   secretRegexes: Record<string, string>;
 *   skippedFiles: string[];
 * }} SecretScanConfig
 */

/**
 * @returns {SecretScanConfig}
 */
function loadConfig() {
  const parsed = parseJSONFromFile(CONFIG_PATH);
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    "allowedStrings" in parsed &&
    "secretRegexes" in parsed &&
    "skippedFiles" in parsed &&
    typeof parsed.secretRegexes === "object" &&
    parsed.secretRegexes !== null
  ) {
    const secretRegexes = Object.fromEntries(
      Object.entries(parsed.secretRegexes).map(([k, v]) => {
        if (typeof v !== "string") {
          throw new Error(`Not a string: ${JSON.stringify(v)}`);
        }
        return [k, v];
      }),
    );

    return {
      allowedStrings: asStringArray(parsed.allowedStrings),
      secretRegexes,
      skippedFiles: asStringArray(parsed.skippedFiles),
    };
  }
  throw new Error("Config format is invalid.");
}

/**
 * @typedef {{
 *   config: unknown;
 *   script: string;
 *   safeCommitHashes: string[];
 * }} SecretScanCache
 */

/** @returns {SecretScanCache | null} */
function loadCache() {
  return nullIfFileNotFound(() => {
    const parsed = parseJSONFromFile(CACHE_PATH);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "config" in parsed &&
      "script" in parsed &&
      typeof parsed.script === "string" &&
      "safeCommitHashes" in parsed
    ) {
      return {
        config: parsed.config,
        script: parsed.script,
        safeCommitHashes: asStringArray(parsed.safeCommitHashes),
      };
    } else {
      console.log("Cache format is invalid, so it will not be used.");
      return null;
    }
  });
}

/**
 * @param {SecretScanCache} cache
 * @returns {void}
 */
function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache), {
    encoding: JSON_ENCODING,
  });
}

function deleteReport() {
  if (fs.statSync(REPORT_PATH, { throwIfNoEntry: false })?.isFile()) {
    fs.unlinkSync(REPORT_PATH);
  }
}

/**
 * @typedef {{
 *   where: string;
 *   path: string;
 *   line: number;
 *   regexName: string;
 *   matchedText: string;
 * }[]} SecretScanReport
 */

/**
 * @param {SecretScanReport} report
 */
function saveReport(report) {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n", {
    encoding: JSON_ENCODING,
  });
}

/**
 * @param {readonly [string, ...string[]]} command
 * @returns {string}
 */
function runCommand(command) {
  const process = child_process.spawnSync(command[0], command.slice(1), {
    cwd: __dirname,
    encoding: "utf8",
    maxBuffer: Infinity,
  });

  if (process.status === 0) {
    return process.stdout;
  }

  console.log(process);
  throw new Error(
    `Command did not execute successfully: ${JSON.stringify(command)}`,
  );
}

/**
 * @param {string} text
 * @returns {string[]}
 */
function nonEmptyLines(text) {
  return text.split(EOL).filter((line) => line.length > 0);
}

/** @returns {void} */
function checkGitVersion() {
  const command = ["git", "--version"];

  let output;
  try {
    output = runCommand(["git", "--version"]);
  } catch (e) {
    console.log(e);
    const msg =
      "Could not run git from the command line. Make sure it is installed and on your PATH, and try again.";
    throw new Error(msg);
  }

  const expectedPrefix = "git version ";
  if (!output.startsWith(expectedPrefix)) {
    const msg = `Output of command ${JSON.stringify(
      command,
    )} did not start with expected prefix ${JSON.stringify(
      expectedPrefix,
    )}. Maybe the text encoding for child process output is not utf8 in this environment?`;
    throw new Error(msg);
  }
}

/** @returns {string} */
function getRepoRoot() {
  const repoRoot = runCommand(["git", "rev-parse", "--show-toplevel"]).replace(
    EOL,
    "",
  );

  // Make sure we don't get "file not found" later and assume the file was
  // deleted from the working tree, when the actual cause is having an incorrect
  // path for the repo root. Don't ask me how I know...
  if (
    !fs
      .statSync(path.join(repoRoot, ".git"), { throwIfNoEntry: false })
      ?.isDirectory()
  ) {
    throw new Error(
      `Could not determine repo root: got ${JSON.stringify(repoRoot)}, but this is incorrect?`,
    );
  }

  return repoRoot;
}

/** @returns {number} */
function checkGitHooks() {
  checkGitVersion();

  const expectedHooksPath = ".husky/_";
  const command = /** @type {const} */ ([
    "git",
    "config",
    "--get",
    "core.hooksPath",
  ]);
  const helpMsg = `Husky has not installed the required Git hooks. Run "npm run prepare" and try again.`;

  let hooksPath;
  try {
    hooksPath = runCommand(command).replace(EOL, "");
  } catch (e) {
    console.log(e);
    throw new Error(helpMsg);
  }

  if (hooksPath !== expectedHooksPath) {
    const msg = [
      `Command ${JSON.stringify(command)} returned ${JSON.stringify(
        hooksPath,
      )}, expected ${JSON.stringify(expectedHooksPath)}.`,
      helpMsg,
    ].join("\n\n");
    throw new Error(msg);
  }

  console.log(
    `Git hooks are correctly installed in ${JSON.stringify(expectedHooksPath)}.`,
  );
  return 0;
}

/** @returns {number} */
function runSecretScan() {
  const shouldSaveReport = process.env["SECRET_SCAN_WRITE_REPORT"] === "1";

  deleteReport();

  /**
   * @type {SecretScanReport}
   */
  const report = [];

  console.log(
    `${__filename}: Scanning commit history and working tree for secrets.`,
  );

  checkGitVersion();
  const repoRoot = getRepoRoot();

  const config = loadConfig();
  const script = fs.readFileSync(__filename, { encoding: "utf8" });

  let loadedCache = loadCache();
  if (loadedCache !== null) {
    if (JSON.stringify(config) !== JSON.stringify(loadedCache.config)) {
      console.log("Invalidating cache because config has changed.");
      loadedCache = null;
    } else if (script !== loadedCache.script) {
      console.log("Invalidating cache because script has changed.");
      loadedCache = null;
    }
  }

  /** @type {SecretScanCache} */
  const cache = loadedCache ?? {
    config: JSON.parse(JSON.stringify(config)),
    script,
    safeCommitHashes: [],
  };

  const previouslyScannedCommitHashes = new Set(cache.safeCommitHashes);
  const filesToSkip = new Set(config.skippedFiles);
  const secretRegexes = Object.fromEntries(
    Object.entries(config.secretRegexes).map(([k, v]) => [
      k,
      new RegExp(v, "g"),
    ]),
  );

  /** @param {string} matchedText */
  function isFalsePositive(matchedText) {
    return config.allowedStrings.some((allowed) =>
      matchedText.includes(allowed),
    );
  }

  /**
   * Scan the commit with the given hash, or null to scan the index and working
   * tree.
   *
   * @param {string | null} maybeCommitHash
   * @returns {void}
   */
  function scan(maybeCommitHash) {
    /** @type {{ path: string; where: string; contents: string; }[]} */
    const changedFiles = [];

    // Don't try to read deleted files. If you ever get an error message like
    // "unknown revision or path not in the working tree", double check this.
    const gitListFileOptions = [
      "--no-renames",
      "--diff-filter=d",
      "--name-only",
    ];

    if (maybeCommitHash === null) {
      const workingTreePaths = nonEmptyLines(
        runCommand(["git", "status", "--porcelain"]),
      ).map((line) => line.slice(3));
      for (const workingTreePath of workingTreePaths) {
        // If the file was deleted, we can ignore it. I was a bit too lazy to
        // parse the status letters of `git status --porcelain`.
        let contents = nullIfFileNotFound(() =>
          fs.readFileSync(path.join(repoRoot, workingTreePath), {
            encoding: "utf8",
          }),
        );

        if (contents !== null) {
          changedFiles.push({
            path: workingTreePath,
            where: "working tree",
            contents,
          });
        }
      }

      const stagedPaths = nonEmptyLines(
        runCommand(["git", "diff", "--staged", ...gitListFileOptions]),
      );
      for (const stagedPath of stagedPaths) {
        changedFiles.push({
          path: stagedPath,
          where: "index",
          contents: runCommand(["git", "show", ":" + stagedPath]),
        });
      }
    } else {
      const [commitDescription, ...changedPaths] = nonEmptyLines(
        runCommand([
          "git",
          "show",
          "--oneline",
          ...gitListFileOptions,
          maybeCommitHash,
        ]),
      );
      const where = `commit ${JSON.stringify(commitDescription)}`;
      for (const changedPath of changedPaths) {
        changedFiles.push({
          path: changedPath,
          where,
          contents: runCommand([
            "git",
            "show",
            `${maybeCommitHash}:${changedPath}`,
          ]),
        });
      }
    }

    let secretDetected = false;
    for (const { path, where, contents } of changedFiles) {
      if (filesToSkip.has(path)) {
        continue;
      }

      for (const [regexName, regex] of Object.entries(secretRegexes)) {
        for (const match of contents.matchAll(regex)) {
          const matchedText = match[0];
          if (isFalsePositive(matchedText)) {
            continue;
          }

          const line = contents.substring(0, match.index).split("\n").length;

          secretDetected = true;
          report.push({
            where,
            path,
            line,
            regexName,
            matchedText,
          });

          console.log(
            `SECRET DETECTED in ${where}, file ${JSON.stringify(
              path,
            )}, line ${line}: regex ${regexName} (${regex}) matched text ${JSON.stringify(
              matchedText,
            )}`,
          );
        }
      }
    }

    if (!secretDetected && maybeCommitHash !== null) {
      cache.safeCommitHashes.push(maybeCommitHash);
    }
  }

  // Scan every commit.
  const allCommitHashes = nonEmptyLines(
    runCommand(["git", "log", "--pretty=format:%H"]),
  );
  for (const hash of allCommitHashes) {
    if (!previouslyScannedCommitHashes.has(hash)) {
      scan(hash);
    }
  }

  // Scan the index and working tree.
  scan(null);

  if (shouldSaveReport) {
    saveReport(report);
    console.log(`Report written to ${JSON.stringify(REPORT_PATH)}`);
  }

  saveCache(cache);

  if (report.length > 0) {
    console.log(
      redText(`Secret scan completed with errors.\n\n${secretRemovalAdvice}\n`),
    );
    return 1;
  } else {
    console.log("Secret scan completed successfully.");
    return 0;
  }
}

/** @returns {number} */
function main() {
  let args = process.argv.slice(2);
  if (args[0] === "--") {
    args = args.slice(1);
  }

  switch (JSON.stringify(args)) {
    case JSON.stringify([]):
      return runSecretScan();
    case JSON.stringify(["--check-git-hooks"]):
      return checkGitHooks();
    default:
      const msg = `Invalid command-line arguments: ${JSON.stringify(args)}`;
      throw new Error(msg);
  }
}

process.exit(main());
