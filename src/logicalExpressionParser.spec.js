import LogicalExpressionParser from "./logicalExpressionParser";
import WhereClause from "./whereClause";

describe("LogicalExpressionParser", () => {
  const A = WhereClause.eq("Name", "Acme");
  const B = WhereClause.eq("Phone", "555-2368");
  const C = WhereClause.lt("Age", 42);
  const D = WhereClause.like("ParentId.Name", "Glob%");

  const config = {
    AND: WhereClause.and,
    OR: WhereClause.or,
  };

  it.each([
    ["1", [A], A],
    [" 1  AND  2 ", [A, B], WhereClause.and(A, B)],
    [" 1  OR  2 ", [A, B], WhereClause.or(A, B)],
    ["( 1 AND  2) OR 3 ", [A, B, C], WhereClause.or(WhereClause.and(A, B), C)],
    ["1 AND  2 AND 3 ", [A, B, C], WhereClause.and(WhereClause.and(A, B), C)],
    ["1 OR  2 OR 3 ", [A, B, C], WhereClause.or(WhereClause.or(A, B), C)],
    [
      "((1 OR 3) AND 2) OR ((1 OR 3) AND 4)",
      [A, B, C, D],
      WhereClause.or(
        WhereClause.and(WhereClause.or(A, C), B),
        WhereClause.and(WhereClause.or(A, C), D)
      ),
    ],
  ])("parses a logical expression", (logicalExpression, clauses, expected) => {
    const sut = new LogicalExpressionParser(config);
    expect(sut.parse(logicalExpression)(clauses)).toEqual(expected);
  });

  it.each([[undefined], [""]])(
    "throws an error when `config` argument is invalid",
    (config) => {
      expect(() => new LogicalExpressionParser(config)).toThrow(
        "Invalid configuration"
      );
    }
  );

  it.each([
    [{}],
    [{ AND: "and" }],
    [{ AND: (a, b) => `${a} + ${b}`, OR: "or" }],
  ])(
    "throws an error when `config` argument is missing operators",
    (config) => {
      const sut = new LogicalExpressionParser(config);
      expect(() => sut.parse("1 AND 2 OR 3")).toThrow(
        "Missing configuration. Unable to evaluate "
      );
    }
  );

  it.each([
    ["1", []],
    [" 1  AND  2 ", [A]],
    [" 1  OR  2 ", [A]],
    ["( 1 AND  2) OR 3 ", [A, B]],
    ["1 AND  2 AND 3 ", [A, B]],
    ["1 OR  2 OR 3 ", [A, B]],
    ["((1 OR 3) AND 2) OR ((1 OR 3) AND 4)", [A, B, C]],
  ])("parses a logical expression", (logicalExpression, clauses) => {
    const sut = new LogicalExpressionParser(config);
    expect(() => sut.parse(logicalExpression)(clauses)).toThrow(
      "Bad number of arguments."
    );
  });
});
