const rewire = require('rewire');
const TableModule = rewire('./Table');
const tablePatterns = require('../../mockData/tablePatterns.json');

const sheetGetRangeMock = jest.fn();
const cellSsetValuesMock = jest.fn();

const mockSpreadSheet = data =>
  jest.spyOn(SpreadsheetApp, 'openById').mockImplementation(() => ({
    getSheetByName: () => ({
      getDataRange: () => ({ getValues: () => data }),
      getRange: sheetGetRangeMock.mockImplementation(() => ({
        setValues: cellSsetValuesMock,
      })),
    }),
  }));

TableModule.__set__({ SpreadsheetApp });

describe('Table', () => {
  const Table = TableModule.__get__('Table');
  const spreadsheetId = 'dlknasd9083nxcasd08956';
  const sheetName = 'Marbles Balance';
  const tableId = 'id';

  beforeEach(() => jest.clearAllMocks());

  it.each(tablePatterns)(
    'loads table from spreadsheet - pattern $#',
    tablePattern => {
      mockSpreadSheet(tablePattern.data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      expect(table.getBoundaries().rowOffset).toBe(
        tablePattern.expected.rowOffset
      );
      expect(table.getBoundaries().numOfRows).toBe(
        tablePattern.expected.numOfRows
      );
      expect(table.getBoundaries().colOffset).toBe(
        tablePattern.expected.colOffset
      );
      expect(table.getBoundaries().numOfCols).toBe(
        tablePattern.expected.numOfCols
      );
      expect(table.getData()).toEqual(tablePattern.expected.table);
    }
  );

  describe('setData', () => {
    it('sets col data to table', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const colIndex = 1;
      const data = [['a'], ['b'], ['c']];

      table.setData(data, { colIndex });

      expect(table.getData()).toEqual([
        ['id', 'a', '1'],
        ['1', 'b', '1'],
        ['1', 'c', '1'],
      ]);
    });

    it('sets row data to table', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const rowIndex = 1;
      const data = [['a', 'b', 'c']];

      table.setData(data, { rowIndex });

      expect(table.getData()).toEqual([
        ['id', '1', '1'],
        ['a', 'b', 'c'],
        ['1', '1', '1'],
      ]);
    });

    it('sets data to table', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const rowIndex = 1;
      const colIndex = 1;
      const data = [
        ['a', 'b'],
        ['c', 'd'],
      ];

      table.setData(data, { rowIndex, colIndex });

      expect(table.getData()).toEqual([
        ['id', '1', '1'],
        ['1', 'a', 'b'],
        ['1', 'c', 'd'],
      ]);
    });
  });

  describe('updateSpreadSheet', () => {
    it('updates spreadsheet data', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const rowIndex = 1;
      const colIndex = 1;
      const data = [
        ['a', 'b'],
        ['c', 'd'],
      ];

      table.setData(data, { rowIndex, colIndex });
      table.updateSpreadSheet();

      expect(sheetGetRangeMock).toBeCalledTimes(1);
      expect(sheetGetRangeMock).toBeCalledWith('B2:D4');
      expect(cellSsetValuesMock).toBeCalledTimes(1);
      expect(cellSsetValuesMock).toBeCalledWith([
        ['id', '1', '1'],
        ['1', 'a', 'b'],
        ['1', 'c', 'd'],
      ]);
    });

    it('updates spreadsheet data for a configured table area', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const rowIndex = 1;
      const colIndex = 1;
      const data = [
        ['a', 'b'],
        ['c', 'd'],
      ];

      table.setData(data, { rowIndex, colIndex });
      table.updateSpreadSheet({ ignore: { rowsAtStart: 1, colsAtStart: 1 } });

      expect(sheetGetRangeMock).toBeCalledTimes(1);
      expect(sheetGetRangeMock).toBeCalledWith('C3:D4');
      expect(cellSsetValuesMock).toBeCalledTimes(1);
      expect(cellSsetValuesMock).toBeCalledWith([
        ['a', 'b'],
        ['c', 'd'],
      ]);
    });

    it('updates spreadsheet data for a single cell', () => {
      mockSpreadSheet(tablePatterns[0].data);

      const table = new Table(spreadsheetId, sheetName, tableId);

      const rowIndex = 1;
      const colIndex = 1;
      const data = [['a']];

      table.setData(data, { rowIndex, colIndex });
      table.updateSpreadSheet({
        ignore: { rowsAtStart: 1, rowsAtEnd: 1, colsAtStart: 1, colsAtEnd: 1 },
      });

      expect(sheetGetRangeMock).toBeCalledTimes(1);
      expect(sheetGetRangeMock).toBeCalledWith('C3');
      expect(cellSsetValuesMock).toBeCalledTimes(1);
      expect(cellSsetValuesMock).toBeCalledWith([['a']]);
    });
  });
});
