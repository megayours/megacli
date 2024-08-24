/* global buffer, console, process */

export function findEntryContent(xmlContent, mPath) {
  const xmlDict = parseXml(xmlContent);
  return findEntriesInDict(xmlDict, mPath);
}

function parseXml(xmlContent) {
  let result = new Map();
  let currentKey = '';
  let currentValue = '';
  const stack = [];
  let insideString = false;

  const lines = xmlContent.split('\n');
  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('<entry key="')) {
      currentKey = trimmedLine.substring(12, trimmedLine.indexOf('">'));
      currentValue = '';
    } else if (trimmedLine.startsWith('<string>')) {
      insideString = true;
      currentValue = trimmedLine.substring(8);
      if (trimmedLine.includes('</string>')) {
        currentValue = currentValue.substring(
          0,
          currentValue.indexOf('</string>')
        );
        insideString = false;
      }
    } else if (insideString) {
      if (trimmedLine.includes('</string>')) {
        currentValue +=
          '\n' + trimmedLine.substring(0, trimmedLine.indexOf('</string>'));
        insideString = false;
      } else {
        currentValue += '\n' + trimmedLine;
      }
    } else if (trimmedLine.startsWith('<int>')) {
      currentValue = trimmedLine.substring(5, trimmedLine.indexOf('</int>'));
    } else if (trimmedLine.startsWith('<dict>')) {
      stack.push(result);
      result = new Map();
    } else if (trimmedLine.startsWith('<array>')) {
      stack.push(result);
      result = new Map();
    } else if (trimmedLine.startsWith('</entry>')) {
      if (stack.length > 0) {
        const parent = stack.pop();
        parent.set(currentKey, result);
        result = parent;
      } else {
        result.set(currentKey, currentValue);
      }
    } else if (
      trimmedLine.startsWith('</dict>') ||
      trimmedLine.startsWith('</array>')
    ) {
      if (stack.length > 0) {
        const parent = stack.pop();
        parent.set(currentKey, result);
        result = parent;
      }
    }
  }

  return result;
}

function findEntriesInDict(dict, mPath) {
  const result = new Map();

  for (let [key, value] of dict.entries()) {
    console.log('Entry key: ', key);
    if (key.includes(mPath)) {
      result.set(key, value);
    } else if (value instanceof Map) {
      const nestedResult = findEntriesInDict(value, mPath);
      for (let [nestedKey, nestedValue] of nestedResult.entries()) {
        result.set(nestedKey, nestedValue);
      }
    } else if (Array.isArray(value)) {
      for (let item of value) {
        if (item instanceof Map) {
          const nestedResult = findEntriesInDict(item, mPath);
          for (let [nestedKey, nestedValue] of nestedResult.entries()) {
            result.set(nestedKey, nestedValue);
          }
        }
      }
    }
  }

  return result;
}
