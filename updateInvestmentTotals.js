const spreadsheetId = "1MuWkH84pJhQFxe07CHxPBGQTiSz6FDYCuPAB_DMbgNY";
const sheetName = "Investimentos";

// rows
const rowOffset = 2;
const numOfRows = 14;
const firstRow = rowOffset;
const lastRow = firstRow + numOfRows - 1;

// columns
const columnOffset = 2;
const numOfColumns = 13;
const firstColumn = columnOffset;
const lastColumn = firstColumn + numOfColumns;

function updateInvestmentTotals() {
  const { sheet, tableValues, currentTotals, newTotals } = getTableData();
  const totalDiffs = newTotals.map(
    (newTotal, index) => newTotal - currentTotals[index]
  );

  const newValues = currentTotals.map((total, colunmIndex) => {
    const totalDiff = totalDiffs[colunmIndex];

    const values = tableValues.map(row => row[colunmIndex]);
    const composition = values.map(value => value / total);
    const diff = composition.map(value => value * totalDiff);

    return values
      .map((value, index) => value + diff[index])
      .map(value => (value == 0 ? "" : value));
  });

  newValues.forEach((column, index) => {
    const rangeStart = indexToRange(index + columnOffset, firstRow);
    const rangeEnd = indexToRange(index + columnOffset, lastRow);
    const range = `${rangeStart}:${rangeEnd}`;

    const cells = sheet.getRange(range);
    cells.setValues(column.map(value => [value]));
  });
}

function getTableData() {
  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const totalsRowIndex = lastRow + 1;
  const newTotalsRowIndex = totalsRowIndex + 1;

  const tableValues = data
    .slice(firstRow, lastRow + 1)
    .map(row => row.slice(firstColumn, lastColumn));

  const currentTotals = data[totalsRowIndex].slice(firstColumn, lastColumn);
  const newTotals = data[newTotalsRowIndex]
    .slice(firstColumn, lastColumn)
    .map((newTotal, index) =>
      newTotal !== "" ? newTotal : currentTotals[index]
    );

  return { sheet, tableValues, currentTotals, newTotals };
}

function indexToRange(columnIndex, rowIndex) {
  return `${String.fromCharCode(columnIndex + 65)}${rowIndex + 1}`;
}
