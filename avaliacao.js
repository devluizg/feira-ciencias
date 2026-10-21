(function () {
  var params = new URLSearchParams(window.location.search);
  var id = document.body.dataset.id || params.get("projeto");
  var legados = { "1": "101-1", "4": "104-1" };
  id = legados[id] || id;
  var P = window.PROJETOS.find(function (p) { return p.id === id; });
  var C = window.CONFIG;
  var token = params.get("token") || "";
  var form = document.getElementById("avaliacao");
  var aviso = document.getElementById("aviso");
  var chave = "avaliou-" + id + "-" + token;

  if (!P) { document.body.innerHTML = "<main><p>Projeto não encontrado.</p></main>"; return; }
  document.title = "Avaliação | Turma " + P.turma;
  document.getElementById("turma").textContent = "Turma " + P.turma + " · Projeto " + P.numero;
  document.getElementById("tema").textContent = P.tema;
  document.getElementById("resumo").textContent = P.resumo;
  document.getElementById("orientadores").textContent = "Orientação: " + P.orientadores;
  var arquivoBanner = "imagens/" + P.id + "-banner.png";
  var banner = new Image();
  banner.onload = function () {
    var topo = document.querySelector(".pagina-avaliacao .topo");
    topo.style.setProperty("--imagem-projeto", 'url("' + arquivoBanner + '")');
    topo.classList.add("tem-imagem");
  };
  banner.src = arquivoBanner;

  document.querySelectorAll(".escala").forEach(function (el) {
    var campo = el.dataset.campo;
    el.innerHTML = [3, 3.5, 4, 4.5, 5].map(function (nota) {
      var inputId = campo + "-" + nota;
      return '<input required type="radio" name="' + campo + '" id="' + inputId + '" value="' + nota + '"><label for="' + inputId + '">' + String(nota).replace(".", ",") + '</label>';
    }).join("");
  });

  function mostrar(mensagem) {
    form.hidden = true;
    aviso.hidden = false;
    aviso.textContent = mensagem;
  }

  if (!C.API_URL) {
    mostrar("A avaliação ainda não está configurada. Peça à organização para publicar o endereço do sistema de votos.");
    return;
  }
  if (!token) {
    mostrar("Este não é um link de avaliador válido. Use o QR Code entregue pela organização.");
    return;
  }
  function confirmar(tentativa) {
    return FEIRA_API.jsonp({ acao: "status", token: token }, "confirmarAvaliacao").then(function (dados) {
      if (dados.ok && dados.concluidos.indexOf(P.id) !== -1) return true;
      if (tentativa >= 5) throw new Error("A planilha ainda não confirmou o registro.");
      return new Promise(function (resolve) { setTimeout(resolve, 700); }).then(function () { return confirmar(tentativa + 1); });
    });
  }
  var botaoEnviar = form.querySelector("button"); botaoEnviar.disabled = true;
  FEIRA_API.jsonp({ acao: "status", token: token }, "verificarAvaliacao").then(function (dados) {
    if (!dados.ok) { mostrar(dados.erro || "Código de jurado inválido."); return; }
    if (dados.concluidos.indexOf(P.id) !== -1) { mostrar("Esta avaliação já está registrada. Volte ao painel para continuar o roteiro."); return; }
    botaoEnviar.disabled = false;
  }).catch(function () { mostrar("Não foi possível validar o código do jurado. Verifique a internet e tente novamente."); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dados = new URLSearchParams();
    dados.append("tipo", "avaliacao");
    dados.append("token", token);
    dados.append("projeto", String(P.id));
    dados.append("turma", P.turma);
    dados.append("dominio", form.dominio.value);
    dados.append("clareza", form.clareza.value);
    dados.append("reciclado", form.reciclado.value);
    dados.append("ficha_projeto", form.ficha_projeto.checked ? "1" : "0");
    dados.append("ficha_turma", form.ficha_turma.checked ? "1" : "0");
    dados.append("ficha_conceito", form.ficha_conceito.checked ? "1" : "0");
    dados.append("ficha_material", form.ficha_material.checked ? "1" : "0");
    dados.append("ficha_impacto", form.ficha_impacto.checked ? "1" : "0");
    dados.append("comentario", form.comentario.value.trim());
    var botao = form.querySelector("button");
    botao.disabled = true;
    aviso.hidden = false; aviso.textContent = "Enviando e confirmando na planilha…";
    fetch(C.API_URL, { method: "POST", mode: "no-cors", body: dados })
      .then(function () { return confirmar(0); })
      .then(function () {
        localStorage.setItem(chave, "1");
        form.hidden = true; aviso.hidden = false;
        aviso.innerHTML = 'Avaliação salva na planilha. <a href="painel-avaliador.html?token=' + encodeURIComponent(token) + '">Voltar ao painel do jurado</a>.';
      })
      .catch(function () {
        botao.disabled = false;
        aviso.hidden = false;
        aviso.textContent = "Não foi possível confirmar o registro. Verifique a internet e tente novamente; não feche a página até aparecer a confirmação.";
      });
  });
})();
