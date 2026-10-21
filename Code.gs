/*
 * Backend da Feira de Ciências. Copie este arquivo para o Google Apps Script.
 * Não coloque códigos reais de jurados no repositório público: troque-os apenas
 * na cópia do Apps Script. Cadastre ADMIN_KEY em Configurações > Propriedades
 * do script. O LEIA-ME.md contém o passo a passo completo.
 */
var PLANILHA_ID = "1-qzEqMHeFFQVRHKDvkCQls1FnoGuSVe6mPm3gTertAI";
var PUBLICAR_RANKING = false; // Troque para true somente na divulgação final.

/* Vagas antecipadas: use apenas quantas pessoas comparecerem. */
var AVALIADORES = {
  "J01-MATA-8472": "Jurado 01",
  "J02-RIO-3951": "Jurado 02",
  "J03-SOL-6284": "Jurado 03",
  "J04-VENTO-1746": "Jurado 04",
  "J05-FOLHA-9325": "Jurado 05",
  "J06-AGUA-5618": "Jurado 06",
  "J07-TERRA-4063": "Jurado 07",
  "J08-SEMENTE-7194": "Jurado 08"
};

var PROJETOS = {
  "101-1": { turma: "101", tema: "EcoGeometria dos Sólidos" },
  "102-1": { turma: "102", tema: "Energia Limpa" },
  "102-2": { turma: "102", tema: "Bioquímica dos Alimentos" },
  "103-1": { turma: "103", tema: "Desmatamento e Queima: experimento com fumaça artificial" },
  "103-2": { turma: "103", tema: "Produção e Utilização de Energia Eólica" },
  "103-3": { turma: "103", tema: "Filtro de Água com Carvão Ativado" },
  "104-1": { turma: "104", tema: "Soluções Inovadoras" },
  "201-1": { turma: "201", tema: "Plantas Medicinais" },
  "202-1": { turma: "202", tema: "Agrobiodiversidade e Escalas Logarítmicas" },
  "203-1": { turma: "203", tema: "A Solidez do Sol" },
  "204-1": { turma: "204", tema: "Biodigestor Doméstico" },
  "301-1": { turma: "301", tema: "Quiz Verde sobre Sustentabilidade, Clima e Meio Ambiente" },
  "302-1": { turma: "302", tema: "Sapoliólise (Sabão Ecológico)" }
};

var CAB_PUBLICO = ["Data", "Registro", "Projeto", "Turma", "Nota", "Nome", "Comentário"];
var CAB_AVALIACAO = ["Data", "Projeto", "Turma", "Avaliador", "Código", "Domínio", "Clareza", "Material reciclado", "Ficha projeto", "Ficha turma e orientadores", "Ficha conceito", "Ficha materiais", "Ficha impacto", "Comentário"];

