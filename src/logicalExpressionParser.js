import LogicalExpressionAST from "./logicalExpressionAST";

const evaluate = (config, node) => {
  if (node.type === "literal") {
    return (args) => {
      if (args.length < node.value) {
        throw new Error(
          `Bad number of arguments. Operand # "${node.value}" has not been provided.`
        );
      }
      return args[node.value - 1];
    };
  }

  if (node.type === "NOT") {
    return (args) => config["NOT"](evaluate(config, node.value)(args));
  }

  if (typeof config[node.type] !== "function") {
    throw new Error(
      `Missing configuration. Unable to evaluate '${node.type}'.`
    );
  }

  return (args) =>
    config[node.type](
      evaluate(config, node.left)(args),
      evaluate(config, node.right)(args)
    );
};

export default class LogicalExpressionParser {
  constructor(config) {
    if (!config || typeof config !== "object") {
      throw new Error(`Invalid configuration: ${JSON.stringify(config)}`);
    }
    this.config = config;
  }

  parse(logicalExpression) {
    return evaluate(this.config, LogicalExpressionAST.from(logicalExpression));
  }
}
