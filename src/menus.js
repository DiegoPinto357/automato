function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Financeiro')
    .addSubMenu(
      ui
        .createMenu('Investimentos')
        .addItem('Atualizar valores totais', 'updateInvestmentsTotals')
    )
    .addToUi();
}
