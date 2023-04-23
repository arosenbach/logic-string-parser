import LogicalExpressionAST from "./logicalExpressionAST";
import { WhereClause } from "./whereClause";

describe("LogicalExpressionAST - evaluate()", () => {
  const A = WhereClause.eq("Name", "Acme");
  const B = WhereClause.eq("Phone", "555-2368");
  const C = WhereClause.lt("Age", 42);
  const D = WhereClause.like("ParentId.Name", "Glob%");

  const toWhereClause = {
    AND: WhereClause.and,
    OR: WhereClause.or,
  };

  it.each([
    ["1", [A], A],
    [" 1  AND  2 ", [A, B], WhereClause.and(A, B)],
    [" 1  OR  2 ", [A, B], WhereClause.or(A, B)],
    ["( 1 AND  2) OR 3 ", [A, B, C], WhereClause.or(WhereClause.and(A, B), C)],
    ["1 AND  2 AND 3 ", [A, B, C], WhereClause.and(A, WhereClause.and(B, C))],
    ["1 OR  2 OR 3 ", [A, B, C], WhereClause.or(A, WhereClause.or(B, C))],
    [
      "((1 OR 3) AND 2) OR ((1 OR 3) AND 4)",
      [A, B, C, D],
      WhereClause.or(
        WhereClause.and(WhereClause.or(A, C), B),
        WhereClause.and(WhereClause.or(A, C), D)
      ),
    ],
  ])("evaluates", (logicalExpression, clauses, expected) => {
    expect(
      LogicalExpressionAST.from(logicalExpression).evaluate(toWhereClause)(
        clauses
      )
    ).toEqual(expected);
  });
});
