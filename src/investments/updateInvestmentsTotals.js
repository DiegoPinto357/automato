const run = () => {
  const spreadsheetId = '1MuWkH84pJhQFxe07CHxPBGQTiSz6FDYCuPAB_DMbgNY';
  const sheetName = 'Investimentos';
  const tableId = 'Finalidade';

  const headerSize = 1;
  const colHeaderSize = 1;
  const footerSize = 2;
  const colFooterSize = 1;

  const table = new Table(spreadsheetId, sheetName, tableId);

  const tableValues = table
    .getData()
    .slice(headerSize, -footerSize)
    .map(row => row.slice(colHeaderSize, -colFooterSize));

  const { numOfRows } = table.getBoundaries();

  const currentTotals = table
    .getData()
    [numOfRows - 2].slice(colHeaderSize, -colFooterSize);

  const newTotals = table
    .getData()
    [numOfRows - 1].slice(colHeaderSize, -colFooterSize)
    .map((newTotal, index) =>
      newTotal !== '' ? newTotal : currentTotals[index]
    );

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
      .map(value => (value == 0 ? '' : value));
  });

  const transpose = matrix =>
    matrix[0].map((_, i) => matrix.map(row => row[i]));

  table.setData(transpose(newValues), {
    rowIndex: headerSize,
    colIndex: colHeaderSize,
  });

  table.updateSpreadSheet({
    ignore: {
      rowsAtStart: headerSize,
      rowsAtEnd: footerSize,
      colsAtStart: colHeaderSize,
      colsAtEnd: colFooterSize,
    },
  });
};
