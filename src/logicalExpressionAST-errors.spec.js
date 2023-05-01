import LogicalExpressionAST from "./logicalExpressionAST";

describe("LogicalExpressionAST - errors", () => {
  describe("from()", () => {
    it.each([undefined, "", "xxx", "1 AND ", "(   AND "])(
      "throws an error when input is an empty string",
      (expression) => {
        expect(() => LogicalExpressionAST.from(expression)).toThrow(
          "Invalid expression"
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
