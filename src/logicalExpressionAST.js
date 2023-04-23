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
}

class BinaryOperatorNode extends ASTNode {
  constructor(type, left, right) {
    super(type);
    this.left = left;
    this.right = right;
  }
}

class AndNode extends BinaryOperatorNode {
  constructor(left, right) {
    super("AND", left, right);
  }
}

const removeAllSpaceCharacters = (str) => str.replace(/\s+/g, "");

const parseParentheses = (expression) => {
  const { node, rest } = parse(expression);
  if (!rest.startsWith(")")) {
    throw new Error("Invalid expression: missing closing parenthesis");
  }
  return { node, rest: rest.slice(1) };
};

const startWithInteger = (str) => str.match(/^\d/);

const parseLiteral = (expression) => {
  const match = expression.match(/^(\d+)(.*)$/);
  return match
    ? { node: new LiteralNode(parseInt(match[1])), rest: match[2] }
    : { node: undefined, rest: expression };
};

function parse(expression) {
  if (!(expression.startsWith("(") || startWithInteger(expression))) {
    throw new Error(
      "Invalid expression: expected literal or opening parenthesis"
    );
  }
  // let node;

  // if (expression.startsWith("(")) {
  //   const { parenthesesNode, rest } = parseParentheses(expression.slice(1));
  //   node = parenthesesNode;
  //   expression = rest;
  // } else {
  //   // Expression littérale : analyser un entier
  const { node, rest } = parseLiteral(expression);

  // }

  if (rest.startsWith("AND")) {
    return new AndNode(node, parse(rest.slice(3)));
  }

  // if (expression.startsWith("OR")) {
  //   const right = parse(expression.slice(2));
  //   return new OrNode(
  //     node,
  //     right instanceof AndNode ? new AndNode(right.left, right.right) : right
  //   );
  // }

  return node;
}

export default class LogicalExpressionAST {
  static from(expression) {
    expression = removeAllSpaceCharacters(expression);
    if (expression.length < 1) {
      throw new Error(
        "Invalid expression: expected literal or opening parenthesis"
      );
    }
    // return new LiteralNode(parseInt(expression));
    return parse(expression);
  }
}
