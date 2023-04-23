import LogicalExpressionAST from "./logicalExpressionAST";

describe("LogicalExpressionAST", () => {
  describe("from()", () => {
    it("throws an error when input is an empty string", () => {
      expect(() => LogicalExpressionAST.from("")).toThrow(
        "Invalid expression: expected literal or opening parenthesis"
      );
    });

    it("throws an error when input is invalid", () => {
      expect(() => LogicalExpressionAST.from("xxx")).toThrow(
        "Invalid expression: expected integer or opening parenthesis"
      );
    });

    it("parses a simple logic string", () => {
      expect(LogicalExpressionAST.from("1")).toEqual({
        type: "literal",
        value: 1,
      });
    });

    it("parses a simple AND logic string", () => {
      expect(LogicalExpressionAST.from("1 AND 2")).toEqual({
        type: "AND",
        left: {
          type: "literal",
          value: 1,
        },
        right: {
          type: "literal",
          value: 2,
        },
      });
    });

    it("parses a simple OR logic string", () => {
      expect(LogicalExpressionAST.from("1 OR 2")).toEqual({
        type: "OR",
        left: {
          type: "literal",
          value: 1,
        },
        right: {
          type: "literal",
          value: 2,
        },
      });
    });

    it("parses a simple logic string with parentheses", () => {
      expect(LogicalExpressionAST.from("(1 OR 2)")).toEqual({
        type: "OR",
        left: {
          type: "literal",
          value: 1,
        },
        right: {
          type: "literal",
          value: 2,
        },
      });
    });

    it("parses a logic string with multiple parentheses", () => {
      expect(LogicalExpressionAST.from("(1 AND 2) OR (2 AND 3)")).toEqual({
        type: "OR",
        left: {
          type: "AND",
          left: {
            type: "literal",
            value: 1,
          },
          right: {
            type: "literal",
            value: 2,
          },
        },
        right: {
          type: "AND",
          left: {
            type: "literal",
            value: 2,
          },
          right: {
            type: "literal",
            value: 3,
          },
        },
      });
    });
  });
});
