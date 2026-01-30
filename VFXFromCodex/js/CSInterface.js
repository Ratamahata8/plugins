/* Minimal CSInterface shim for CEP panels.
   In production, Adobe's CSInterface.js provides additional APIs.
*/
(function (global) {
  function CSInterface() {}

  CSInterface.prototype.evalScript = function (script, callback) {
    if (typeof window.__adobe_cep__ !== "undefined") {
      window.__adobe_cep__.evalScript(script, callback || function () {});
      return;
    }

    if (callback) {
      callback("CEP bridge not available");
    }
  };

  global.CSInterface = CSInterface;
})(this);
