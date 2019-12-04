const validateOptions = require("../lib/validate-options");
const expect = require("unexpected");

describe("validateOptions", () => {
  it("should be a function", () => {
    expect(validateOptions, "to be a function");
  });

  it("should throw if not passed any arguments", () => {
    expect(() => validateOptions(), "to throw", "options must be an object");
  });

  it("should throw if not passed an option argument", () => {
    expect(
      () => validateOptions(true),
      "to throw",
      "options must be an object"
    );
  });

  it("should throw if not passed an entrypoint", () => {
    expect(() => validateOptions({}), "to throw", "No entrypoint script");
  });

  it("should throw if passed a non-string entrypoint", () => {
    expect(
      () =>
        validateOptions({
          entrypoint: null
        }),
      "to throw",
      "entrypoint must be a string"
    );
  });

  it("should throw if not passed a port", () => {
    expect(
      () =>
        validateOptions({
          entrypoint: "foo"
        }),
      "to throw",
      "No port option given"
    );
  });

  it("should allow not passing a host", () => {
    const options = {
      entrypoint: "foo",
      port: 3000
    };

    expect(validateOptions(options), "to equal", options);
  });

  it("should throw if passed a non-string host", () => {
    expect(
      () =>
        validateOptions({
          entrypoint: "foo",
          port: 3000,
          host: 3000
        }),
      "to throw",
      "host must be a string"
    );
  });

  it("should allow not passing a value for watch", () => {
    const options = {
      entrypoint: "foo",
      port: 3000
    };

    expect(validateOptions(options), "to equal", options);
  });

  it("should throw if passed a non-boolean watch value", () => {
    expect(
      () =>
        validateOptions({
          entrypoint: "foo",
          port: 3000,
          watch: 1
        }),
      "to throw",
      "watch must be boolean"
    );
  });
});
