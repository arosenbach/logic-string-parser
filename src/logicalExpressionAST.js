class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

class LiteralNode extends ASTNode {
  constructor(value) {
    super("literal");
    this.value = value;
  }

  evaluate() {
    return (args) => args[this.value - 1];
  }
}

class BinaryOperatorNode extends ASTNode {
  constructor(type, left, right) {
    super(type);
    this.left = left;
    this.right = right;
  }

  evaluate(config) {
    if (!config || typeof config[this.type] !== "function") {
      throw new Error(
        `Missing configuration. Unable to evaluate '${this.type}'.`
      );
    }
    return (args) =>
      config[this.type](
        this.left.evaluate(config)(args),
        this.right.evaluate(config)(args)
      );
  }
}

class GroupNode extends BinaryOperatorNode {
  constructor(node) {
    super(node.type, node.left, node.right);
  }
}

class AndNode extends BinaryOperatorNode {
  constructor(left, right) {
    super("AND", left, right);
  }
}

class OrNode extends BinaryOperatorNode {
  constructor(left, right) {
    super("OR", left, right);
  }
}

const removeAllSpaceCharacters = (str) => str.replace(/\s+/g, "");

const parseParentheses = (expression) => {
  const { node, rest } = parse(expression);
  if (!rest.startsWith(")")) {
    throw new Error("Invalid expression: missing closing parenthesis");
  }
  return { node: new GroupNode(node), rest: rest.slice(1) };
};

const parseLiteral = (expression) => {
  const match = expression.match(/^(\d+)(.*)$/);
  return { node: new LiteralNode(parseInt(match[1])), rest: match[2] };
};

const startsWithInteger = (str) => str.match(/^\d/);

const newBinaryNodeFromType = (type) => (left, right) => {
  switch (type) {
    case "AND":
      return new AndNode(left, right);
    case "OR":
      return new OrNode(left, right);
    default:
      throw new Error(`Invalid binary node type: ${type}`);
  }
};

// Apply a left rotation of a binary tree, eg:
//   AND               OR
//  /  \              /  \
// A   OR     to    AND   C
//    /   \        /  \
//   B     C      A    B
const rotateLeft = (node) =>
  newBinaryNodeFromType(node.right.type)(
    newBinaryNodeFromType(node.type)(node.left, node.right.left),
    node.right.right
  );

const rotateLeftIf = (predicate) => (node) =>
  predicate(node) ? rotateLeft(node) : node;

const righChildHasSameType = (node) => node.type === node.right.type;

const righChildIsTypeOr = (node) => node.right instanceof OrNode;

const or =
  (...predicates) =>
  (x) =>
    predicates.reduce((acc, curr) => acc || curr(x), false);

function parse(expression) {
  if (!(expression.startsWith("(") || startsWithInteger(expression))) {
    throw new Error(
      "Invalid expression: expected integer or opening parenthesis"
    );
  }

  const result = expression.startsWith("(")
    ? parseParentheses(expression.slice(1))
    : parseLiteral(expression);

  if (result.rest.startsWith("AND")) {
    const right = parse(result.rest.slice(3));
    return {
      node: rotateLeftIf(or(righChildHasSameType, righChildIsTypeOr))(
        new AndNode(result.node, right.node)
      ),
      rest: right.rest,
    };
  }

  if (result.rest.startsWith("OR")) {
    const right = parse(result.rest.slice(2));
    return {
      node: rotateLeftIf(righChildHasSameType)(
        new OrNode(result.node, right.node)
      ),
      rest: right.rest,
    };
  }

  return result;
}

export default class LogicalExpressionAST {
  static from(expression) {
    const result = parse(removeAllSpaceCharacters(expression));
    if (result.rest.length > 0) {
      throw new Error(
        "Invalid expression: unexpected characters at end of string"
      );
    }
    return result.node;
  }
}
