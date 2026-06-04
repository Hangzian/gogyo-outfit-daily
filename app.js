const DATA_INDEX = "./daily/index.json";
const todayKey = toDateKey(new Date());

const state = {
  dates: [],
  defaultDate: todayKey,
  tomorrowDate: "",
  currentDate: "",
  currentEntry: null,
  cache: new Map(),
};

const els = {
  body: document.body,
  title: document.getElementById("daily-title"),
  dateLine: document.getElementById("dateLine"),
  themeSubtitle: document.getElementById("themeSubtitle"),
  luckyColorRail: document.getElementById("luckyColorRail"),
  luckyColors: document.getElementById("luckyColors"),
  avoidColors: document.getElementById("avoidColors"),
  dailyNote: document.getElementById("dailyNote"),
  outfitSummary: document.getElementById("outfitSummary"),
  sceneGrid: document.getElementById("sceneGrid"),
  archiveList: document.getElementById("archiveList"),
  tomorrowText: document.getElementById("tomorrowText"),
  shareButton: document.getElementById("shareButton"),
  visualCaption: document.getElementById("visualCaption"),
  visualImage: document.querySelector(".hero-visual img"),
};

init();

async function init() {
  els.body.classList.add("is-loading");

  try {
    const index = await fetchJson(DATA_INDEX);
    state.dates = index.dates;
    state.defaultDate = chooseDefaultDate(index);
    state.tomorrowDate = index.tomorrowDate || findOffsetDate(state.defaultDate, 1);

    renderArchive();
    bindActions();
    await loadDate(readDateFromUrl() || state.defaultDate, { replaceUrl: true });
    await renderTomorrowTeaser();
  } catch (error) {
    renderError(error);
  } finally {
    els.body.classList.remove("is-loading");
  }
}

function chooseDefaultDate(index) {
  if (index.dates.includes(todayKey)) return todayKey;
  if (index.defaultDate && index.dates.includes(index.defaultDate)) return index.defaultDate;
  return index.dates[index.dates.length - 1];
}

async function loadDate(dateKey, options = {}) {
  if (!state.dates.includes(dateKey)) {
    dateKey = state.defaultDate;
  }

  const entry = await fetchDaily(dateKey);
  state.currentDate = dateKey;
  renderDaily(entry);
  updateArchiveState();

  if (options.replaceUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("date", dateKey);
    window.history.replaceState({}, "", url);
  } else {
    const url = new URL(window.location.href);
    url.searchParams.set("date", dateKey);
    window.history.pushState({}, "", url);
  }
}

async function fetchDaily(dateKey) {
  if (state.cache.has(dateKey)) {
    return state.cache.get(dateKey);
  }

  const daily = await fetchJson(`./daily/${dateKey}_ja.json`);
  state.cache.set(dateKey, daily);
  return daily;
}

async function fetchJson(path) {
  const url = new URL(path, window.location.href);
  url.searchParams.set("v", String(Date.now()));
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} を読み込めませんでした`);
  }
  return response.json();
}

function renderDaily(entry) {
  state.currentEntry = entry;
  document.title = `${entry.dateDisplay} | ${entry.theme.title}`;
  els.title.textContent = entry.theme.displayTitle || entry.theme.title;
  els.dateLine.textContent = entry.dateDisplay;
  els.themeSubtitle.textContent = entry.theme.subtitle;
  els.dailyNote.textContent = entry.dailyNote;
  els.outfitSummary.textContent = entry.outfitAdvice.summary;
  const visual = entry.visual || {};
  els.visualImage.src = visual.src || "./assets/five-elements-editorial.png";
  els.visualImage.alt = visual.alt || "東洋の布色見本と漆器を配した、現代的な雑誌風の五行イメージ";
  els.visualImage.style.objectPosition = visual.position || "center";
  els.visualCaption.textContent = visual.caption || entry.visualCaption;

  renderSwatches(els.luckyColorRail, entry.colors.recommended, "rail");
  renderSwatches(els.luckyColors, entry.colors.recommended, "chip");
  renderSwatches(els.avoidColors, entry.colors.avoid, "chip");
  renderScenes(entry.scenes);
}

function renderSwatches(container, colors, mode) {
  container.innerHTML = "";

  colors.forEach((color) => {
    const item = document.createElement("span");
    item.className = mode === "rail" ? "color-swatch" : "color-chip";

    const dot = document.createElement("span");
    dot.className = mode === "rail" ? "color-dot" : "mini-dot";
    dot.style.background = color.hex;

    const name = document.createElement("span");
    name.className = "color-name";
    name.textContent = color.name;

    item.append(dot, name);
    container.append(item);
  });
}

function renderScenes(scenes) {
  els.sceneGrid.innerHTML = "";

  scenes.forEach((scene) => {
    const item = document.createElement("article");
    item.className = "scene-item";

    const title = document.createElement("h3");
    title.textContent = scene.label;

    const text = document.createElement("p");
    text.textContent = scene.text;

    item.append(title, text);
    els.sceneGrid.append(item);
  });
}

function renderArchive() {
  els.archiveList.innerHTML = "";

  [...state.dates].reverse().forEach((dateKey) => {
    const button = document.createElement("button");
    button.className = "date-chip";
    button.type = "button";
    button.dataset.date = dateKey;
    button.textContent = formatShortDate(dateKey);
    button.addEventListener("click", () => loadDate(dateKey));
    els.archiveList.append(button);
  });
}

function updateArchiveState() {
  document.querySelectorAll(".date-chip").forEach((button) => {
    const isCurrent = button.dataset.date === state.currentDate;
    if (isCurrent) {
      button.setAttribute("aria-current", "date");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

async function renderTomorrowTeaser() {
  const target = state.tomorrowDate;
  if (!target || !state.dates.includes(target)) {
    els.tomorrowText.textContent = "明日の色は、朝の更新で整います。";
    return;
  }

  const entry = await fetchDaily(target);
  const firstColor = entry.colors.recommended[0]?.name || "おすすめ色";
  els.tomorrowText.textContent = `${entry.dateDisplay}は「${entry.theme.title}」。${firstColor}を軸に、軽やかな余白をつくる日です。`;
}

function bindActions() {
  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.jump === "tomorrow" ? state.tomorrowDate : state.defaultDate;
      loadDate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  els.shareButton.addEventListener("click", () => {
    const title = state.currentEntry?.theme?.title || els.title.textContent.replace(/\s+/g, "");
    const text = `${els.dateLine.textContent} ${title} | 五行の装い`;
    const url = new URL(window.location.href);
    url.searchParams.set("date", state.currentDate);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.href)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  });

  window.addEventListener("popstate", () => {
    loadDate(readDateFromUrl() || state.defaultDate, { replaceUrl: true });
  });
}

function renderError(error) {
  els.title.textContent = "日更を読み込めませんでした";
  els.dateLine.textContent = "五行の装い";
  els.themeSubtitle.textContent = error.message;
}

function readDateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("date");
}

function toDateKey(date) {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function findOffsetDate(dateKey, offset) {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  date.setDate(date.getDate() + offset);
  return toDateKey(date);
}

function formatShortDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  const weekday = new Intl.DateTimeFormat("ja-JP", { weekday: "short", timeZone: "Asia/Tokyo" }).format(date);
  const [year, month, day] = dateKey.split("-");
  return `${year}.${month}.${day}（${weekday}）`;
}
