/* Minimal CSInterface stub for CEP panels.
 * In production, replace with Adobe's official CSInterface.js.
 */
(function () {
  "use strict";
  function CSInterface() {}
  CSInterface.prototype.evalScript = function (script, callback) {
    if (window.__adobe_cep__) {
      window.__adobe_cep__.evalScript(script, callback);
    } else {
      if (callback) {
        callback("CEP runtime not available.");
      }
    }
  };
  CSInterface.prototype.getSystemPath = function () {
    if (window.__adobe_cep__ && window.__adobe_cep__.getSystemPath) {
      return window.__adobe_cep__.getSystemPath(0);
    }
    return "";
  };
  window.SystemPath = {
    EXTENSION: 0,
  };
  window.CSInterface = CSInterface;
})();
