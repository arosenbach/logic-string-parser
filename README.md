# logical-expression-parser

## from()

Use `LogicalExpressionAST.from()` to convert a logical expression to an Abstract Syntax Tree (a.k.a AST)
Sample usage:
`LogicalExpressionAST.from("((1 OR 3) AND 2) OR ((1 OR 3) AND 4)")`

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
            type: "OR",
            left: { type: "literal", value: 1 },
            right: { type: "literal", value: 3 },
        },
        right: { type: "literal", value: 4 },
    }
}
```

Node types:

- `literal`
- `AND`
- `OR`

Limitations:

- `NO` operator is not supported
- `AND` operator does not have a higher precedence
- n-ary operators are parsed as a set of binary operators. `OR` and `AND` are always considered binary operators, eg: `1 OR 2 OR 3` won't be parsed as a ternary operator, but as two binary operators: `(1 OR 2) OR 3`

## evaluate()

The `evaluate()` method takes a config as a parameter. This config specifies how are `AND` and `OR` operators translated.
The `evaluate()` method returns a function that takes an array as paramter.
The elements of the array are the values that replaces the integers in the logical expression.

Example:

```javascript
const config = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
};
LogicalExpressionAST.from("1 AND (2 OR 3)").evaluate(config)([
  true, // 1
  false, // 2
  false, // 3
]); // false
```
