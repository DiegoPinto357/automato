const rewire = require('rewire');
const spreadsheet = rewire('./spreadsheet');
const tablePatterns = require('../../mockData/tablePatterns.json');

describe('spreadsheet', () => {
  describe('getTableFromSheet', () => {
    const getTableFromSheet = spreadsheet.__get__('getTableFromSheet');

    it.each(tablePatterns)('test table pattern $#', tablePattern => {
      const sheet = {
        getDataRange: () => ({
          getValues: () => tablePattern.data,
        }),
      };

      const result = getTableFromSheet(sheet);

      expect(result.rowOffset).toBe(tablePattern.expected.rowOffset);
      expect(result.numOfRows).toBe(tablePattern.expected.numOfRows);
      expect(result.colOffset).toBe(tablePattern.expected.colOffset);
      expect(result.numOfCols).toBe(tablePattern.expected.numOfCols);
    });
  });
});
