const indexToRange = (columnIndex, rowIndex) => {
  return `${String.fromCharCode(columnIndex + 65)}${rowIndex + 1}`;
};

const isEmpty = value => value === '';

const getTableFromSheet = (sheet, id) => {
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

      if (!isEmpty(item)) {
        numOfRows = Math.max(rowIndex - rowOffset + 1, numOfRows);
        numOfCols = Math.max(colIndex - colOffset + 1, numOfCols);
        emptyRow = false;
      }
    });

    return emptyRow;
  });

  const table = data
    .slice(rowOffset, rowOffset + numOfRows)
    .map(row => row.slice(colOffset, colOffset + numOfCols));

  return { rowOffset, numOfRows, colOffset, numOfCols, table };
};
