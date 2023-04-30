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

  // Apply a left rotation of an AND-tree when the right child node is a OR-tree
  //   AND               OR
  //  /  \              /  \
  // A   OR     to    AND   C
  //    /   \        /  \
  //   B     C      A    B
  applyPriority() {
    return this.right instanceof OrNode
      ? new OrNode(new AndNode(this.left, this.right.left), this.right.right)
      : this;
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
      node: new AndNode(result.node, right.node).applyPriority(),
      rest: right.rest,
    };
  }

  if (result.rest.startsWith("OR")) {
    const right = parse(result.rest.slice(2));
    return {
      node: new OrNode(result.node, right.node),
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
