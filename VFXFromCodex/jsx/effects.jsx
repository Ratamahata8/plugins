/*
  VFX from codex ExtendScript
  - Builds a library of precompositions in the project
  - Inserts chosen effect into the active comp
  - Matches resolution and scales via expression
*/

var VFXFromCodex = (function () {
  var EFFECT_FOLDER_NAME = "VFX from codex Effects";

  var effectDefinitions = {
    explosion_burst: {
      name: "Burst Explosion",
      duration: 2.0,
      loop: false,
      creator: createExplosionBurst,
    },
    fire_smoke: {
      name: "Ember Smoke",
      duration: 4.0,
      loop: true,
      creator: createFireSmoke,
    },
    electric_arc: {
      name: "Electric Arc",
      duration: 3.0,
      loop: true,
      creator: createElectricArc,
    },
    placeholder_water: {
      name: "Splash Pulse",
      duration: 2.0,
      loop: false,
      creator: createPlaceholder,
    },
    placeholder_snow: {
      name: "Snow Drift",
      duration: 4.0,
      loop: true,
      creator: createPlaceholder,
    },
    placeholder_magic: {
      name: "Mystic Bloom",
      duration: 3.5,
      loop: true,
      creator: createPlaceholder,
    },
    placeholder_particles: {
      name: "Particle Swirl",
      duration: 4.0,
      loop: true,
      creator: createPlaceholder,
    },
    placeholder_light: {
      name: "Glow Sweep",
      duration: 2.5,
      loop: false,
      creator: createPlaceholder,
    },
    placeholder_glitch: {
      name: "Digital Glitch",
      duration: 3.0,
      loop: true,
      creator: createPlaceholder,
    },
    placeholder_abstract: {
      name: "Abstract Rings",
      duration: 4.0,
      loop: true,
      creator: createPlaceholder,
    },
    placeholder_ui: {
      name: "HUD Target",
      duration: 4.0,
      loop: true,
      creator: createPlaceholder,
    },
  };

  function getActiveComp() {
    if (app.project && app.project.activeItem instanceof CompItem) {
      return app.project.activeItem;
    }
    return null;
  }

  function getEffectsFolder() {
    var project = app.project;
    if (!project) {
      app.newProject();
      project = app.project;
    }

    for (var i = 1; i <= project.rootFolder.numItems; i++) {
      var item = project.rootFolder.item(i);
      if (item instanceof FolderItem && item.name === EFFECT_FOLDER_NAME) {
        return item;
      }
    }

    return project.items.addFolder(EFFECT_FOLDER_NAME);
  }

  function findPrecomp(folder, name) {
    for (var i = 1; i <= folder.numItems; i++) {
      var item = folder.item(i);
      if (item instanceof CompItem && item.name === name) {
        return item;
      }
    }
    return null;
  }

  function buildPrecomp(effectId, width, height) {
    var definition = effectDefinitions[effectId];
    if (!definition) {
      return null;
    }

    var folder = getEffectsFolder();
    var compName = "VFX - " + definition.name;
    var existing = findPrecomp(folder, compName);
    if (existing) {
      return existing;
    }

    var comp = app.project.items.addComp(
      compName,
      width,
      height,
      1.0,
      definition.duration,
      30
    );
    comp.parentFolder = folder;

    definition.creator(comp);

    return comp;
  }

  function createExplosionBurst(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Explosion Core";

    var contents = layer.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 0.35, 0.1]);

    var transform = layer.property("ADBE Transform Group");
    transform.property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);

    var scale = transform.property("ADBE Scale");
    scale.setValueAtTime(0, [0, 0]);
    scale.setValueAtTime(0.6, [160, 160]);
    scale.setValueAtTime(1.2, [260, 260]);

    var opacity = transform.property("ADBE Opacity");
    opacity.setValueAtTime(0, 100);
    opacity.setValueAtTime(1.2, 0);

    var glowLayer = comp.layers.addSolid([1, 0.7, 0.2], "Glow", comp.width, comp.height, 1);
    glowLayer.blendingMode = BlendingMode.ADD;
    glowLayer.moveAfter(layer);
    glowLayer.property("ADBE Transform Group").property("ADBE Opacity").setValue(40);
    glowLayer.property("ADBE Transform Group").property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
    glowLayer.Effects.addProperty("ADBE Gaussian Blur 2").property("ADBE Blurriness").setValue(120);
  }

  function createFireSmoke(comp) {
    var fireLayer = comp.layers.addSolid([1, 0.4, 0.1], "Fire Field", comp.width, comp.height, 1);
    var noise = fireLayer.Effects.addProperty("ADBE Fractal Noise");
    noise.property("ADBE Fractal Noise-0002").setValue(6); // Contrast
    noise.property("ADBE Fractal Noise-0003").setValue(120); // Brightness
    noise.property("ADBE Fractal Noise-0004").setValue([comp.width / 2, comp.height]);

    var evol = noise.property("ADBE Fractal Noise-0012");
    evol.expression = "time * 120";

    var turb = fireLayer.Effects.addProperty("ADBE Turbulent Displace");
    turb.property("ADBE Turbulent Displace-0002").setValue(80);
    turb.property("ADBE Turbulent Displace-0003").setValue(60);

    var blur = fireLayer.Effects.addProperty("ADBE Gaussian Blur 2");
    blur.property("ADBE Blurriness").setValue(40);

    fireLayer.blendingMode = BlendingMode.SCREEN;
  }

  function createElectricArc(comp) {
    var arcLayer = comp.layers.addSolid([0.3, 0.6, 1], "Electric Arc", comp.width, comp.height, 1);
    var noise = arcLayer.Effects.addProperty("ADBE Fractal Noise");
    noise.property("ADBE Fractal Noise-0002").setValue(250);
    noise.property("ADBE Fractal Noise-0003").setValue(-30);
    noise.property("ADBE Fractal Noise-0004").setValue([comp.width / 2, comp.height / 2]);
    noise.property("ADBE Fractal Noise-0012").expression = "time * 240";

    var edges = arcLayer.Effects.addProperty("ADBE Find Edges");
    edges.property("ADBE Find Edges-0002").setValue(true);

    var glow = arcLayer.Effects.addProperty("ADBE Glow");
    glow.property("ADBE Glow-0002").setValue(0.6);
    glow.property("ADBE Glow-0003").setValue(60);
    glow.property("ADBE Glow-0004").setValue(2.0);

    arcLayer.blendingMode = BlendingMode.ADD;
  }

  function createPlaceholder(comp) {
    var layer = comp.layers.addShape();
    layer.name = "Placeholder FX";
    var contents = layer.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    var stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0.5, 0.8, 1]);
    stroke.property("ADBE Vector Stroke Width").setValue(8);

    var transform = layer.property("ADBE Transform Group");
    transform.property("ADBE Position").setValue([comp.width / 2, comp.height / 2]);
    transform.property("ADBE Scale").expression = "[100 + Math.sin(time * 2) * 10, 100 + Math.sin(time * 2) * 10]";
  }

  function insertEffect(effectId) {
    app.beginUndoGroup("Insert VFX from codex");

    var activeComp = getActiveComp();
    if (!activeComp) {
      app.endUndoGroup();
      return "ERROR: Please select an active composition before inserting VFX.";
    }

    var definition = effectDefinitions[effectId];
    if (!definition) {
      app.endUndoGroup();
      return "ERROR: Effect not found.";
    }

    var precomp = buildPrecomp(effectId, activeComp.width, activeComp.height);
    if (!precomp) {
      app.endUndoGroup();
      return "ERROR: Unable to build effect comp.";
    }

    var layer = activeComp.layers.add(precomp);
    var insertionTime = activeComp.time - precomp.duration / 2;
    layer.startTime = insertionTime;
    layer.inPoint = insertionTime;

    if (definition.loop) {
      layer.outPoint = activeComp.duration;
    } else {
      layer.outPoint = insertionTime + precomp.duration;
    }

    layer.transform.position.setValue([activeComp.width / 2, activeComp.height / 2]);
    layer.transform.scale.expression = "[thisComp.width/thisLayer.source.width*100, thisComp.height/thisLayer.source.height*100]";

    if (definition.loop) {
      layer.timeRemapEnabled = true;
      layer.timeRemap.expression = "loopOut('cycle')";
    }

    app.endUndoGroup();
    return "Inserted: " + definition.name;
  }

  return {
    insertEffect: insertEffect,
  };
})();
