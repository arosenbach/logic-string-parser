
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
    return new LiteralNode(parseInt(logicString));
  }
}