function planilha_() { return SpreadsheetApp.openById(PLANILHA_ID); }
function aba_(nome, cabecalho) {
  var aba = planilha_().getSheetByName(nome);
  if (!aba) aba = planilha_().insertSheet(nome);
  aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  aba.setFrozenRows(1);
  return aba;
}
function resposta_(obj, prefix) {
  if (prefix && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(prefix)) {
    return ContentService.createTextOutput(prefix + "(" + JSON.stringify(obj) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  var p = e.parameter;
  if (p.tipo === "publico") {
    if (!PROJETOS[p.projeto] || !p.registro || !notaPublicaValida_(p.nota)) return resposta_({ ok: false, erro: "Voto inválido" });
    var lockPublico = LockService.getScriptLock(); lockPublico.waitLock(10000);
    try {
      var pub = aba_("Votos públicos", CAB_PUBLICO);
      var linhasPub = pub.getDataRange().getValues();
      for (var x = 1; x < linhasPub.length; x++) if (linhasPub[x][1] === p.registro) return resposta_({ ok: true, duplicado: true });
      pub.appendRow([new Date(), p.registro, p.projeto, PROJETOS[p.projeto].turma, Number(p.nota), p.nome || "", p.comentario || ""]);
    } finally { lockPublico.releaseLock(); }
    return resposta_({ ok: true });
  }
  if (p.tipo === "avaliacao") {
    if (!AVALIADORES[p.token] || !PROJETOS[p.projeto]) return resposta_({ ok: false, erro: "Código inválido" });
    if (!notaTecnicaValida_(p.dominio) || !notaTecnicaValida_(p.clareza) || !notaTecnicaValida_(p.reciclado)) return resposta_({ ok: false, erro: "Notas inválidas" });
    var lockAvaliacao = LockService.getScriptLock(); lockAvaliacao.waitLock(10000);
    try {
      var aba = aba_("Avaliações", CAB_AVALIACAO);
      var valores = aba.getDataRange().getValues();
      for (var i = 1; i < valores.length; i++) {
        if (String(valores[i][1]) === p.projeto && valores[i][4] === p.token) return resposta_({ ok: true, duplicado: true });
      }
      aba.appendRow([new Date(), p.projeto, PROJETOS[p.projeto].turma, AVALIADORES[p.token], p.token, Number(p.dominio), Number(p.clareza), Number(p.reciclado), flag_(p.ficha_projeto), flag_(p.ficha_turma), flag_(p.ficha_conceito), flag_(p.ficha_material), flag_(p.ficha_impacto), p.comentario || ""]);
    } finally { lockAvaliacao.releaseLock(); }
    return resposta_({ ok: true });
  }
  return resposta_({ ok: false, erro: "Pedido inválido" });
}
function doGet(e) {
  var p = e.parameter;
  if (p.acao === "status") return resposta_(statusAvaliador_(p.token), p.prefix);
  if (p.acao === "confirmarPublico") return resposta_({ ok: true, registrado: publicoRegistrado_(p.registro) }, p.prefix);
  if (p.acao === "admin") return resposta_(painelAdmin_(p.chave), p.prefix);
  if (p.acao === "ranking") {
    if (!PUBLICAR_RANKING) return resposta_({ ok: false, erro: "Ranking ainda não publicado" }, p.prefix);
    return resposta_({ ok: true, projetos: calcularRanking_(), atualizadoEm: new Date().toISOString() }, p.prefix);
  }
  return resposta_({ ok: true }, p.prefix);
}

function notaPublicaValida_(valor) { var n = Number(valor); return n >= 1 && n <= 5 && n % 1 === 0; }
function notaTecnicaValida_(valor) { return [3, 3.5, 4, 4.5, 5].indexOf(Number(valor)) !== -1; }
function flag_(valor) { return String(valor) === "1" ? "Sim" : "Não"; }
function media_(numeros) { return numeros.length ? Math.round((numeros.reduce(function (a, b) { return a + b; }, 0) / numeros.length) * 100) / 100 : 0; }
function linhas_(nome, cabecalho) { return aba_(nome, cabecalho).getDataRange().getValues().slice(1).filter(function (r) { return r[0] !== ""; }); }

function statusAvaliador_(token) {
  if (!AVALIADORES[token]) return { ok: false, erro: "Código de jurado inválido" };
  var concluidos = linhas_("Avaliações", CAB_AVALIACAO).filter(function (r) { return r[4] === token; }).map(function (r) { return String(r[1]); });
  return { ok: true, avaliador: AVALIADORES[token], concluidos: concluidos };
}
function publicoRegistrado_(registro) {
  if (!registro) return false;
  return linhas_("Votos públicos", CAB_PUBLICO).some(function (r) { return r[1] === registro; });
}
function calcularRanking_() {
  var publico = linhas_("Votos públicos", CAB_PUBLICO);
  var avaliacao = linhas_("Avaliações", CAB_AVALIACAO);
  var ativos = {};
  avaliacao.forEach(function (r) { ativos[r[4]] = true; });
  var numeroAtivos = Object.keys(ativos).length;
  var resultado = Object.keys(PROJETOS).map(function (id) {
    var pub = publico.filter(function (r) { return String(r[2]) === id; }).map(function (r) { return Number(r[4]); });
    var linhasAva = avaliacao.filter(function (r) { return String(r[1]) === id; });
    var dominio = linhasAva.map(function (r) { return Number(r[5]); });
    var clareza = linhasAva.map(function (r) { return Number(r[6]); });
    var reciclado = linhasAva.map(function (r) { return Number(r[7]); });
    var mediasIndividuais = linhasAva.map(function (r) { return (Number(r[5]) + Number(r[6]) + Number(r[7])) / 3; });
    return { id: id, turma: PROJETOS[id].turma, tema: PROJETOS[id].tema, mediaAvaliadores: media_(mediasIndividuais), mediaDominio: media_(dominio), mediaClareza: media_(clareza), mediaReciclado: media_(reciclado), votosAvaliadores: linhasAva.length, mediaPublico: media_(pub), votosPublico: pub.length, completo: numeroAtivos > 0 && linhasAva.length === numeroAtivos };
  });
  resultado.sort(function (a, b) { return b.mediaAvaliadores - a.mediaAvaliadores || b.mediaPublico - a.mediaPublico || b.votosPublico - a.votosPublico; });
  return resultado;
}
function painelAdmin_(chave) {
  var chaveCorreta = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  if (!chaveCorreta || chave !== chaveCorreta) return { ok: false, erro: "Chave administrativa inválida" };
  var avaliacao = linhas_("Avaliações", CAB_AVALIACAO);
  var publico = linhas_("Votos públicos", CAB_PUBLICO);
  var projetos = calcularRanking_();
  var jurados = Object.keys(AVALIADORES).map(function (token) {
    var concluidos = avaliacao.filter(function (r) { return r[4] === token; }).length;
    return { nome: AVALIADORES[token], concluidos: concluidos, ativo: concluidos > 0 };
  });
  var ativos = jurados.filter(function (j) { return j.ativo; }).length;
  return { ok: true, atualizadoEm: new Date().toISOString(), totalAvaliacoes: avaliacao.length, totalPublico: publico.length, juradosAtivos: ativos, projetosCompletos: projetos.filter(function (p) { return p.completo; }).length, projetos: projetos, jurados: jurados };
}
