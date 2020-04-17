module.exports = (serverHelperConfig) => {
  console.log("hello, handler creation");
  return function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Hello, World!\n");
  };
};
