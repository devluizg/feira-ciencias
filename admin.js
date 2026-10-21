(function () {
  var form = document.getElementById("acesso-admin");
  var chave = document.getElementById("chave-admin");
  var aviso = document.getElementById("aviso-admin");
  var conteudo = document.getElementById("conteudo-admin");
  var chaveAtual = "";
  var painelAberto = false;
  var emCarregamento = false;
  function seguro(texto) { var el = document.createElement("span"); el.textContent = texto; return el.innerHTML; }
  function carregar() {
    if (emCarregamento || !chaveAtual) return;
    emCarregamento = true;
    aviso.hidden = true;
    FEIRA_API.jsonp({ acao: "admin", chave: chaveAtual }, "painelAdmin")
      .then(function (dados) {
        if (!dados.ok) throw new Error(dados.erro || "Acesso negado");
        form.hidden = true; conteudo.hidden = false;
        document.getElementById("hora-admin").textContent = "Atualizado às " + new Date(dados.atualizadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + " · automático a cada 30 s";
        document.getElementById("resumo-admin").innerHTML = '<article><strong>' + dados.totalAvaliacoes + '</strong><span>avaliações técnicas</span></article><article><strong>' + dados.totalPublico + '</strong><span>votos do público</span></article><article><strong>' + dados.juradosAtivos + '</strong><span>jurados ativos</span></article><article><strong>' + dados.projetosCompletos + '/' + dados.projetos.length + '</strong><span>projetos completos</span></article>';
        document.getElementById("tabela-ranking-admin").innerHTML = dados.projetos.map(function (p, i) {
          return '<tr class="' + (p.completo ? "" : "incompleto") + '"><td>' + (i + 1) + '</td><td><b>Turma ' + p.turma + '</b><span>' + seguro(p.tema) + '</span></td><td>' + p.mediaAvaliadores.toFixed(2) + '</td><td>' + p.votosAvaliadores + (p.completo ? "" : " ⚠") + '</td><td>' + p.mediaPublico.toFixed(2) + '</td><td>' + p.votosPublico + '</td></tr>';
        }).join("");
        document.getElementById("grade-jurados").innerHTML = dados.jurados.map(function (j) {
          return '<article class="' + (j.concluidos === dados.projetos.length ? "completo" : "") + '"><b>' + seguro(j.nome) + '</b><span>' + j.concluidos + ' de ' + dados.projetos.length + ' projetos</span><div class="barra-progresso"><i style="width:' + (j.concluidos / dados.projetos.length * 100) + '%"></i></div></article>';
        }).join("");
        if (!painelAberto) {
          painelAberto = true;
          window.setInterval(carregar, 30000);
        }
      })
      .catch(function (erro) { aviso.hidden = false; aviso.textContent = erro.message || "Não foi possível carregar o painel."; })
      .then(function () { emCarregamento = false; });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); chaveAtual = chave.value.trim(); if (chaveAtual) carregar(); });
  document.getElementById("atualizar-admin").addEventListener("click", carregar);
})();
