(function () {
  var params = new URLSearchParams(window.location.search);
  var campo = document.getElementById("token");
  var form = document.getElementById("form-codigo");
  var area = document.getElementById("qrs-avaliador");
  var botaoImprimir = document.getElementById("imprimir");
  var raiz = (window.CONFIG.SITE_URL || (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, ""))).replace(/\/$/, "");
  campo.value = params.get("token") || "";

  function textoSeguro(texto) {
    var el = document.createElement("span"); el.textContent = texto; return el.innerHTML;
  }
  function montar(token) {
    var grupos = window.PROJETOS.reduce(function (todos, projeto) {
      (todos[projeto.turma] = todos[projeto.turma] || []).push(projeto); return todos;
    }, {});
    area.innerHTML = '<p class="aviso aviso-codigo">Conjunto reservado para o código <b>' + textoSeguro(token) + '</b>. Entregue estas folhas somente a esta pessoa avaliadora.</p>' + Object.keys(grupos).map(function (turma) {
      return '<section class="grupo-qr"><h2>Turma ' + turma + '</h2><div class="grade-qr">' + grupos[turma].map(function (p) {
        var link = raiz + "/avaliador.html?projeto=" + encodeURIComponent(p.id) + "&token=" + encodeURIComponent(token);
        var imagem = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=" + encodeURIComponent(link);
        return '<article class="cartao-qr avaliador-qr"><img src="' + imagem + '" width="220" height="220" alt="QR Code de avaliação para ' + textoSeguro(p.tema) + '"><div><span>Turma ' + p.turma + ' · Projeto ' + p.numero + '</span><h3>' + textoSeguro(p.tema) + '</h3><p>Avaliação técnica · 3 critérios</p><code>' + textoSeguro(link) + '</code></div></article>';
      }).join("") + '</div></section>';
    }).join("");
    botaoImprimir.hidden = false;
  }
  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var token = campo.value.trim();
    if (!token) return;
    var url = new URL(window.location.href); url.searchParams.set("token", token); window.history.replaceState({}, "", url);
    montar(token);
  });
  if (campo.value.trim()) montar(campo.value.trim());
})();
