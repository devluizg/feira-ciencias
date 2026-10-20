(function () {
  var raiz = (window.CONFIG.SITE_URL || (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, ""))).replace(/\/$/, "");
  var grupos = window.PROJETOS.reduce(function (todos, projeto) {
    (todos[projeto.turma] = todos[projeto.turma] || []).push(projeto);
    return todos;
  }, {});
  var area = document.getElementById("qrs");
  area.innerHTML = Object.keys(grupos).map(function (turma) {
    return '<section class="grupo-qr"><h2>Turma ' + turma + '</h2><div class="grade-qr">' + grupos[turma].map(function (p) {
      var link = raiz + "/projeto.html?id=" + encodeURIComponent(p.id);
      var imagem = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&format=svg&data=" + encodeURIComponent(link);
      return '<article class="cartao-qr"><img src="' + imagem + '" width="220" height="220" alt="QR Code do projeto ' + p.tema + '"><div><span>Turma ' + p.turma + ' · Projeto ' + p.numero + '</span><h3>' + p.tema + '</h3><p>Leia o QR Code e vote neste projeto.</p><code>' + link + '</code></div></article>';
    }).join("") + '</div></section>';
  }).join("");
})();
