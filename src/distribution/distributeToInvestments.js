const distributeToInvestments = month => {
  const sheetName = 'Distribuição';
  const distributionTableId = 'Distribuição';

  const distributionTable = new Table(
    spreadsheetId,
    sheetName,
    distributionTableId
  );

  SpreadsheetApp.getUi().alert('distributeToInvestments ' + month);

  console.log(distributionTable.getData());
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

  if (button == ui.Button.OK) {
    if (month < 1 || month > 12) {
      ui.alert('Mês inválido');
      return;
    }

    distributeToInvestments(month);
  }
};
