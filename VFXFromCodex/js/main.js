/*
  VFX from codex panel logic
  - Renders the effect library
  - Filters by search and category
  - Calls ExtendScript to insert selected effect
*/
const csInterface = new CSInterface();

const effects = [
  {
    id: "explosion_burst",
    name: "Burst Explosion",
    category: "Explosions",
    mode: "One-shot",
    color: "#ff6f61",
  },
  {
    id: "fire_smoke",
    name: "Ember Smoke",
    category: "Fire / Smoke",
    mode: "Loop",
    color: "#ff914d",
  },
  {
    id: "electric_arc",
    name: "Electric Arc",
    category: "Electricity / Energy",
    mode: "Loop",
    color: "#6f88ff",
  },
  {
    id: "placeholder_water",
    name: "Splash Pulse",
    category: "Water / Splashes",
    mode: "One-shot",
    color: "#4db6ff",
  },
  {
    id: "placeholder_snow",
    name: "Snow Drift",
    category: "Snow / Weather",
    mode: "Loop",
    color: "#b3e5ff",
  },
  {
    id: "placeholder_magic",
    name: "Mystic Bloom",
    category: "Magic / Fantasy",
    mode: "Loop",
    color: "#d67bff",
  },
  {
    id: "placeholder_particles",
    name: "Particle Swirl",
    category: "Particles",
    mode: "Loop",
    color: "#7bffb0",
  },
  {
    id: "placeholder_light",
    name: "Glow Sweep",
    category: "Light / Glow",
    mode: "One-shot",
    color: "#ffe08f",
  },
  {
    id: "placeholder_glitch",
    name: "Digital Glitch",
    category: "Glitch / Digital",
    mode: "Loop",
    color: "#8fffef",
  },
  {
    id: "placeholder_abstract",
    name: "Abstract Rings",
    category: "Abstract Shapes",
    mode: "Loop",
    color: "#ff8fd6",
  },
  {
    id: "placeholder_ui",
    name: "HUD Target",
    category: "UI / HUD",
    mode: "Loop",
    color: "#8fd3ff",
  },
];

const grid = document.getElementById("effectsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusMessage = document.getElementById("statusMessage");

function renderGrid() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  const filtered = effects.filter((effect) => {
    const matchesSearch = effect.name.toLowerCase().includes(searchValue);
    const matchesCategory =
      categoryValue === "all" || effect.category === categoryValue;
    return matchesSearch && matchesCategory;
  });

  grid.innerHTML = "";

  filtered.forEach((effect) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.setAttribute("aria-label", `Insert ${effect.name}`);

    const thumb = document.createElement("div");
    thumb.className = "thumb";
    thumb.style.background = `linear-gradient(135deg, ${effect.color}55, ${effect.color}22)`;
    thumb.textContent = effect.name.split(" ")[0];

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = effect.name;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.textContent = effect.category;

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = effect.mode;

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(badge);

    card.addEventListener("click", () => insertEffect(effect.id));

    grid.appendChild(card);
  });
}

function insertEffect(effectId) {
  statusMessage.textContent = "";
  const script = `VFXFromCodex.insertEffect(\"${effectId}\")`;
  csInterface.evalScript(script, (result) => {
    if (!result) {
      return;
    }
    if (result.indexOf("ERROR") === 0) {
      statusMessage.textContent = result.replace("ERROR:", "").trim();
      return;
    }
    statusMessage.textContent = result;
  });
}

searchInput.addEventListener("input", renderGrid);
categoryFilter.addEventListener("change", renderGrid);

renderGrid();
