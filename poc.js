// ----------------------------------------------------------------
// AST BUILDER -v1 no class, no inner parentheses, no precedence

// function parseExpression(expression) {
//     // Supprimer les espaces blancs et les parenthèses inutiles
//     expression = expression.replace(/\s+/g, '');
//     while (expression[0] === '(' && expression[expression.length - 1] === ')') {
//       let parenCount = 0;
//       for (let i = 0; i < expression.length - 1; i++) {
//         if (expression[i] === '(') {
//           parenCount++;
//         } else if (expression[i] === ')') {
//           parenCount--;
//         }
//         if (parenCount === 0 && i === expression.length - 2) {
//           expression = expression.slice(1, -1);
//           break;
//         } else if (parenCount < 0) {
//           throw new Error('Invalid expression: unbalanced parentheses');
//         }
//       }
//     }

//     // Fonction récursive pour analyser l'expression
//     function parse() {
//       let node;
//       if (expression[0] === '(') {
//         expression = expression.slice(1);
//         node = parse();
//         if (expression[0] !== ')') {
//           throw new Error('Invalid expression: missing closing parenthesis');
//         }
//         expression = expression.slice(1);
//       } else {
//         const match = expression.match(/^(\d+)(.*)$/);
//         if (match) {
//           node = { type: 'literal', value: parseInt(match[1]) };
//           expression = match[2];
//         } else {
//           throw new Error('Invalid expression: expected literal or opening parenthesis');
//         }
//       }

//       if (expression[0] === 'A' && expression[1] === 'N' && expression[2] === 'D') {
//         expression = expression.slice(3);
//         node = { type: 'AND', left: node, right: parse() };
//       } else if (expression[0] === 'O' && expression[1] === 'R') {
//         expression = expression.slice(2);
//         node = { type: 'OR', left: node, right: parse() };
//       }

//       return node;
//     }

//     // Analyser l'expression à partir du début
//     const ast = parse();

//     // Vérifier que toute la chaîne a été analysée
//     if (expression.length > 0) {
//       throw new Error('Invalid expression: unexpected characters at end of string');
//     }

//     return ast;
//   }

// ----------------------------------------------------------------

// ===================================================================
// AST Builder v2 - avec parentheses imbriquees
// class ASTNode {
//     constructor(type) {
//       this.type = type;
//     }
//   }

//   class LiteralNode extends ASTNode {
//     constructor(value) {
//       super('literal');
//       this.value = value;
//     }
//   }

//   class BinaryOperatorNode extends ASTNode {
//     constructor(type, left, right) {
//       super(type);
//       this.left = left;
//       this.right = right;
//     }
//   }

//   class AndNode extends BinaryOperatorNode {
//     constructor(left, right) {
//       super('AND', left, right);
//     }
//   }

//   class OrNode extends BinaryOperatorNode {
//     constructor(left, right) {
//       super('OR', left, right);
//     }
//   }

//   function parseExpression(expression) {
//     // Supprimer les espaces blancs
//     expression = expression.replace(/\s+/g, '');

//     // Fonction récursive pour analyser l'expression
//     function parse() {
//       let node;

//       if (expression[0] === '(') {
//         // Expression parenthésée : analyser le contenu entre parenthèses
//         expression = expression.slice(1);
//         node = parse();
//         if (expression[0] !== ')') {
//           throw new Error('Invalid expression: missing closing parenthesis');
//         }
//         expression = expression.slice(1);
//       } else {
//         // Expression littérale : analyser un entier
//         const match = expression.match(/^(\d+)(.*)$/);
//         if (match) {
//           node = new LiteralNode(parseInt(match[1]));
//           expression = match[2];
//         } else {
//           throw new Error('Invalid expression: expected literal or opening parenthesis');
//         }
//       }

//       // Rechercher les opérateurs à partir de la position actuelle dans la chaîne
//       while (expression[0] === 'A' && expression[1] === 'N' && expression[2] === 'D') {
//         // Expression AND : créer un nouveau nœud de type AndNode
//         expression = expression.slice(3);
//         node = new AndNode(node, parse());
//       }

