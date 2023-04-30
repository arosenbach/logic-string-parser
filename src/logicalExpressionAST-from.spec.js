import LogicalExpressionAST from "./logicalExpressionAST";

describe("LogicalExpressionAST - from()", () => {
  it("parses a simple logical expression", () => {
    expect(LogicalExpressionAST.from("1")).toEqual({
      type: "literal",
      value: 1,
    });
  });

  it("parses a simple AND logical expression", () => {
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

  it("parses a simple OR logical expression", () => {
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

  it("parses multiple OR", () => {
    expect(LogicalExpressionAST.from("1 OR 2 OR 3")).toEqual({
      type: "OR",
      left: { type: "literal", value: 1 },
      right: {
        left: { type: "literal", value: 2 },
        right: { type: "literal", value: 3 },
        type: "OR",
      },
    });
  });

  it("parses a simple logical expression with parentheses", () => {
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

  it("parses a logical expression with multiple parentheses", () => {
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

  it("parses a logical expression with nested parentheses", () => {
    expect(
      LogicalExpressionAST.from("((1 OR 3) AND 2) OR ((1 OR 3) AND 4)")
    ).toEqual({
      type: "OR",
      left: {
        type: "AND",
        left: {
          type: "OR",
          left: { type: "literal", value: 1 },
          right: { type: "literal", value: 3 },
        },
        right: { type: "literal", value: 2 },
      },
      right: {
        type: "AND",
        left: {
          type: "OR",
          left: { type: "literal", value: 1 },
          right: { type: "literal", value: 3 },
        },
        right: { type: "literal", value: 4 },
      },
    });
  });

  it.each([
    ["1 OR 2 AND 3", "1 OR (2 AND 3)"],
    ["1 AND 2 OR 3", "(1 AND 2) OR 3"],
    ["1 AND 2 OR 3 AND 4", "(1 AND 2) OR (3 AND 4)"],
    ["1 OR 2 AND 3 OR 4", "1 OR ((2 AND 3) OR 4)"],
    ["1 OR 2 AND 3 AND 4", "(1 OR (2 AND (3 AND 4)))"],
  ])("applies AND before OR", (a, b) => {
    expect(LogicalExpressionAST.from(a)).toEqual(LogicalExpressionAST.from(b));
  });
});
