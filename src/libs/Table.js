class Table {
  constructor(spreadsheetId, sheetName, id) {
    this._sheet =
      SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    this._getTableFromSheet(this._sheet, id);
  }

  _getTableFromSheet(sheet, id) {
    const data = sheet.getDataRange().getValues();

    let rowOffset = null;
    let numOfRows = 0;
    let colOffset = null;
    let numOfCols = 0;

    data.some((row, rowIndex) => {
      let emptyRow = true;

      row.forEach((item, colIndex) => {
        if (item === id) {
          rowOffset = rowIndex;
          colOffset = colIndex;
          emptyRow = false;
          return;
        }

        if (rowOffset === null && colOffset === null) {
          emptyRow = false;
          return;
        }

        if (item !== '') {
          numOfRows = Math.max(rowIndex - rowOffset + 1, numOfRows);
          numOfCols = Math.max(colIndex - colOffset + 1, numOfCols);
          emptyRow = false;
        }
      });

      return emptyRow;
    });

    this._data = data
      .slice(rowOffset, rowOffset + numOfRows)
      .map(row => row.slice(colOffset, colOffset + numOfCols));

    this._boundaries = { rowOffset, numOfRows, colOffset, numOfCols };

    return this;
  }

  static indexToCell(rowIndex, colIndex) {
    return `${String.fromCharCode(colIndex + 65)}${rowIndex + 1}`;
  }

  setData(data, { rowIndex, colIndex }) {
    rowIndex = rowIndex ? rowIndex : 0;
    colIndex = colIndex ? colIndex : 0;

    for (let i = 0; i < data.length; i++) {
      const currentRow = this._data[rowIndex + i];
      const newRow = data[i];

      for (let j = 0; j < newRow.length; j++) {
        currentRow[colIndex + j] = newRow[j];
      }
    }

    return this;
  }

  getData() {
    return this._data;
  }

  getBoundaries() {
    return this._boundaries;
  }

  updateSpreadSheet({ ignore = {} } = {}) {
    const {
      rowsAtStart = 0,
      rowsAtEnd = 0,
      colsAtStart = 0,
      colsAtEnd = 0,
    } = ignore;
    const { rowOffset, numOfRows, colOffset, numOfCols } = this._boundaries;

    const topLeftCell = Table.indexToCell(
      rowOffset + rowsAtStart,
      colOffset + colsAtStart
    );
    const bottomRightCell = Table.indexToCell(
      rowOffset + numOfRows - rowsAtEnd - 1,
      colOffset + numOfCols - colsAtEnd - 1
    );

    const range =
      topLeftCell === bottomRightCell
        ? topLeftCell
        : `${topLeftCell}:${bottomRightCell}`;

    const cells = this._sheet.getRange(range);
    cells.setValues(
      this._data
        .slice(rowsAtStart, this._data.length - rowsAtEnd)
        .map(row => row.slice(colsAtStart, row.length - colsAtEnd))
    );
  }
}