//       while (expression[0] === 'O' && expression[1] === 'R') {
//         // Expression OR : créer un nouveau nœud de type OrNode
//         expression = expression.slice(2);
//         node = new OrNode(node, parse());
//       }

//       return node;
//     }

//     // Analyser l'expression à partir du début
//     const ast = parse();

//     // Vérifier que toute la chaîne a été analysée
//     if (expression.length > 0) {
//       throw new Error('Invalid expression: unexpected characters at end of string');
//     }

//     return ast;
//   }

// =================================================================
// AST v3 precedence de AND

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

class OrNode extends BinaryOperatorNode {
  constructor(left, right) {
    super("OR", left, right);
  }
}

function parseExpression(expression) {
  // Supprimer les espaces blancs
  expression = expression.replace(/\s+/g, "");

  // Fonction récursive pour analyser l'expression
  function parse() {
    let node;

    if (expression[0] === "(") {
      // Expression parenthésée : analyser le contenu entre parenthèses
      expression = expression.slice(1);
      node = parse();
      if (expression[0] !== ")") {
        throw new Error("Invalid expression: missing closing parenthesis");
      }
      expression = expression.slice(1);
    } else {
      // Expression littérale : analyser un entier
      const match = expression.match(/^(\d+)(.*)$/);
      if (match) {
        node = new LiteralNode(parseInt(match[1]));
        expression = match[2];
      } else {
        throw new Error(
          "Invalid expression: expected literal or opening parenthesis"
        );
      }
    }

    // Rechercher les opérateurs AND à partir de la position actuelle dans la chaîne
    while (
      expression[0] === "A" &&
      expression[1] === "N" &&
      expression[2] === "D"
    ) {
      // Expression AND : créer un nouveau nœud de type AndNode et imbriquer les nœuds
      expression = expression.slice(3);
      node = new AndNode(node, parse());
    }

    // Rechercher les opérateurs OR à partir de la position actuelle dans la chaîne
    if (expression[0] === "O" && expression[1] === "R") {
      // Expression OR : créer un nouveau nœud de type OrNode et imbriquer les nœuds
      expression = expression.slice(2);
      const right = parse();
      if (right instanceof AndNode) {
        // Le nœud de droite est une opération AND : imbriquer les nœuds
        node = new OrNode(node, new AndNode(right.left, right.right));
      } else {
        // Le nœud de droite est une expression littérale : créer le nœud OrNode
        node = new OrNode(node, right);
      }
    }

    return node;
  }
  // Analyser l'expression à partir du début
  const ast = parse();

  // Vérifier que toute la chaîne a été analysée
  if (expression.length > 0) {
    throw new Error(
      "Invalid expression: unexpected characters at end of string"
    );
  }

  return ast;
}

// Définition de l'AST
// const ast = {
//     type: 'AND',
//     left: {
//       type: 'OR',
//       left: { type: 'literal', value: 1 },
//       right: { type: 'literal', value: 2 },
//     },
//     right: { type: 'literal', value: 3 },
//   };
// const expression = '((1 OR 3) AND 2) OR ((1 OR 3) AND 4)';
// const expression = '(1 OR 3) AND 2';
const expression = "1 OR 3 AND 2";
const ast = parseExpression(expression);
console.log(ast);

// Fonction d'évaluation de l'AST
function evaluate(ast) {
  if (ast.type === "literal") {
    return ast.value;
  } else if (ast.type === "AND") {
    const left = evaluate(ast.left);
    const right = evaluate(ast.right);
    return left && right; // return WhereClause.and(evaluate(ast.left), evaluate(ast.right));
  } else if (ast.type === "OR") {
    const left = evaluate(ast.left);
    const right = evaluate(ast.right);
    return left || right; // return WhereClause.or(evaluate(ast.left), evaluate(ast.right));
  }
}

// Évaluation de l'expression logique
const result = evaluate(ast);
console.log(result);
console.log(evaluate({ type: "literal", value: 1 }));
