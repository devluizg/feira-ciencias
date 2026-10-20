(function () {
  var id = Number(document.body.dataset.id);
  var C = window.CONFIG, P = window.PROJETOS.find(function (p) { return p.id === id; });
  document.title = P.turma + ": " + P.tema;
  document.getElementById("turma").textContent = P.turma;
  document.getElementById("tema").textContent = P.tema;
  document.getElementById("resumo").textContent = P.resumo;
  var form = document.getElementById("voto"), aviso = document.getElementById("aviso");
  var chave = "votou-turma-" + id;
  function agradecer() {
    form.hidden = true;
    aviso.hidden = false;
    aviso.textContent = "Obrigado! Sua nota para a " + P.turma + " foi registrada.";
  }
  if (localStorage.getItem(chave)) { agradecer(); return; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nota = form.nota.value;
    if (!nota) { aviso.hidden = false; aviso.textContent = "Escolha de 1 a 5 estrelas."; return; }
    var dados = new URLSearchParams();
    dados.append(C.ENTRY_TURMA, P.turma);
    dados.append(C.ENTRY_NOTA, nota);
    dados.append(C.ENTRY_NOME, form.nome.value.trim());
    dados.append(C.ENTRY_COMENTARIO, form.comentario.value.trim());
    var botao = form.querySelector("button"); botao.disabled = true;
    fetch(C.FORM_ACTION, { method: "POST", mode: "no-cors", body: dados })
      .then(function () { localStorage.setItem(chave, "1"); agradecer(); })
      .catch(function () { botao.disabled = false; aviso.hidden = false; aviso.textContent = "Não foi possível enviar. Verifique a internet e tente de novo."; });
  });
})();
