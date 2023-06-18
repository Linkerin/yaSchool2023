'use strict';

/**
 * @param {*} node AST Node
 * @returns {string} Import path value
 */
const getImportPath = node => {
  if (node.type === 'ImportDeclaration') return node.source.value;

  if (node.type === 'VariableDeclaration') {
    return node.declarations[0].init.arguments[0].value;
  }

  return '';
};

/**
 * Checks whether the node is a dynamic import (like `const a = dynamic('module')` )
 * @param {*} node AST Node
 * @param {SourceCode} sourceCode ESLint `SourceCode` instance
 * @returns {boolean} `true` if the node is a dynamic import, otherwise - `false`
 */
const isDynamicImport = (node, sourceCode) => {
  return (
    node.type === 'VariableDeclaration' &&
    sourceCode.getText(node).includes('= import(')
  );
};

/**
 * Gathers all imports from the provided program body.
 * @param {*} body `Program.body` value
 * @param {SourceCode} sourceCode ESLint `SourceCode` instance
 * @returns {[]} An array of objects with 2 attributes: `group` and `node`.
 * `group` is a number from 0 to 4, representing the node sorting order (asc).
 *
 * @example
 * getAllImports(Program.body, context.getSourceCode()); // { group: 0, node: Node }
 */
const getAllImports = (body, sourceCode) => {
  const imports = [];

  // Dividing imports initially into 5 groups makes sorting easier
  for (const node of body) {
    if (node.type === 'ImportDeclaration') {
      const path = getImportPath(node);

      if (path.startsWith('@')) {
        imports.push({ group: 0, node });
        continue;
      }

      if (path.startsWith('../')) {
        imports.push({ group: 2, node });
        continue;
      }

      if (path.startsWith('.')) {
        imports.push({ group: 3, node });
        continue;
      }

      imports.push({ group: 1, node });
      continue;
    }

    // dynamic imports
    if (isDynamicImport(node, sourceCode)) {
      imports.push({ group: 4, node });
      continue;
    }
  }

  return imports;
};

/**
 * Checks whether the provided path is relative
 * @param {string} path Path string returned by `getImportPath` function
 * @returns {boolean}
 */
const isRelativePath = path => {
  return path.startsWith('.');
};

/**
 * Import nodes sorting function (`.sort()` array method handler)
 * @param {Object} a array item, returned by `getAllImports` function
 * @param {Object} b array item, returned by `getAllImports` function
 * @returns {number} Indicates the relative order of `a` and `b` elements
 */
const sortNodesObjs = (a, b) => {
  if (a.group !== b.group) return a.group - b.group;

  const aPath = getImportPath(a.node);
  const bPath = getImportPath(b.node);

  // path sorting of dynamic imports
  if (a.group === 4 && b.group === 4) {
    const aIsRelative = isRelativePath(aPath);
    const bIsRelative = isRelativePath(bPath);

    if (aIsRelative !== bIsRelative) {
      if (aIsRelative) return 1;
      return -1;
    }
  }

  return aPath.localeCompare(bPath, 'en');
};

/**
 * Converts array of sorted import nodes into the resulting text
 * @param {[]} importsArr Array of import nodes returned by `getAllImports` function
 * @param {SourceCode} sourceCode ESLint `SourceCode` instance;
 * @returns {string} Resulting text that will be inserted into formatted file
 */
const nodesToText = (importsArr, sourceCode) => {
  let currentGroup = importsArr[0].group;
  const importsText = [];

  for (let importObj of importsArr) {
    const node = importObj.node;
    if (!node) continue;

    if (importObj.group !== currentGroup) {
      importsText.push('');
      currentGroup = importObj.group;
    }

    const comments = sourceCode.getCommentsBefore(node);

    if (comments.length > 0) {
      for (let comment of comments) {
        if (comment.type === 'Line') {
          importsText.push(sourceCode.getText(comment));
          continue;
        }
        if (comment.type === 'Block') {
          const commentText = sourceCode.getText(comment);
          const lines = commentText.split('\n');
          importsText.push(...lines);
          continue;
        }
      }
    }

    importsText.push(sourceCode.getText(node));
  }

  return importsText.join('\n');
};

/**
 * Get `range` values for the whole array of imports
 * @param {[]} importsArr Array of import nodes returned by `getAllImports` function
 * @returns {[number, number]} A `range` array with start and end values
 */
const getImportsRange = importsArr => {
  const importsEnd = importsArr[importsArr.length - 1].node.range[1];
  let importsStart;

  const firstImportedNode = importsArr[0].node;

  if (firstImportedNode.leadingComments) {
    importsStart = firstImportedNode.leadingComments[0].range[0];
  } else {
    importsStart = firstImportedNode.range[0];
  }

  return [importsStart, importsEnd];
};

/**
 * Fixer function
 * @param {string} sortedImportsText Resulting text for inserting returned by `nodesToText` function
 * @param {number} importsEnd end of the last imports' node
 * @param {SourceCode} sourceCode ESLint `SourceCode` instance
 * @returns
 */
const fixHandler = (sortedImportsText, importsEnd, sourceCode) => {
  return fixer => {
    const restCodeStart = importsEnd + 1;
    const codeLength = sourceCode.text.length;
    const restCode = sourceCode.text.slice(restCodeStart, codeLength);
    const resultText = sortedImportsText + '\n' + restCode;

    return fixer.replaceTextRange([0, codeLength], resultText);
  };
};

/**
 * Main rule handler
 * @param {*} programNode `Program` node
 * @param {*} context ESLint `Context` object
 * @returns
 */
const programHandler = (programNode, context) => {
  const sourceCode = context.getSourceCode();
  const imports = getAllImports(programNode.body, sourceCode);

  if (imports.length <= 0) return;

  const sortedImports = Array.from(imports).sort(sortNodesObjs);
  const sortedImportsText = nodesToText(sortedImports, sourceCode);

  const [importsStart, importsEnd] = getImportsRange(imports);
  const importsText = sourceCode.text.slice(importsStart, importsEnd);

  if (importsText !== sortedImportsText) {
    context.report({
      message: 'Imports should be properly  sorted',
      node: imports[0].node,
      fix: fixHandler(sortedImportsText, importsEnd, sourceCode)
    });
  }
};

module.exports = {
  meta: {
    type: 'layout',
    fixable: 'code'
  },

  create(context) {
    return {
      Program(node) {
        programHandler(node, context);
      }
    };
  }
};
