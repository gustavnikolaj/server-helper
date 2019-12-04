const parseCliOptions = require("../lib/parse-cli-options");
const expect = require("unexpected");

describe("parseCliOptions", () => {
  it("should be a function", () => {
    expect(parseCliOptions, "to be a function");
  });

  it("should throw with no args", () => {
    expect(() => parseCliOptions(), "to throw", "cwd must be a string");
  });

  it("should throw with one arg", () => {
    expect(() => parseCliOptions("/sadf"), "to throw", "argv must be an Array");
  });

  it("should return no options for no args", () => {
    expect(parseCliOptions("/foo", []), "to equal", {});
  });

  it("should take a watch flag", () => {
    expect(parseCliOptions("/foo", ["--watch"]), "to equal", { watch: true });
  });

  it("should take a w flag (shortform watch)", () => {
    expect(parseCliOptions("/foo", ["-w"]), "to equal", { watch: true });
  });

  it("should throw for a string watch flag", () => {
    expect(
      () => parseCliOptions("/foo", ["-w=foo"]),
      "to throw",
      "Unexpected value for --watch"
    );
  });

  it("should take a port flag", () => {
    expect(parseCliOptions("/foo", ["--port", "1000"]), "to equal", {
      port: 1000
    });
  });

  it("should take a p flag (shortform port)", () => {
    expect(parseCliOptions("/foo", ["-p", "1000"]), "to equal", {
      port: 1000
    });
  });

  it("should throw for a string port flag", () => {
    expect(
      () => parseCliOptions("/foo", ["-p=foo"]),
      "to throw",
      "Unexpected value for --port"
    );
  });

  it("should take a host flag", () => {
    expect(parseCliOptions("/foo", ["--host", "localhost"]), "to equal", {
      host: "localhost"
    });
  });

  it("should take a h flag (shortform port)", () => {
    expect(parseCliOptions("/foo", ["-h", "0.0.0.0"]), "to equal", {
      host: "0.0.0.0"
    });
  });

  it("should throw for a number host flag", () => {
    expect(
      () => parseCliOptions("/foo", ["-h", "123"]),
      "to throw",
      "Unexpected value for --host"
    );
  });

  it("should take a single extra arg as the entrypoint resolved to cwd", () => {
    expect(parseCliOptions("/foo", ["bar"]), "to equal", {
      entrypoint: "/foo/bar"
    });
  });

  it("should handle all at the same time", () => {
    expect(
      parseCliOptions("/foo", ["-h", "0.0.0.0", "-p", "3000", "bar", "-w"]),
      "to equal",
      {
        port: 3000,
        host: "0.0.0.0",
        watch: true,
        entrypoint: "/foo/bar"
      }
    );
  });

  // TODO: Watch breaks if before _ args
});
