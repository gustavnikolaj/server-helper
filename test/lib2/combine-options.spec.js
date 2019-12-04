const combineOptions = require("../../lib2/combine-options");
const expect = require("unexpected");

describe("combineOptions", () => {
  it("should be a function", () => {
    expect(combineOptions, "to be a function");
  });

  it("should return defaults when not given any arguments", () => {
    expect(combineOptions(), "to equal", {
      port: 3000,
      watch: false
    });
  });

  it("should prefer api options over defaults", () => {
    // defaults
    expect(combineOptions(), "to equal", {
      port: 3000,
      watch: false
    });
    expect(
      combineOptions({
        api: { port: 3001, watch: true }
      }),
      "to equal",
      { port: 3001, watch: true }
    );
  });

  it("should allow setting port, host, watch and entrypoint from api", () => {
    expect(
      combineOptions({
        api: { port: 3001, watch: true, host: "foo.com", entrypoint: "foo.js" }
      }),
      "to equal",
      { port: 3001, watch: true, host: "foo.com", entrypoint: "foo.js" }
    );
  });

  it("should allow setting port, host, watch and entrypoint from cli", () => {
    expect(
      combineOptions({
        cli: { port: 3001, watch: true, host: "foo.com", entrypoint: "foo.js" }
      }),
      "to equal",
      { port: 3001, watch: true, host: "foo.com", entrypoint: "foo.js" }
    );
  });

  it("should allow setting port, host, watch and entrypoint from env", () => {
    expect(
      combineOptions({
        env: { port: 3001, host: "foo.com" }
      }),
      "to equal",
      { port: 3001, host: "foo.com", watch: false }
    );
  });

  it("should prefer cli port over env and api", () => {
    expect(
      combineOptions({
        api: { port: 3001 },
        cli: { port: 3002 },
        env: { port: 3003 }
      }),
      "to satisfy",
      { port: 3002 }
    );
  });

  it("should prefer env port over api", () => {
    expect(
      combineOptions({
        api: { port: 3001 },
        env: { port: 3003 }
      }),
      "to satisfy",
      { port: 3003 }
    );
  });

  it("should prefer api port over default", () => {
    expect(
      combineOptions({
        api: { port: 3001 }
      }),
      "to satisfy",
      { port: 3001 }
    );
  });

  it("should prefer cli host over env and api", () => {
    expect(
      combineOptions({
        api: { host: "api.com" },
        cli: { host: "cli.com" },
        env: { host: "env.com" }
      }),
      "to satisfy",
      { host: "cli.com" }
    );
  });

  it("should prefer env host over api", () => {
    expect(
      combineOptions({
        api: { host: "api.com" },
        env: { host: "env.com" }
      }),
      "to satisfy",
      { host: "env.com" }
    );
  });

  it("should use api host over default", () => {
    expect(
      combineOptions({
        api: { host: "api.com" }
      }),
      "to satisfy",
      { host: "api.com" }
    );
  });

  it("should prefer cli watch over api", () => {
    expect(
      combineOptions({
        api: { watch: "apifalse" },
        cli: { watch: "clitrue" }
      }),
      "to satisfy",
      { watch: "clitrue" }
    );
  });

  it("should use api watch", () => {
    expect(
      combineOptions({
        api: { watch: "apitrue" }
      }),
      "to satisfy",
      { watch: "apitrue" }
    );
  });

  it("should prefer cli entrypoint over api", () => {
    expect(
      combineOptions({
        api: { entrypoint: "api-entrypoint" },
        cli: { entrypoint: "cli-entrypoint" }
      }),
      "to satisfy",
      { entrypoint: "cli-entrypoint" }
    );
  });

  it("should use api entrypoint", () => {
    expect(
      combineOptions({
        api: { entrypoint: "api-entrypoint" }
      }),
      "to satisfy",
      { entrypoint: "api-entrypoint" }
    );
  });

  it("should resolve correctly with a life-like example", () => {
    expect(
      combineOptions({
        env: {
          port: 39492,
          host: "service.one.com"
        },
        api: { port: 3000, entrypoint: "main.js" }
      }),
      "to equal",
      {
        port: 39492,
        host: "service.one.com",
        entrypoint: "main.js",
        watch: false
      }
    );
  });

  it("should resolve correctly with a life-like example 2", () => {
    expect(
      combineOptions({
        cli: { watch: true, entrypoint: "main2.js" },
        api: { port: 3000, entrypoint: "main.js" }
      }),
      "to equal",
      {
        port: 3000,
        entrypoint: "main2.js",
        watch: true
      }
    );
  });
});
