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

  document.querySelectorAll(".escala").forEach(function (el) {
    var campo = el.dataset.campo;
    el.innerHTML = [1, 2, 3, 4, 5].map(function (nota) {
      var inputId = campo + "-" + nota;
      return '<input required type="radio" name="' + campo + '" id="' + inputId + '" value="' + nota + '"><label for="' + inputId + '">' + nota + '</label>';
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
  if (localStorage.getItem(chave)) {
    mostrar("Esta avaliação já foi registrada neste dispositivo.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var dados = new URLSearchParams();
    dados.append("tipo", "avaliacao");
    dados.append("token", token);
    dados.append("projeto", String(P.id));
    dados.append("turma", P.turma);
    dados.append("cientifico", form.cientifico.value);
    dados.append("inovacao", form.inovacao.value);
    dados.append("apresentacao", form.apresentacao.value);
    dados.append("comentario", form.comentario.value.trim());
    var botao = form.querySelector("button");
    botao.disabled = true;
    fetch(C.API_URL, { method: "POST", mode: "no-cors", body: dados })
      .then(function () {
        localStorage.setItem(chave, "1");
        mostrar("Avaliação registrada. Obrigado pela contribuição à comissão.");
      })
      .catch(function () {
        botao.disabled = false;
        aviso.hidden = false;
        aviso.textContent = "Não foi possível enviar. Verifique a internet e tente novamente.";
      });
  });
})();
