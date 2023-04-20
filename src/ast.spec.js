import AST from "./ast";

describe("AST", () => {
  it("throws an error when input is an empty string", () => {
    expect(() => AST.from("")).toThrow(
      "Invalid expression: expected literal or opening parenthesis"
    );
  });

  it("parses a simple logic string", () => {
    expect(AST.from("1")).toEqual({
      type: "literal",
      value: 1,
    });
  });
});
