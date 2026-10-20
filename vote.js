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
  var form = document.getElementById("voto"), aviso = document.getElementById("aviso");
  var chave = "votou-turma-" + id;
  function agradecer() {
    form.hidden = true;
    aviso.hidden = false;
    aviso.textContent = "Obrigado! Sua nota para o projeto da Turma " + P.turma + " foi registrada.";
  }
  if (localStorage.getItem(chave)) { agradecer(); return; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nota = form.nota.value;
    if (!nota) { aviso.hidden = false; aviso.textContent = "Escolha de 1 a 5 estrelas."; return; }
    var dados = new URLSearchParams();
    var destino = C.API_URL || C.FORM_ACTION;
    if (C.API_URL) {
      dados.append("tipo", "publico");
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
    fetch(destino, { method: "POST", mode: "no-cors", body: dados })
      .then(function () { localStorage.setItem(chave, "1"); agradecer(); })
      .catch(function () { botao.disabled = false; aviso.hidden = false; aviso.textContent = "Não foi possível enviar. Verifique a internet e tente de novo."; });
  });
})();
