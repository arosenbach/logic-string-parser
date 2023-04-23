# logical-expression-parser


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
