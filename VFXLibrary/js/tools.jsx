/* Utility helpers for creating VFX precomps */
var VFXTools = (function () {
  function getActiveComp() {
    if (app.project && app.project.activeItem && app.project.activeItem instanceof CompItem) {
      return app.project.activeItem;
    }
    return null;
  }

  function createPrecomp(name, width, height, duration, frameRate) {
    return app.project.items.addComp(name, width, height, 1, duration, frameRate);
  }

  function centerLayer(layer, comp) {
    layer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
  }

  function enableLoop(layer) {
    layer.timeRemapEnabled = true;
    var remap = layer.property("ADBE Time Remapping");
    if (remap.numKeys > 1) {
      remap.removeKey(remap.numKeys);
    }
    remap.expression = "loopOut('cycle')";
  }

  function addGlow(layer, intensity) {
    var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Glow");
    fx.property("ADBE Glow-0002").setValue(intensity || 0.7);
  }

  return {
    getActiveComp: getActiveComp,
    createPrecomp: createPrecomp,
    centerLayer: centerLayer,
    enableLoop: enableLoop,
    addGlow: addGlow,
  };
})();
