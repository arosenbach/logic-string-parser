# logical-expression-parser

## LogicalExpressionParser

`LogicalExpressionParser` constructor takes a config as an argument.
This config specifies how `AND`, `OR` and `NOT` operators should be translated.
The `parse()` method returns a function that takes an array as an argument.
The elements of the array are the values that replace the integers in the logical expression.

Example:

```javascript
const config = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  NOT: (a) => !a,
};
const parser = new LogicalExpressionParser(config);
const evaluate = parser.parse("1 AND (2 OR NOT 3)")([
  true, // 1
  false, // 2
  false, // 3
]); // true
```

## LogicalExpressionAST

Use `LogicalExpressionAST.from()` to convert a logical expression to an Abstract Syntax Tree (a.k.a AST)
Sample usage:
`LogicalExpressionAST.from("((1 OR 3) AND 2) OR (NOT(1 OR 3) AND 4)")`

Returns the following AST:

```javascript
{
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
            type: "NOT",
            value: {
                type: "OR",
                left: { type: "literal", value: 1 },
                right: { type: "literal", value: 3 },
            }
        },
        right: { type: "literal", value: 4 },
    }
}
```

Node types:

- `literal`
- `AND`
- `OR`
- `NOT`

`AND` has a higher precedence than `OR` (eg: `1 OR 2 AND 3` is similar to `1 OR (2 AND 3)`)

Limitations:

- n-ary operators are parsed as a set of binary operators. `OR` and `AND` are always considered binary operators, eg: `1 OR 2 OR 3` won't be parsed as a ternary operator, but as two binary operators: `(1 OR 2) OR 3`
