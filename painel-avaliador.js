(function () {
  var token = new URLSearchParams(window.location.search).get("token") || "";
  var lista = document.getElementById("lista-avaliador");
  var aviso = document.getElementById("aviso-painel");
  var concluidos = [];

  function seguro(texto) { var el = document.createElement("span"); el.textContent = texto; return el.innerHTML; }
  function render() {
    document.getElementById("texto-progresso").textContent = concluidos.length + " de " + PROJETOS.length;
    document.getElementById("barra-progresso").style.width = (concluidos.length / PROJETOS.length * 100) + "%";
    document.getElementById("mensagem-progresso").textContent = concluidos.length === PROJETOS.length ? "Roteiro concluído. Obrigado pela avaliação!" : "Faltam " + (PROJETOS.length - concluidos.length) + " projeto(s).";
    lista.innerHTML = PROJETOS.map(function (p) {
      var feito = concluidos.indexOf(p.id) !== -1;
      var link = "avaliador.html?projeto=" + encodeURIComponent(p.id) + "&token=" + encodeURIComponent(token);
      return '<li class="' + (feito ? "concluido" : "") + '"><a href="' + link + '"><span class="estado-projeto" aria-hidden="true">' + (feito ? "✓" : p.numero) + '</span><div><b>Turma ' + p.turma + ' · Projeto ' + p.numero + '</b><span>' + seguro(p.tema) + '</span></div><strong>' + (feito ? "Concluído" : "Avaliar") + '</strong></a></li>';
    }).join("");
  }
  if (!token) {
    aviso.hidden = false; aviso.textContent = "Link de jurado inválido. Use o QR Code entregue pela organização."; lista.hidden = true; return;
  }
  if (!CONFIG.API_URL) {
    aviso.hidden = false; aviso.textContent = "O sistema de avaliações ainda não foi conectado à planilha."; lista.hidden = true; return;
  }
  FEIRA_API.jsonp({ acao: "status", token: token }, "statusJurado")
    .then(function (dados) {
      if (!dados.ok) throw new Error(dados.erro || "Código inválido");
      concluidos = dados.concluidos || [];
      document.getElementById("identidade-jurado").textContent = dados.avaliador + " · " + PROJETOS.length + " projetos";
      render();
    })
    .catch(function (erro) {
      aviso.hidden = false; aviso.textContent = erro.message || "Não foi possível abrir o painel."; lista.hidden = true;
    });
})();
