function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('Financeiro')
    .addSubMenu(
      ui
        .createMenu('Investimentos')
        .addItem('Atualizar valores totais', 'updateInvestmentsTotals')
    )
    .addSubMenu(
      ui
        .createMenu('Distribuição mensal')
        .addItem('Distribuir', 'showDistributionPrompt')
    )
    .addToUi();
}
