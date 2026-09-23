/**
 * Raio-X do Travamento → planilha de leads
 *
 * Como usar (uma vez só):
 * 1. Abra a planilha "Leads — Raio-X do Travamento" no Google Drive.
 * 2. Menu Extensões → Apps Script. Apague o que estiver lá e cole este arquivo inteiro.
 * 3. Clique em Implantar → Nova implantação → tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Autorize o acesso e copie a URL que termina em /exec.
 * 5. Cole essa URL em PLANILHA_URL no index.html do quiz.
 */

const SHEET_ID = "1jogXVfuZV13gmlbZNx2RqN9qcIAG3sLl5A3YT66Kt9E";

function doPost(e) {
  const d = JSON.parse(e.postData.contents || "{}");
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.appendRow([new Date(), limpar(d.nome), limpar(d.telefone), limpar(d.travamento)]);
  return ContentService.createTextOutput("ok");
}

// Corta textos longos e impede que um valor vire fórmula na planilha
function limpar(v) {
  const s = String(v || "").slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
