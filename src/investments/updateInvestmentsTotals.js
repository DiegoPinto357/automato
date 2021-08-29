const run = () => {
  const spreadsheetId = '1MuWkH84pJhQFxe07CHxPBGQTiSz6FDYCuPAB_DMbgNY';
  const sheetName = 'Investimentos';

  const headerSize = 1;
  const colHeaderSize = 1;
  const footerSize = 2;
  const colFooterSize = 1;

  const getTableData = () => {
    const sheet =
      SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    const table = getTableFromSheet(sheet, 'Finalidade');

    const tableValues = table.data
      .slice(headerSize, -footerSize)
      .map(row => row.slice(colHeaderSize, -colFooterSize));

    const currentTotals = table.data[table.boundaries.numOfRows - 2].slice(
      colHeaderSize,
      -colFooterSize
    );
    const newTotals = table.data[table.boundaries.numOfRows - 1]
      .slice(colHeaderSize, -colFooterSize)
      .map((newTotal, index) =>
        newTotal !== '' ? newTotal : currentTotals[index]
      );

    return {
      sheet,
      tableBoundaries: table.boundaries,
      tableValues,
      currentTotals,
      newTotals,
    };
  };

  const { sheet, tableBoundaries, tableValues, currentTotals, newTotals } =
    getTableData();
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

  newValues.forEach((column, index) => {
    const colIndex = index + tableBoundaries.colOffset + colHeaderSize;
    const firstCell = indexToCell(
      colIndex,
      tableBoundaries.rowOffset + headerSize
    );
    const lastCell = indexToCell(
      colIndex,
      tableBoundaries.rowOffset -
        headerSize +
        tableBoundaries.numOfRows -
        footerSize
    );
    const range = `${firstCell}:${lastCell}`;

    const cells = sheet.getRange(range);
    cells.setValues(column.map(value => [value]));
  });
};
