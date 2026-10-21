(function () {
  var area = document.getElementById("qrs-avaliador");
  var botaoReservas = document.getElementById("mostrar-reservas");
  var raiz = (window.CONFIG.SITE_URL || (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, ""))).replace(/\/$/, "");
  var jurados = [
    { nome: "Jurado 01", token: "J01-MATA-8472" },
    { nome: "Jurado 02", token: "J02-RIO-3951" },
    { nome: "Jurado 03", token: "J03-SOL-6284" },
    { nome: "Jurado 04", token: "J04-VENTO-1746" },
    { nome: "Jurado 05", token: "J05-FOLHA-9325" },
    { nome: "Jurado 06", token: "J06-AGUA-5618" },
    { nome: "Jurado 07", token: "J07-TERRA-4063" },
    { nome: "Jurado 08", token: "J08-SEMENTE-7194" }
  ];

  function textoSeguro(texto) {
    var el = document.createElement("span"); el.textContent = texto; return el.innerHTML;
  }
  function cartao(jurado) {
    var link = raiz + "/painel-avaliador.html?token=" + encodeURIComponent(jurado.token);
    var imagem = "https://api.qrserver.com/v1/create-qr-code/?size=360x360&format=svg&data=" + encodeURIComponent(link);
    return '<article class="cartao-jurado"><p class="sobretitulo">Feira de Ciências 2026</p><h2>' + textoSeguro(jurado.nome) + '</h2><img src="' + imagem + '" width="360" height="360" alt="QR Code privado do ' + textoSeguro(jurado.nome) + '"><p>Leia este QR. Avalie os 13 projetos e acompanhe seu progresso.</p><small>Material reservado · não compartilhar com o público</small></article>';
  }
  function mostrar(quantidade) {
    area.innerHTML = jurados.slice(0, quantidade).map(cartao).join("");
  }
  mostrar(4);
  botaoReservas.addEventListener("click", function () {
    mostrar(jurados.length);
    botaoReservas.hidden = true;
  });
})();
