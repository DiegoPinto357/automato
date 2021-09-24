const getDistributionValues = month => {
  const sheetName = 'Distribuição';
  const tableId = 'Distribuição';

  const table = new Table(spreadsheetId, sheetName, tableId);

  const monthValues = table.getData().slice(2, -1);

  return monthValues.reduce((dist, row, index) => {
    if (index % 2 !== 0) {
      dist.push(row.slice(1, -1)[month - 1]);
    }
    return dist;
  }, []);
};

const getCurrentInvestmentValues = () => {
  const sheetName = 'Investimentos';
  const tableId = 'Finalidade';

  const table = new Table(spreadsheetId, sheetName, tableId);

  const ignoreAtTop = 1;
  const ignoreAtBottom = 2;
  const investmentColIndex = 1;

  const data = table.getData();

  return data.reduce((values, row, index) => {
    if (index <= ignoreAtTop - 1 || index >= data.length - ignoreAtBottom)
      return values;

    values.push(row[investmentColIndex]);
    return values;
  }, []);
};

const distributeToInvestments = (month = 1) => {
  const distributionValues = getDistributionValues(month);
  const currentInvestmentValues = getCurrentInvestmentValues();

  console.log(distributionValues);
  console.log(currentInvestmentValues);
};

const showDistributionPrompt = () => {
  const ui = SpreadsheetApp.getUi();

  const result = ui.prompt(
    'Qual mês deseja executar a distribuição?',
    'Mês (1 a 12):',
    ui.ButtonSet.OK_CANCEL
  );

  const button = result.getSelectedButton();
  const month = result.getResponseText();

  if (button === ui.Button.OK) {
    if (month < 1 || month > 12) {
      ui.alert('Mês inválido');
      return;
    }

    distributeToInvestments(month);
  }
};
