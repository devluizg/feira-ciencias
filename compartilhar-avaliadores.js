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
    var link = raiz + "/painel-avaliador.html?token=" + encodeURIComponent(token);
    var imagem = "https://api.qrserver.com/v1/create-qr-code/?size=360x360&format=svg&data=" + encodeURIComponent(link);
    area.innerHTML = '<article class="cartao-jurado"><p class="sobretitulo">Feira de Ciências 2026</p><h2>Cartão do jurado</h2><img src="' + imagem + '" width="360" height="360" alt="QR Code privado do jurado"><b>Código ' + textoSeguro(token) + '</b><p>Leia este QR uma vez. No painel, escolha cada projeto, avalie os três critérios e acompanhe seu progresso.</p><small>Material reservado · não compartilhar com o público</small></article>';
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
