/* global CSInterface */
(function () {
  "use strict";

  var csInterface = new CSInterface();
  var grid = document.getElementById("grid");
  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");
  var errorBanner = document.getElementById("errorBanner");

  var effects = [
    {
      id: "explosion_burst",
      name: "Explosion Burst",
      category: "explosions",
      mode: "One-shot",
      thumb: "img/explosion.svg",
    },
    {
      id: "fire_smoke",
      name: "Fire & Smoke",
      category: "fire",
      mode: "Loop",
      thumb: "img/fire.svg",
    },
    {
      id: "water_splash",
      name: "Water Splash",
      category: "water",
      mode: "One-shot",
      thumb: "img/water.svg",
    },
    {
      id: "snow_weather",
      name: "Snow Weather",
      category: "snow",
      mode: "Loop",
      thumb: "img/snow.svg",
    },
    {
      id: "electricity_energy",
      name: "Electricity Energy",
      category: "electricity",
      mode: "One-shot",
      thumb: "img/energy.svg",
    },
    {
      id: "magic_fantasy",
      name: "Magic Fantasy",
      category: "magic",
      mode: "Loop",
      thumb: "img/magic.svg",
    },
    {
      id: "particles_generic",
      name: "Particles",
      category: "particles",
      mode: "Loop",
      thumb: "img/particles.svg",
    },
    {
      id: "light_glow",
      name: "Light Glow",
      category: "light",
      mode: "One-shot",
      thumb: "img/light.svg",
    },
    {
      id: "glitch_digital",
      name: "Glitch Digital",
      category: "glitch",
      mode: "One-shot",
      thumb: "img/glitch.svg",
    },
    {
      id: "abstract_shapes",
      name: "Abstract Shapes",
      category: "abstract",
      mode: "Loop",
      thumb: "img/abstract.svg",
    },
    {
      id: "game_hud",
      name: "Game HUD",
      category: "hud",
      mode: "Loop",
      thumb: "img/hud.svg",
    },
  ];

  function renderGrid() {
    grid.innerHTML = "";
    var search = searchInput.value.toLowerCase();
    var category = categoryFilter.value;

    var filtered = effects.filter(function (effect) {
      var matchesSearch = effect.name.toLowerCase().indexOf(search) !== -1;
      var matchesCategory = category === "all" || effect.category === category;
      return matchesSearch && matchesCategory;
    });

    filtered.forEach(function (effect) {
      var card = document.createElement("div");
      card.className = "card";
      card.dataset.effectId = effect.id;

      var img = document.createElement("img");
      img.src = effect.thumb;
      img.alt = effect.name;

      var info = document.createElement("div");
      info.className = "info";

      var title = document.createElement("div");
      title.className = "title";
      title.textContent = effect.name;

      var categoryLabel = document.createElement("div");
      categoryLabel.className = "category";
      categoryLabel.textContent = effect.category;

      var modeLabel = document.createElement("div");
      modeLabel.className = "mode";
      modeLabel.textContent = effect.mode;

      info.appendChild(title);
      info.appendChild(categoryLabel);
      info.appendChild(modeLabel);

      card.appendChild(img);
      card.appendChild(info);
      card.addEventListener("click", function () {
        insertEffect(effect.id);
      });

      grid.appendChild(card);
    });
  }

  function showError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
  }

  function clearError() {
    errorBanner.classList.add("hidden");
    errorBanner.textContent = "";
  }

  function insertEffect(effectId) {
    clearError();
    csInterface.evalScript("VFXLibrary.insertEffect('" + effectId + "')", function (result) {
      if (result && result !== "OK") {
        showError(result);
      }
    });
  }

  function init() {
    if (typeof SystemPath !== "undefined") {
      var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION).replace(/\\\\/g, \"/\");
      csInterface.evalScript(\"$.evalFile('\" + extensionRoot + \"/js/import.jsx')\");
    }
    renderGrid();
    searchInput.addEventListener("input", renderGrid);
    categoryFilter.addEventListener("change", renderGrid);
  }

  init();
})();
