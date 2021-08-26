const indexToRange = (columnIndex, rowIndex) => {
  return `${String.fromCharCode(columnIndex + 65)}${rowIndex + 1}`;
};

const isEmpty = value => value === '';

const getTableFromSheet = (sheet, id) => {
  const data = sheet.getDataRange().getValues();

  let rowOffset = 0;
  let numOfRows = 0;
  let colOffset = 0;
  let numOfCols = 0;

  data.some((row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item === id) {
        rowOffset = rowIndex;
        colOffset = colIndex;
      }

      if (!isEmpty(item)) {
        numOfRows = Math.max(rowIndex - rowOffset + 1, numOfRows);
        numOfCols = Math.max(colIndex - colOffset + 1, numOfCols);
      }
    });
  });

  const table = data
    .slice(rowOffset, rowOffset + numOfRows)
    .map(row => row.slice(colOffset, colOffset + numOfCols));

  return { rowOffset, numOfRows, colOffset, numOfCols, table };
};
