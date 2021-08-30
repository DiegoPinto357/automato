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

    const emptyCols = new Array(data[0].length).fill(true);

    data.some((row, rowIndex) => {
      let emptyRow = true;

      row.forEach((item, colIndex) => {
        if (item === id) {
          rowOffset = rowIndex;
          emptyRow = false;
          emptyCols[colIndex] = false;
          return;
        }

        if (rowOffset === null) {
          emptyRow = false;
          return;
        }

        if (item !== '') {
          numOfRows = Math.max(rowIndex - rowOffset + 1, numOfRows);
          emptyRow = false;
          emptyCols[colIndex] = false;
        }
      });

      return emptyRow;
    });

    const colOffset = emptyCols[0] ? emptyCols.indexOf(true) + 1 : 0;
    const emptyColsWithoutOffset = emptyCols.slice(colOffset);
    const lastEmptyIndex = emptyColsWithoutOffset.indexOf(true);
    const numOfCols =
      lastEmptyIndex >= 0 ? lastEmptyIndex : emptyColsWithoutOffset.length;

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
