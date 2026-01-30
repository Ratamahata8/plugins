/*
  Minimal CSInterface shim for documentation/testing outside of After Effects.
  In CEP hosts, the real CSInterface.js is provided by Adobe.
*/

if (typeof CSInterface === "undefined") {
  function CSInterface() {
    this.evalScript = function (_script, callback) {
      if (callback) {
        callback("CEP host unavailable in this environment.");
      }
    };
  }
}
