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

      const table = getTableFromSheet(sheet, 'id');

      expect(table.boundaries.rowOffset).toBe(tablePattern.expected.rowOffset);
      expect(table.boundaries.numOfRows).toBe(tablePattern.expected.numOfRows);
      expect(table.boundaries.colOffset).toBe(tablePattern.expected.colOffset);
      expect(table.boundaries.numOfCols).toBe(tablePattern.expected.numOfCols);
      expect(table.data).toEqual(tablePattern.expected.table);
    });
  });
});
