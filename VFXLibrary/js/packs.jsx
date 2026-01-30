/* Effect builders for each category */
var VFXPacks = (function () {
  function buildExplosion(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Explosion Core";
    var contents = shape.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([120, 120]);
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 0.5, 0.1]);
    VFXTools.addGlow(shape, 1.2);
    var scale = shape.property("ADBE Transform Group").property("ADBE Scale");
    scale.setValueAtTime(0, [10, 10]);
    scale.setValueAtTime(0.6, [220, 220]);
    var opacity = shape.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(0, 0);
    opacity.setValueAtTime(0.1, 100);
    opacity.setValueAtTime(0.6, 0);
  }

  function buildFireSmoke(comp) {
    var solid = comp.layers.addSolid([0.9, 0.4, 0.1], "Fire", comp.width, comp.height, 1);
    var turbulent = solid.property("ADBE Effect Parade").addProperty("ADBE Turbulent Displace");
    turbulent.property("ADBE Turbulent Displace-0003").setValue(80);
    turbulent.property("ADBE Turbulent Displace-0004").setValue(120);
    var tint = solid.property("ADBE Effect Parade").addProperty("ADBE Tint");
    tint.property("ADBE Tint-0002").setValue([1, 0.2, 0]);
    tint.property("ADBE Tint-0003").setValue([0.2, 0.2, 0.2]);
    solid.property("ADBE Transform Group").property("ADBE Opacity").setValue(70);
  }

  function buildWaterSplash(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Splash Ring";
    var contents = shape.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([80, 80]);
    var stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0.3, 0.7, 1]);
    stroke.property("ADBE Vector Stroke Width").setValue(8);
    var scale = shape.property("ADBE Transform Group").property("ADBE Scale");
    scale.setValueAtTime(0, [0, 0]);
    scale.setValueAtTime(0.8, [250, 250]);
    var opacity = shape.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(0, 100);
    opacity.setValueAtTime(0.8, 0);
  }

  function buildSnowWeather(comp) {
    var solid = comp.layers.addSolid([1, 1, 1], "Snow", comp.width, comp.height, 1);
    var snowFx = solid.property("ADBE Effect Parade").addProperty("CC Particle World");
    snowFx.property("CC Particle World-0004").setValue(0.2);
    snowFx.property("CC Particle World-0005").setValue(0.8);
    snowFx.property("CC Particle World-0006").setValue(0.2);
    solid.property("ADBE Transform Group").property("ADBE Opacity").setValue(80);
  }

  function buildElectricityEnergy(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Energy Bolt";
    var contents = shape.property("ADBE Root Vectors Group");
    var pathGroup = contents.addProperty("ADBE Vector Group");
    var path = pathGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
    var shapeData = new Shape();
    shapeData.vertices = [[-120, 0], [-40, -20], [0, 20], [60, -10], [120, 0]];
    shapeData.closed = false;
    path.property("ADBE Vector Shape").setValue(shapeData);
    var stroke = pathGroup.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0.2, 0.8, 1]);
    stroke.property("ADBE Vector Stroke Width").setValue(6);
    VFXTools.addGlow(shape, 1.5);
    var opacity = shape.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(0, 0);
    opacity.setValueAtTime(0.1, 100);
    opacity.setValueAtTime(0.5, 0);
  }

  function buildMagicFantasy(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Magic Sparkle";
    var contents = shape.property("ADBE Root Vectors Group");
    var star = contents.addProperty("ADBE Vector Shape - Star");
    star.property("ADBE Vector Star Points").setValue(6);
    star.property("ADBE Vector Star Outer Radius").setValue(60);
    star.property("ADBE Vector Star Inner Radius").setValue(20);
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([0.8, 0.4, 1]);
    VFXTools.addGlow(shape, 1.3);
    var rotation = shape.property("ADBE Transform Group").property("ADBE Rotation");
    rotation.setValueAtTime(0, 0);
    rotation.setValueAtTime(2, 360);
  }

  function buildParticles(comp) {
    var solid = comp.layers.addSolid([0.8, 0.8, 0.8], "Particles", comp.width, comp.height, 1);
    var fx = solid.property("ADBE Effect Parade").addProperty("CC Particle World");
    fx.property("CC Particle World-0004").setValue(0.4);
    fx.property("CC Particle World-0005").setValue(1.2);
    fx.property("CC Particle World-0006").setValue(0.4);
    solid.property("ADBE Transform Group").property("ADBE Opacity").setValue(70);
  }

  function buildLightGlow(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Glow Burst";
    var contents = shape.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([160, 160]);
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    VFXTools.addGlow(shape, 2.0);
    var opacity = shape.property("ADBE Transform Group").property("ADBE Opacity");
    opacity.setValueAtTime(0, 0);
    opacity.setValueAtTime(0.2, 100);
    opacity.setValueAtTime(1, 0);
  }

  function buildGlitchDigital(comp) {
    var solid = comp.layers.addSolid([0.1, 0.9, 0.8], "Glitch Bars", comp.width, comp.height, 1);
    var fx = solid.property("ADBE Effect Parade").addProperty("ADBE Displacement Map");
    fx.property("ADBE Displacement Map-0002").setValue(15);
    solid.property("ADBE Transform Group").property("ADBE Opacity").setValue(60);
  }

  function buildAbstractShapes(comp) {
    var shape = comp.layers.addShape();
    shape.name = "Abstract Shapes";
    var contents = shape.property("ADBE Root Vectors Group");
    var rect = contents.addProperty("ADBE Vector Shape - Rect");
    rect.property("ADBE Vector Rect Size").setValue([200, 120]);
    var fill = contents.addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([0.2, 0.9, 0.6]);
    var rotation = shape.property("ADBE Transform Group").property("ADBE Rotation");
    rotation.setValueAtTime(0, 0);
    rotation.setValueAtTime(1.5, 45);
  }

  function buildHud(comp) {
    var shape = comp.layers.addShape();
    shape.name = "HUD Ring";
    var contents = shape.property("ADBE Root Vectors Group");
    var ellipse = contents.addProperty("ADBE Vector Shape - Ellipse");
    ellipse.property("ADBE Vector Ellipse Size").setValue([180, 180]);
    var stroke = contents.addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Color").setValue([0.1, 0.9, 1]);
    stroke.property("ADBE Vector Stroke Width").setValue(4);
    var dashes = stroke.property("ADBE Vector Stroke Dashes");
    dashes.addProperty("ADBE Vector Stroke Dash 1").setValue(12);
    dashes.addProperty("ADBE Vector Stroke Gap 1").setValue(8);
    var rotation = shape.property("ADBE Transform Group").property("ADBE Rotation");
    rotation.setValueAtTime(0, 0);
    rotation.setValueAtTime(3, 360);
  }

  return {
    buildExplosion: buildExplosion,
    buildFireSmoke: buildFireSmoke,
    buildWaterSplash: buildWaterSplash,
    buildSnowWeather: buildSnowWeather,
    buildElectricityEnergy: buildElectricityEnergy,
    buildMagicFantasy: buildMagicFantasy,
    buildParticles: buildParticles,
    buildLightGlow: buildLightGlow,
    buildGlitchDigital: buildGlitchDigital,
    buildAbstractShapes: buildAbstractShapes,
    buildHud: buildHud,
  };
})();
