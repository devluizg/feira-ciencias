(function () {
  var area = document.getElementById("ranking");
  var atualizado = document.getElementById("atualizado");
  var temResultado = false;
  var emCarregamento = false;
  if (!window.CONFIG.API_URL) {
    area.innerHTML = '<li class="carregando">O ranking será exibido aqui após a organização configurar a planilha de votos.</li>';
    return;
  }
  function mostrar(dados) {
      if (!dados.ok) { area.innerHTML = '<li class="carregando">' + (dados.erro || "Ranking indisponível") + '.</li>'; return; }
      if (!dados.projetos || !dados.projetos.length) throw new Error();
      area.innerHTML = dados.projetos.map(function (p, i) {
        return '<li><span class="posicao">' + (i + 1) + '</span><div><b>Turma ' + p.turma + '</b><span>' + p.tema + '</span></div><div class="notas"><strong>' + p.mediaAvaliadores.toFixed(2) + '</strong><small>comissão · ' + p.votosAvaliadores + ' avaliação(ões)</small><span>' + p.mediaPublico.toFixed(2) + ' público · ' + p.votosPublico + ' voto(s)</span></div></li>';
      }).join("");
      temResultado = true;
      atualizado.textContent = "Atualizado em " + new Date(dados.atualizadoEm).toLocaleString("pt-BR") + " · atualização automática a cada 30 s";
  }
  function falha() {
    if (!temResultado) area.innerHTML = '<li class="carregando">Ainda não foi possível carregar o ranking. Tente novamente em instantes.</li>';
  }
  function carregar() {
    if (emCarregamento) return;
    emCarregamento = true;
    FEIRA_API.jsonp({ acao: "ranking" }, "rankingCallback").then(mostrar).catch(falha).then(function () { emCarregamento = false; });
  }
  carregar();
  window.setInterval(carregar, 30000);
})();
