/**
 * Raio-X do Travamento → planilha de leads
 * (não envia e-mail: a pessoa baixa o resultado em PDF no próprio quiz)
 *
 * Como atualizar:
 * 1. Na planilha, menu Extensões → Apps Script. Apague tudo e cole este arquivo inteiro. Salve.
 * 2. Implantar → Gerenciar implantações → lápis (editar) → Versão: "Nova versão" → Implantar.
 *    Assim a URL /exec continua a mesma e o quiz não precisa mudar.
 */

const SHEET_ID = "1jogXVfuZV13gmlbZNx2RqN9qcIAG3sLl5A3YT66Kt9E";
const CABECALHO = ["Data/hora", "Nome", "E-mail", "Telefone (WhatsApp)", "Travamento", "Objetivo"];

const CATS = {
  A: "Travamento na alimentação",
  B: "Travamento na constância",
  C: "Travamento na rotina",
  D: "Travamento na barriga e inchaço",
  E: "Travamento por falta de direção"
};

function doPost(e) {
  const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  const respostas = String(d.respostas || "").replace(/[^A-E]/g, "").slice(0, 8);
  const top = travamentos(respostas);

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  sheet.getRange(1, 1, 1, CABECALHO.length).setValues([CABECALHO]);
  sheet.appendRow([
    new Date(),
    celula(texto(d.nome, 60)),
    celula(texto(d.email, 120)),
    celula(texto(d.telefone, 30)),
    top.map(k => CATS[k]).join(" + "),
    celula(texto(d.objetivo, 40))
  ]);
  return ContentService.createTextOutput("ok");
}

function travamentos(respostas) {
  const c = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  respostas.split("").forEach(k => c[k]++);
  const max = Math.max.apply(null, Object.keys(c).map(k => c[k]));
  return max ? Object.keys(c).filter(k => c[k] === max) : [];
}

function texto(v, max) { return String(v || "").trim().slice(0, max); }
// Impede que um valor vire fórmula na planilha
function celula(s) { return /^[=+\-@]/.test(s) ? "'" + s : s; }
