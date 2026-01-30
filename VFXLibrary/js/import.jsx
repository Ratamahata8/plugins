/* Main entry point for CEP panel -> After Effects */
#include "tools.jsx"
#include "packs.jsx"

var VFXLibrary = (function () {
  function insertEffect(effectId) {
    app.beginUndoGroup("Insert VFX Library Effect");
    var comp = VFXTools.getActiveComp();
    if (!comp) {
      app.endUndoGroup();
      return "No active composition. Please select a comp in the timeline.";
    }

    var effectData = getEffectData(effectId);
    if (!effectData) {
      app.endUndoGroup();
      return "Effect not found.";
    }

    var precomp = VFXTools.createPrecomp(effectData.name, comp.width, comp.height, effectData.duration, comp.frameRate);
    effectData.builder(precomp);

    var layer = comp.layers.add(precomp);
    VFXTools.centerLayer(layer, comp);
    layer.startTime = comp.time;

    if (effectData.loop) {
      VFXTools.enableLoop(layer);
    }

    app.endUndoGroup();
    return "OK";
  }

  function getEffectData(effectId) {
    var map = {
      explosion_burst: {
        name: "Explosion Burst",
        duration: 1,
        loop: false,
        builder: VFXPacks.buildExplosion,
      },
      fire_smoke: {
        name: "Fire & Smoke",
        duration: 3,
        loop: true,
        builder: VFXPacks.buildFireSmoke,
      },
      water_splash: {
        name: "Water Splash",
        duration: 1.2,
        loop: false,
        builder: VFXPacks.buildWaterSplash,
      },
      snow_weather: {
        name: "Snow Weather",
        duration: 4,
        loop: true,
        builder: VFXPacks.buildSnowWeather,
      },
      electricity_energy: {
        name: "Electricity Energy",
        duration: 1,
        loop: false,
        builder: VFXPacks.buildElectricityEnergy,
      },
      magic_fantasy: {
        name: "Magic Fantasy",
        duration: 3,
        loop: true,
        builder: VFXPacks.buildMagicFantasy,
      },
      particles_generic: {
        name: "Particles",
        duration: 4,
        loop: true,
        builder: VFXPacks.buildParticles,
      },
      light_glow: {
        name: "Light Glow",
        duration: 1.5,
        loop: false,
        builder: VFXPacks.buildLightGlow,
      },
      glitch_digital: {
        name: "Glitch Digital",
        duration: 1,
        loop: false,
        builder: VFXPacks.buildGlitchDigital,
      },
      abstract_shapes: {
        name: "Abstract Shapes",
        duration: 2,
        loop: true,
        builder: VFXPacks.buildAbstractShapes,
      },
      game_hud: {
        name: "Game HUD",
        duration: 3,
        loop: true,
        builder: VFXPacks.buildHud,
      },
    };
    return map[effectId];
  }

  return {
    insertEffect: insertEffect,
  };
})();
