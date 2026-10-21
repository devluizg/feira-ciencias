(function () {
  var area = document.getElementById("ranking");
  var atualizado = document.getElementById("atualizado");
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
      atualizado.textContent = "Atualizado em " + new Date(dados.atualizadoEm).toLocaleString("pt-BR");
  }
  function falha() { area.innerHTML = '<li class="carregando">Ainda não foi possível carregar o ranking. Tente novamente em instantes.</li>'; }
  FEIRA_API.jsonp({ acao: "ranking" }, "rankingCallback").then(mostrar).catch(falha);
})();
