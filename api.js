(function () {
  var sequencia = 0;
  function jsonp(parametros, nome) {
    return new Promise(function (resolve, reject) {
      if (!window.CONFIG || !window.CONFIG.API_URL) {
        reject(new Error("API não configurada")); return;
      }
      var callback = (nome || "feiraCallback") + "_" + Date.now() + "_" + (++sequencia);
      var script = document.createElement("script");
      var timer;
      function limpar() {
        clearTimeout(timer); delete window[callback];
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[callback] = function (dados) { limpar(); resolve(dados); };
      parametros = Object.assign({}, parametros, { prefix: callback });
      script.src = window.CONFIG.API_URL + "?" + new URLSearchParams(parametros).toString();
      script.onerror = function () { limpar(); reject(new Error("Falha na consulta")); };
      timer = setTimeout(function () { limpar(); reject(new Error("Tempo esgotado")); }, 12000);
      document.head.appendChild(script);
    });
  }
  window.FEIRA_API = { jsonp: jsonp };
})();
