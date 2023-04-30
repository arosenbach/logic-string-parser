import LogicalExpressionAST from "./logicalExpressionAST";

describe("LogicalExpressionAST - errors", () => {
  describe("from()", () => {
    it.each(["", "xxx", "1 AND ", "(   AND "])(
      "throws an error when input is an empty string",
      (expression) => {
        expression; //?
        expect(() => LogicalExpressionAST.from(expression)).toThrow(
          "Invalid expression: expected integer or opening parenthesis"
        );
      }
    );

    it("throws an error when input a closing parenthesis is missing", () => {
      expect(() => LogicalExpressionAST.from("(1 AND 2")).toThrow(
        "Invalid expression: missing closing parenthesis"
      );
    });
  });
});
