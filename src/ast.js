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

export default class AST {
  static from(logicString) {
    if (logicString.length < 1) {
      throw new Error(
        "Invalid expression: expected literal or opening parenthesis"
      );
    }
    return new LiteralNode(parseInt(logicString));
  }
}
