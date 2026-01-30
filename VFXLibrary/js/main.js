/*
  VFX Library Panel
  - Renders a searchable, filterable grid
  - Sends effect requests to host ExtendScript (host.jsx)
*/

(() => {
  const csInterface = typeof CSInterface !== "undefined" ? new CSInterface() : null;
  const grid = document.getElementById("grid");
  const search = document.getElementById("search");
  const category = document.getElementById("category");
  const status = document.getElementById("status");

  const categories = [
    "Разрушение и энергия",
    "Огонь, дым, пыль",
    "Вода и жидкости",
    "Погода и атмосфера",
    "Электричество и энергия",
    "Магия и фантазия",
    "Свет и оптика",
    "Глитчи и диджитал",
    "Частицы",
    "Абстрактные",
    "Переходы",
    "UI / HUD",
  ];

  const effects = [
    {
      id: "explosion_small",
      name: "Explosion Small",
      category: "Разрушение и энергия",
      type: "one-shot",
      thumb: "🔥",
    },
    {
      id: "shockwave",
      name: "Shockwave",
      category: "Разрушение и энергия",
      type: "one-shot",
      thumb: "💥",
    },
    {
      id: "fire_loop",
      name: "Fire Loop",
      category: "Огонь, дым, пыль",
      type: "loop",
      thumb: "🔥",
    },
    {
      id: "smoke_soft",
      name: "Soft Smoke",
      category: "Огонь, дым, пыль",
      type: "loop",
      thumb: "🌫️",
    },
    {
      id: "water_splash",
      name: "Water Splash",
      category: "Вода и жидкости",
      type: "one-shot",
      thumb: "💧",
    },
    {
      id: "rain_loop",
      name: "Rain Loop",
      category: "Погода и атмосфера",
      type: "loop",
      thumb: "🌧️",
    },
    {
      id: "lightning_arc",
      name: "Lightning Arc",
      category: "Электричество и энергия",
      type: "one-shot",
      thumb: "⚡",
    },
    {
      id: "magic_circle",
      name: "Magic Circle",
      category: "Магия и фантазия",
      type: "loop",
      thumb: "✨",
    },
    {
      id: "lens_flare",
      name: "Lens Flare Burst",
      category: "Свет и оптика",
      type: "one-shot",
      thumb: "🌈",
    },
    {
      id: "glitch_ui",
      name: "UI Glitch",
      category: "Глитчи и диджитал",
      type: "one-shot",
      thumb: "📺",
    },
    {
      id: "particles_float",
      name: "Floating Particles",
      category: "Частицы",
      type: "loop",
      thumb: "💫",
    },
    {
      id: "abstract_wave",
      name: "Gradient Wave",
      category: "Абстрактные",
      type: "loop",
      thumb: "🧩",
    },
    {
      id: "transition_flash",
      name: "Light Flash Transition",
      category: "Переходы",
      type: "one-shot",
      thumb: "🎬",
    },
    {
      id: "hud_scan",
      name: "HUD Scan",
      category: "UI / HUD",
      type: "loop",
      thumb: "🧠",
    },
  ];

  const populateCategories = () => {
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      category.appendChild(option);
    });
  };

  const renderGrid = () => {
    const term = search.value.toLowerCase();
    const selected = category.value;
    grid.innerHTML = "";

    const filtered = effects.filter((effect) => {
      const matchesCategory = selected === "all" || effect.category === selected;
      const matchesSearch =
        effect.name.toLowerCase().includes(term) ||
        effect.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    filtered.forEach((effect) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.effectId = effect.id;

      card.innerHTML = `
        <div class="thumbnail">${effect.thumb}</div>
        <div class="card-body">
          <div class="card-title">${effect.name}</div>
          <div class="card-meta">${effect.category}
            <span class="tag">${effect.type}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => handleClick(effect));
      grid.appendChild(card);
    });

    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `
        <div class="thumbnail">🔍</div>
        <div class="card-body">
          <div class="card-title">No matches</div>
          <div class="card-meta">Try another search</div>
        </div>
      `;
      grid.appendChild(empty);
    }
  };

  const handleClick = (effect) => {
    if (!csInterface) {
      status.textContent = "CEP host not detected.";
      return;
    }

    status.textContent = `Building ${effect.name}...`;

    const payload = JSON.stringify(effect);
    csInterface.evalScript(`VFXLibrary.addEffect(${payload})`, (result) => {
      status.textContent = result || "Done.";
    });
  };

  populateCategories();
  renderGrid();

  search.addEventListener("input", renderGrid);
  category.addEventListener("change", renderGrid);
})();
