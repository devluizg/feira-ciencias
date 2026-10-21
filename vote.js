(function () {
  var params = new URLSearchParams(window.location.search);
  var id = document.body.dataset.id || params.get("id");
  var legados = { "1": "101-1", "2": "102-1", "3": "103-1", "4": "104-1", "5": "201-1", "6": "202-1", "7": "203-1", "8": "204-1" };
  id = legados[id] || id;
  var C = window.CONFIG, P = window.PROJETOS.find(function (p) { return p.id === id; });
  if (!P) { document.body.innerHTML = "<main><p>Projeto não encontrado.</p></main>"; return; }
  document.title = P.turma + ": " + P.tema;
  document.getElementById("turma").textContent = "Turma " + P.turma + " · Projeto " + P.numero;
  document.getElementById("tema").textContent = P.tema;
  document.getElementById("resumo").textContent = P.resumo;
  var orientadores = document.getElementById("orientadores");
  if (orientadores) orientadores.textContent = "Orientação: " + P.orientadores;
  var arquivoBanner = "imagens/" + P.id + "-banner.png";
  var banner = new Image();
  banner.onload = function () {
    var topo = document.querySelector(".pagina-projeto .topo");
    topo.style.setProperty("--imagem-projeto", 'url("' + arquivoBanner + '")');
    topo.classList.add("tem-imagem");
  };
  banner.src = arquivoBanner;
  var form = document.getElementById("voto"), aviso = document.getElementById("aviso");
  var chave = "votou-turma-" + id;
  var registro = localStorage.getItem(chave + "-registro") || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : "pub-" + Date.now() + "-" + Math.random().toString(36).slice(2));
  localStorage.setItem(chave + "-registro", registro);
  function agradecer() {
    form.hidden = true;
    aviso.hidden = false;
    aviso.textContent = "Obrigado! Sua nota para o projeto da Turma " + P.turma + " foi registrada.";
  }
  if (localStorage.getItem(chave)) { agradecer(); return; }
  function confirmar(tentativa) {
    return FEIRA_API.jsonp({ acao: "confirmarPublico", registro: registro }, "confirmarPublico").then(function (dados) {
      if (dados.ok && dados.registrado) return true;
      if (tentativa >= 5) throw new Error("Registro ainda não confirmado");
      return new Promise(function (resolve) { setTimeout(resolve, 700); }).then(function () { return confirmar(tentativa + 1); });
    });
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nota = form.nota.value;
    if (!nota) { aviso.hidden = false; aviso.textContent = "Escolha de 1 a 5 estrelas."; return; }
    var dados = new URLSearchParams();
    var destino = C.API_URL || C.FORM_ACTION;
    if (C.API_URL) {
      dados.append("tipo", "publico");
      dados.append("registro", registro);
      dados.append("projeto", String(P.id));
      dados.append("turma", P.turma);
      dados.append("nota", nota);
      dados.append("nome", form.nome.value.trim());
      dados.append("comentario", form.comentario.value.trim());
    } else {
      dados.append(C.ENTRY_TURMA, P.turma);
      dados.append(C.ENTRY_NOTA, nota);
      dados.append(C.ENTRY_NOME, form.nome.value.trim());
      dados.append(C.ENTRY_COMENTARIO, form.comentario.value.trim());
    }
    var botao = form.querySelector("button"); botao.disabled = true;
    aviso.hidden = false; aviso.textContent = C.API_URL ? "Enviando e confirmando seu voto…" : "Enviando seu voto…";
    fetch(destino, { method: "POST", mode: "no-cors", body: dados })
      .then(function () { return C.API_URL ? confirmar(0) : true; })
      .then(function () { localStorage.setItem(chave, "1"); localStorage.setItem(chave + "-registro", registro); agradecer(); })
      .catch(function () { botao.disabled = false; aviso.hidden = false; aviso.textContent = "Não foi possível enviar. Verifique a internet e tente de novo."; });
  });
})();
