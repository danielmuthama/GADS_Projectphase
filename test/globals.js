const { assert } = require('chai');
const cheerio = require('cheerio');
const dot = require('dot-object');
const fs = require('fs');
const path = require('path');
const jscs = require('jscodeshift');
const esprima = require('esprima');

const source = fs.readFileSync(path.join(process.cwd(), 'js/gameoflife.js'), 'utf8');
const ast = jscs(source);

jscs.registerMethods({
  findConditional: function() {
    return this.find(jscs.ConditionalExpression);
  },
  findCall: function(name) {
    return this.find(jscs.CallExpression).filter(path => {
      let callee_name = '';
      if (path.value.callee.type === 'Identifier') {
        callee_name = path.value.callee.name;
      } if (path.value.callee.type === 'MemberExpression') {
        callee_name = path.value.callee.property.name;
      }
      return (callee_name === name) ? true : false;
    });
  },
  findAssignment: function(name) {
    return this.find(jscs.AssignmentExpression);
  },
  findIdentifier: function(name) {
    return this.find(jscs.Identifier, { name: name });
  },
  findPropertyAssignment: function(obj, property) {
    return this.find(jscs.AssignmentExpression).filter(path => {
      if (path.value.left.type === 'MemberExpression' &&
          path.value.left.object.name === obj &&
          path.value.left.property.name === property) {
        return true;
      } else {
        return false;
      }
    });
  },
  findSides: function(operator) {
    const element = this.find(jscs.BinaryExpression, { operator: operator });
    if (element.length) {
      const left_side = element.get().value.left;
      const right_side = element.get().value.right;
      const operator_expr = element.get().value.operator;
      return { left: left_side, right: right_side, operator: operator_expr }
    } else {
      return false;
    }
  },
  findIdentifierParent: function(name) {
    const element = this.find(jscs.Identifier, { name: name });
    if (element.length) {
      const parent = element.get().parent.value
      if (parent.type === 'VariableDeclarator') {
        if (parent.init.type === 'FunctionExpression' || parent.init.type === 'ArrowFunctionExpression') {
          return { params: parent.init.params, body: parent.init.body, defaults: parent.init.defaults };
        }
        return parent;
      } else if (parent.type === 'FunctionDeclaration') {
        return { params: parent.params, body: parent.body, defaults: parent.defaults };
      } else {
        return parent;
      }
    } else {
      return false;
    }
  },
  returnParent: function(name) {
    const element = this.find(jscs.Identifier, { name: name });
    return (element.length) ? jscs(element.get().parent) : [];
  },
  findBinary: function() {
    return this.find(jscs.BinaryExpression);
  },
  findReturn: function() {
    return this.find(jscs.ReturnStatement);
  },
  findIf: function() {
    const element = this.find(jscs.IfStatement);
    return (element.length) ? element.get().value : [];
  },
});


Object.assign(global, {
  source,
  assert,
  ast,
  dot,
  jscs
});
