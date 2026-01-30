/*
  VFXLibrary ExtendScript host
  - Receives JSON payload from main.js
  - Creates a precomp with shape layers / native effects / particles
  - Inserts precomp into the active comp, centers it, and auto-fits scale
*/

var VFXLibrary = VFXLibrary || {};

(function () {
  var DEFAULT_LOOP_DURATION = 3.0;
  var DEFAULT_ONE_SHOT_DURATION = 2.0;

  VFXLibrary.addEffect = function (payload) {
    app.beginUndoGroup("Add VFX Library Effect");

    try {
      var effect = typeof payload === "string" ? JSON.parse(payload) : payload;
      var parentComp = app.project.activeItem;

      if (!(parentComp instanceof CompItem)) {
        return "No active composition. Please select a comp.";
      }

      var effectComp = buildEffectComp(effect, parentComp);
      if (!effectComp) {
        return "Effect generator failed.";
      }

      // Insert precomp into parent comp
      var layer = parentComp.layers.add(effectComp);
      layer.startTime = parentComp.time;
      layer.moveToBeginning();

      // Center layer and auto-fit scale (expression-based)
      layer.property("Position").setValue([parentComp.width / 2, parentComp.height / 2]);
      layer.property("Anchor Point").setValue([effectComp.width / 2, effectComp.height / 2]);
      layer.property("Scale").expression =
        "s = Math.min(thisComp.width / thisLayer.source.width, thisComp.height / thisLayer.source.height) * 100;\n" +
        "[s, s];";

      // Preserve alpha by default (precomp is created with transparent background)
      layer.blendingMode = BlendingMode.NORMAL;

      return "Imported: " + effect.name;
    } catch (err) {
      return "Error: " + err.toString();
    } finally {
      app.endUndoGroup();
    }
  };

  function buildEffectComp(effect, parentComp) {
    var duration = effect.type === "loop" ? DEFAULT_LOOP_DURATION : DEFAULT_ONE_SHOT_DURATION;
    var compName = "VFX_" + effect.name;
    var comp = app.project.items.addComp(
      compName,
      parentComp.width,
      parentComp.height,
      parentComp.pixelAspect,
      duration,
      parentComp.frameRate
    );

    // Null Control Layer
    var controls = comp.layers.addNull();
    controls.name = "Controls";
    controls.label = 10;
    var scaleCtrl = controls.Effects.addProperty("ADBE Slider Control");
    scaleCtrl.name = "Global Scale";
    scaleCtrl.property("Slider").setValue(100);

    // Dispatch to specific generator
    switch (effect.id) {
      case "explosion_small":
        createExplosionSmall(comp, controls, duration);
        break;
      case "shockwave":
        createShockwave(comp, controls, duration);
        break;
      case "fire_loop":
        createFireLoop(comp, controls, duration);
        break;
      case "smoke_soft":
        createSoftSmoke(comp, controls, duration);
        break;
      case "water_splash":
        createWaterSplash(comp, controls, duration);
        break;
      case "rain_loop":
        createRain(comp, controls, duration);
        break;
      case "lightning_arc":
        createLightning(comp, controls, duration);
        break;
      case "magic_circle":
        createMagicCircle(comp, controls, duration);
        break;
      case "lens_flare":
        createLensFlare(comp, controls, duration);
        break;
      case "glitch_ui":
        createGlitch(comp, controls, duration);
        break;
      case "particles_float":
        createFloatingParticles(comp, controls, duration);
        break;
      case "abstract_wave":
        createAbstractWave(comp, controls, duration);
        break;
      case "transition_flash":
        createFlashTransition(comp, controls, duration);
        break;
      case "hud_scan":
        createHudScan(comp, controls, duration);
        break;
      default:
        createPlaceholder(comp, controls, duration, effect.name);
        break;
    }

    return comp;
  }

  // Example effect precomposition generator
  function createExplosionSmall(comp, controls, duration) {
    var burst = comp.layers.addShape();
    burst.name = "Explosion Burst";
    var group = burst.property("Contents").addProperty("ADBE Vector Group");
    var ellipse = group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("Size").setValue([200, 200]);
    var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fill.property("Color").setValue([1, 0.5, 0.1]);

    burst.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
    burst.property("Transform").property("Scale").expression =
      "value * (thisComp.layer('Controls').effect('Global Scale')('Slider') / 100);";

    burst.property("Transform").property("Scale").setValueAtTime(0, [0, 0]);
    burst.property("Transform").property("Scale").setValueAtTime(duration * 0.35, [100, 100]);
    burst.property("Transform").property("Scale").setValueAtTime(duration * 0.7, [130, 130]);
    burst.property("Transform").property("Opacity").setValueAtTime(0, 0);
    burst.property("Transform").property("Opacity").setValueAtTime(duration * 0.2, 100);
    burst.property("Transform").property("Opacity").setValueAtTime(duration * 0.8, 0);

    var glow = burst.Effects.addProperty("ADBE Glow");
    glow.property("Glow Threshold").setValue(40);
    glow.property("Glow Radius").setValue(60);
    glow.property("Glow Intensity").setValue(1.4);

    var particles = comp.layers.addSolid([1, 0.7, 0.2], "Sparks", comp.width, comp.height, 1);
    var particleFx = particles.Effects.addProperty("CC Particle World");
    particleFx.property("Birth Rate").setValue(6);
    particleFx.property("Longevity").setValue(1.2);
    particleFx.property("Gravity").setValue(0.1);
    particleFx.property("Velocity").setValue(2.2);
    particleFx.property("Birth Size").setValue(0.1);
    particleFx.property("Death Size").setValue(0.0);
    particleFx.property("Producer").property("Position").setValue([0.5, 0.5, 0]);

    particles.blendingMode = BlendingMode.ADD;
    particles.property("Transform").property("Opacity").setValueAtTime(duration * 0.8, 0);
  }

  function createShockwave(comp, controls, duration) {
    var ring = comp.layers.addShape();
    ring.name = "Shockwave";
    var group = ring.property("Contents").addProperty("ADBE Vector Group");
    var ellipse = group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("Size").setValue([260, 260]);
    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0.8, 0.9, 1]);
    stroke.property("Stroke Width").setValue(6);

    ring.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
    ring.property("Transform").property("Scale").setValueAtTime(0, [10, 10]);
    ring.property("Transform").property("Scale").setValueAtTime(duration * 0.7, [140, 140]);
    ring.property("Transform").property("Opacity").setValueAtTime(duration * 0.6, 40);
    ring.property("Transform").property("Opacity").setValueAtTime(duration, 0);
  }

  function createFireLoop(comp, controls, duration) {
    var fire = comp.layers.addSolid([1, 0.2, 0], "Fire Matte", comp.width, comp.height, 1);
    var fractal = fire.Effects.addProperty("ADBE Fractal Noise");
    fractal.property("Contrast").setValue(200);
    fractal.property("Brightness").setValue(60);
    fractal.property("Evolution").expression = "time * 220";

    var turbulent = fire.Effects.addProperty("ADBE Turbulent Displace");
    turbulent.property("Amount").setValue(80);
    turbulent.property("Size").setValue(50);

    var tint = fire.Effects.addProperty("ADBE Tint");
    tint.property("Map Black To").setValue([0.8, 0.1, 0]);
    tint.property("Map White To").setValue([1, 0.8, 0.2]);

    fire.blendingMode = BlendingMode.ADD;
    fire.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
  }

  function createSoftSmoke(comp, controls, duration) {
    var smoke = comp.layers.addSolid([0.9, 0.9, 0.9], "Smoke", comp.width, comp.height, 1);
    var fractal = smoke.Effects.addProperty("ADBE Fractal Noise");
    fractal.property("Contrast").setValue(120);
    fractal.property("Brightness").setValue(-20);
    fractal.property("Evolution").expression = "time * 120";
    var blur = smoke.Effects.addProperty("ADBE Gaussian Blur 2");
    blur.property("Blurriness").setValue(40);
    smoke.property("Transform").property("Opacity").setValue(70);
  }

  function createWaterSplash(comp, controls, duration) {
    var splash = comp.layers.addShape();
    splash.name = "Splash";
    var group = splash.property("Contents").addProperty("ADBE Vector Group");
    var ellipse = group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("Size").setValue([220, 160]);
    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0.4, 0.7, 1]);
    stroke.property("Stroke Width").setValue(8);

    splash.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
    splash.property("Transform").property("Scale").setValueAtTime(0, [10, 10]);
    splash.property("Transform").property("Scale").setValueAtTime(duration * 0.6, [120, 100]);
    splash.property("Transform").property("Opacity").setValueAtTime(duration * 0.7, 0);
  }

  function createRain(comp, controls, duration) {
    var rain = comp.layers.addSolid([0.6, 0.8, 1], "Rain", comp.width, comp.height, 1);
    var particleFx = rain.Effects.addProperty("CC Particle World");
    particleFx.property("Birth Rate").setValue(12);
    particleFx.property("Longevity").setValue(duration);
    particleFx.property("Velocity").setValue(3.0);
    particleFx.property("Gravity").setValue(1.2);
    particleFx.property("Birth Size").setValue(0.03);
    particleFx.property("Death Size").setValue(0.03);
    particleFx.property("Producer").property("Position").setValue([0.5, 0.1, 0]);
    rain.property("Transform").property("Opacity").setValue(60);
  }

  function createLightning(comp, controls, duration) {
    var bolt = comp.layers.addShape();
    bolt.name = "Lightning";
    var group = bolt.property("Contents").addProperty("ADBE Vector Group");
    var path = group.property("Contents").addProperty("ADBE Vector Shape - Group");
    var shape = new Shape();
    shape.vertices = [
      [0, 0],
      [40, 60],
      [-30, 140],
      [30, 200],
    ];
    shape.closed = false;
    path.property("Path").setValue(shape);

    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0.6, 0.8, 1]);
    stroke.property("Stroke Width").setValue(6);

    bolt.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2 - 100]);
    bolt.property("Transform").property("Opacity").setValueAtTime(duration * 0.4, 0);

    var glow = bolt.Effects.addProperty("ADBE Glow");
    glow.property("Glow Radius").setValue(40);
  }

  function createMagicCircle(comp, controls, duration) {
    var circle = comp.layers.addShape();
    circle.name = "Magic Circle";
    var group = circle.property("Contents").addProperty("ADBE Vector Group");
    var ellipse = group.property("Contents").addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("Size").setValue([260, 260]);
    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0.5, 0.9, 1]);
    stroke.property("Stroke Width").setValue(4);
    var dash = stroke.property("Dashes").addProperty("ADBE Vector Stroke Dash 1");
    dash.setValue(10);

    circle.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
    circle.property("Transform").property("Rotation").expression = "time * 40";
  }

  function createLensFlare(comp, controls, duration) {
    var flare = comp.layers.addSolid([1, 1, 1], "Flare", comp.width, comp.height, 1);
    var lens = flare.Effects.addProperty("ADBE Lens Flare");
    lens.property("Flare Center").setValue([comp.width / 2, comp.height / 2]);
    flare.property("Transform").property("Opacity").setValueAtTime(0, 0);
    flare.property("Transform").property("Opacity").setValueAtTime(duration * 0.4, 100);
    flare.property("Transform").property("Opacity").setValueAtTime(duration, 0);
  }

  function createGlitch(comp, controls, duration) {
    var solid = comp.layers.addSolid([0.2, 0.9, 1], "Glitch", comp.width, comp.height, 1);
    var distort = solid.Effects.addProperty("ADBE Wave Warp");
    distort.property("Wave Height").setValue(40);
    distort.property("Wave Width").setValue(120);
    distort.property("Wave Speed").setValue(2);
    solid.property("Transform").property("Opacity").setValueAtTime(duration * 0.6, 0);
  }

  function createFloatingParticles(comp, controls, duration) {
    var particles = comp.layers.addSolid([0.8, 0.8, 1], "Particles", comp.width, comp.height, 1);
    var particleFx = particles.Effects.addProperty("CC Particle Systems II");
    particleFx.property("Birth Rate").setValue(1.5);
    particleFx.property("Longevity").setValue(duration);
    particleFx.property("Velocity").setValue(0.4);
    particleFx.property("Gravity").setValue(0);
    particles.property("Transform").property("Opacity").setValue(60);
  }

  function createAbstractWave(comp, controls, duration) {
    var wave = comp.layers.addSolid([0.5, 0.2, 1], "Wave", comp.width, comp.height, 1);
    var gradient = wave.Effects.addProperty("ADBE Ramp");
    gradient.property("Start of Ramp").setValue([comp.width * 0.2, comp.height * 0.2]);
    gradient.property("End of Ramp").setValue([comp.width * 0.8, comp.height * 0.8]);
    var waveWarp = wave.Effects.addProperty("ADBE Wave Warp");
    waveWarp.property("Wave Height").setValue(80);
    waveWarp.property("Wave Width").setValue(300);
    waveWarp.property("Wave Speed").setValue(0.5);
  }

  function createFlashTransition(comp, controls, duration) {
    var flash = comp.layers.addSolid([1, 1, 1], "Flash", comp.width, comp.height, 1);
    flash.property("Transform").property("Opacity").setValueAtTime(0, 0);
    flash.property("Transform").property("Opacity").setValueAtTime(duration * 0.2, 100);
    flash.property("Transform").property("Opacity").setValueAtTime(duration, 0);
  }

  function createHudScan(comp, controls, duration) {
    var hud = comp.layers.addShape();
    hud.name = "HUD";
    var group = hud.property("Contents").addProperty("ADBE Vector Group");
    var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.property("Size").setValue([260, 140]);
    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue([0.2, 1, 0.8]);
    stroke.property("Stroke Width").setValue(3);
    hud.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);

    var scan = comp.layers.addSolid([0.2, 1, 0.8], "Scanline", comp.width, 6, 1);
    scan.property("Transform").property("Position").setValue([comp.width / 2, comp.height * 0.3]);
    scan.property("Transform").property("Position").setValueAtTime(0, [comp.width / 2, comp.height * 0.3]);
    scan.property("Transform").property("Position").setValueAtTime(duration, [comp.width / 2, comp.height * 0.7]);
    scan.property("Transform").property("Opacity").setValue(60);
  }

  function createPlaceholder(comp, controls, duration, name) {
    var text = comp.layers.addText("Placeholder: " + name);
    text.property("Transform").property("Position").setValue([comp.width / 2, comp.height / 2]);
  }
})();
