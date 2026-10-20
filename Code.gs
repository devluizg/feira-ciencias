/*
 * Backend da Feira de Projetos. Crie uma planilha Google, abra Extensões >
 * Apps Script, cole este arquivo e siga o LEIA-ME.md para publicar como Web App.
 */
var PLANILHA_ID = "COLE_O_ID_DA_PLANILHA_AQUI";

/* Troque os códigos e entregue UM link/QR para cada avaliador. */
var AVALIADORES = {
  "AV-ANA-2026": "Ana",
  "AV-BRUNO-2026": "Bruno",
  "AV-CARLA-2026": "Carla"
};

var PROJETOS = {
  "101-1": { turma: "101", tema: "EcoGeometria dos Sólidos" },
  "102-1": { turma: "102", tema: "Energia Limpa" },
  "102-2": { turma: "102", tema: "Bioquímica dos Alimentos" },
  "103-1": { turma: "103", tema: "Desmatamento e Queima: experimento com fumaça artificial" },
  "103-2": { turma: "103", tema: "Produção e Utilização de Energia Eólica" },
  "103-3": { turma: "103", tema: "Filtro de Água com Carvão Ativado" },
  "104-1": { turma: "104", tema: "Robótica Sustentável na Educação" },
  "201-1": { turma: "201", tema: "Plantas Medicinais" },
  "202-1": { turma: "202", tema: "Pesticida Agroecológico" },
  "203-1": { turma: "203", tema: "A Solidez do Sol" },
  "204-1": { turma: "204", tema: "Biodigestor Doméstico" },
  "301-1": { turma: "301", tema: "Quiz Verde sobre Sustentabilidade, Clima e Meio Ambiente" },
  "302-1": { turma: "302", tema: "Sapoliólise (Sabão Ecológico)" }
};

function planilha_() { return SpreadsheetApp.openById(PLANILHA_ID); }
function aba_(nome, cabecalho) {
  var aba = planilha_().getSheetByName(nome);
  if (!aba) { aba = planilha_().insertSheet(nome); aba.appendRow(cabecalho); }
  return aba;
}
function resposta_(obj, prefix) {
  if (prefix && /^rankingCallback_[A-Za-z0-9_]+$/.test(prefix)) {
    return ContentService.createTextOutput(prefix + "(" + JSON.stringify(obj) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  var p = e.parameter;
  if (p.tipo === "publico") {
    aba_("Votos públicos", ["Data", "Projeto", "Turma", "Nota", "Nome", "Comentário"])
      .appendRow([new Date(), p.projeto, p.turma, Number(p.nota), p.nome, p.comentario]);
    return resposta_({ ok: true });
  }
  if (p.tipo === "avaliacao") {
    if (!AVALIADORES[p.token] || !PROJETOS[p.projeto]) return resposta_({ ok: false, erro: "Código inválido" });
    var aba = aba_("Avaliações", ["Data", "Projeto", "Turma", "Avaliador", "Código", "Científico", "Inovação", "Apresentação", "Comentário"]);
    var valores = aba.getDataRange().getValues();
    for (var i = 1; i < valores.length; i++) {
      if (String(valores[i][1]) === p.projeto && valores[i][4] === p.token) return resposta_({ ok: false, erro: "Já avaliado" });
    }
    aba.appendRow([new Date(), p.projeto, p.turma, AVALIADORES[p.token], p.token, Number(p.cientifico), Number(p.inovacao), Number(p.apresentacao), p.comentario]);
    return resposta_({ ok: true });
  }
  return resposta_({ ok: false, erro: "Pedido inválido" });
}
function doGet(e) {
  if (e.parameter.acao !== "ranking") return resposta_({ ok: true });
  var publico = aba_("Votos públicos", ["Data", "Projeto", "Turma", "Nota", "Nome", "Comentário"]).getDataRange().getValues();
  var avaliacao = aba_("Avaliações", ["Data", "Projeto", "Turma", "Avaliador", "Código", "Científico", "Inovação", "Apresentação", "Comentário"]).getDataRange().getValues();
  var resultado = Object.keys(PROJETOS).map(function (id) {
    var pub = publico.slice(1).filter(function (r) { return String(r[1]) === id; }).map(function (r) { return Number(r[3]); });
    var ava = avaliacao.slice(1).filter(function (r) { return String(r[1]) === id; }).map(function (r) { return (Number(r[5]) + Number(r[6]) + Number(r[7])) / 3; });
    return { turma: PROJETOS[id].turma, tema: PROJETOS[id].tema, mediaAvaliadores: ava.length ? media_(ava) : 0, mediaPublico: pub.length ? media_(pub) : 0, votosPublico: pub.length };
  });
  resultado.sort(function (a, b) { return b.mediaAvaliadores - a.mediaAvaliadores || b.mediaPublico - a.mediaPublico || b.votosPublico - a.votosPublico; });
  return resposta_({ projetos: resultado, atualizadoEm: new Date().toISOString() }, e.parameter.prefix);
}
function media_(numeros) { return Math.round((numeros.reduce(function (a, b) { return a + b; }, 0) / numeros.length) * 100) / 100; }
