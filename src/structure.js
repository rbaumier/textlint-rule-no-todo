'use strict';

const { RuleHelper } = require('textlint-rule-helper');
const selectSections = require('select-section');

module.exports = (context, options = {}) => {
  options.headers = options.headers || [];

  const helper = new RuleHelper(context);
  const { Syntax, getSource, RuleError, report } = context;
  const findFirstHeader = (section) => section.children.find(child => child.type === Syntax.Header);

  return {
    [Syntax.Document](node) {
      const sections = selectSections(node);
      const headers = sections.map(section => {
        return getSource(findFirstHeader(section))
          .replace('#', '')
          .trim();
      }).slice(1);

      const invalidHeaders = headers.filter((header, i) => {
        return header.toLowerCase() !== (options.headers[i] || '').toLowerCase();
      });

      if(headers.length !== options.headers.length || invalidHeaders[0]) {
        report(node, new RuleError(`Wrong or misplaced header, please use the following format: ${options.headers.join(', ')}. Got ${headers.join(', ')}`));
      }
    }
  };
}
