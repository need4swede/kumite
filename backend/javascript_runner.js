#!/usr/bin/env node

/**
 * Minimal test runner that supports a Jest-flavoured API (`describe`, `test`,
 * `expect`) so JavaScript challenges can execute without pulling in a full Jest
 * dependency tree. The behaviour it implements is intentionally small and only
 * covers the matchers currently required by the bundled challenge test suites.
 */

const path = require("path");
const { inspect, isDeepStrictEqual } = require("util");

const testFile = process.argv[2];

if (!testFile) {
  console.error("Usage: node javascript_runner.js <test-file>");
  process.exitCode = 1;
  process.exit();
}

const suiteStack = [];
const tests = [];
const beforeEachHooks = [];
const afterEachHooks = [];

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

const formatValue = (value) =>
  inspect(value, { depth: null, colors: false, compact: false });

const runHooks = async (hooks) => {
  for (const hook of hooks) {
    try {
      await hook();
    } catch (error) {
      throw error;
    }
  }
};

global.describe = (name, fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("describe callback must be a function");
  }
  suiteStack.push(String(name));
  try {
    fn();
  } finally {
    suiteStack.pop();
  }
};

global.test = (name, fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("test callback must be a function");
  }
  const fullName = [...suiteStack, String(name)].join(" › ");
  tests.push(async () => {
    try {
      await runHooks(beforeEachHooks);
      await fn();
      await runHooks(afterEachHooks);
      return { status: "passed", name: fullName };
    } catch (error) {
      try {
        await runHooks(afterEachHooks);
      } catch (hookError) {
        error = hookError;
      }
      return { status: "failed", name: fullName, error };
    }
  });
};

global.beforeEach = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("beforeEach callback must be a function");
  }
  beforeEachHooks.push(fn);
};

global.afterEach = (fn) => {
  if (typeof fn !== "function") {
    throw new TypeError("afterEach callback must be a function");
  }
  afterEachHooks.push(fn);
};

const buildNotMatchers = (received) => ({
  toBe(expected) {
    if (Object.is(received, expected)) {
      throw new AssertionError(
        `Expected ${formatValue(received)} not to be ${formatValue(expected)}`
      );
    }
  },
  toEqual(expected) {
    if (isDeepStrictEqual(received, expected)) {
      throw new AssertionError(
        `Expected ${formatValue(received)} not to equal ${formatValue(expected)}`
      );
    }
  },
});

global.expect = (received) => {
  const matchers = {
    toBe(expected) {
      if (!Object.is(received, expected)) {
        throw new AssertionError(
          `Expected ${formatValue(received)} to be ${formatValue(expected)}`
        );
      }
    },
    toEqual(expected) {
      if (!isDeepStrictEqual(received, expected)) {
        throw new AssertionError(
          `Expected ${formatValue(received)} to equal ${formatValue(expected)}`
        );
      }
    },
    toBeTruthy() {
      if (!received) {
        throw new AssertionError(`Expected ${formatValue(received)} to be truthy`);
      }
    },
    toBeFalsy() {
      if (received) {
        throw new AssertionError(`Expected ${formatValue(received)} to be falsy`);
      }
    },
    toBeNull() {
      if (received !== null) {
        throw new AssertionError(`Expected ${formatValue(received)} to be null`);
      }
    },
    toBeUndefined() {
      if (received !== undefined) {
        throw new AssertionError(`Expected ${formatValue(received)} to be undefined`);
      }
    },
    toThrow(expectedError) {
      if (typeof received !== "function") {
        throw new AssertionError("Received value must be a function to use toThrow");
      }
      let threw = false;
      let thrown;
      try {
        received();
      } catch (error) {
        threw = true;
        thrown = error;
      }
      if (!threw) {
        throw new AssertionError("Expected function to throw an error");
      }
      if (expectedError instanceof RegExp) {
        if (!expectedError.test(String(thrown))) {
          throw new AssertionError(
            `Expected error message to match ${expectedError}, but received ${formatValue(
              thrown
            )}`
          );
        }
      } else if (
        typeof expectedError === "function" &&
        !(thrown instanceof expectedError)
      ) {
        throw new AssertionError(
          `Expected thrown error to be instance of ${expectedError.name}`
        );
      }
    },
  };

  matchers.not = buildNotMatchers(received);
  return matchers;
};

(async () => {
  try {
    const target = path.resolve(process.cwd(), testFile);
    // Ensure relative imports inside the test file resolve correctly.
    require(target);

    if (tests.length === 0) {
      console.warn("No tests were registered.");
      return;
    }

    let passed = 0;
    let failed = 0;

    for (const run of tests) {
      const result = await run();
      if (result.status === "passed") {
        passed += 1;
        console.log(`✓ ${result.name}`);
      } else {
        failed += 1;
        console.log(`✗ ${result.name}`);
        if (result.error?.stack) {
          console.log(result.error.stack);
        } else if (result.error) {
          console.log(String(result.error));
        }
      }
    }

    const total = passed + failed;
    console.log("");
    console.log(`${passed} passed, ${failed} failed, ${total} total`);

    process.exitCode = failed > 0 ? 1 : 0;
  } catch (error) {
    console.error(error.stack || String(error));
    process.exitCode = 1;
  }
})();

