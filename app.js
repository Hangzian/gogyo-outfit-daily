const DATA_INDEX = "./daily/index.json";
const SUPPORTED_LOCALES = ["ja", "zh", "en", "ko"];
const DEFAULT_LOCALE = "ja";
const todayKey = toDateKey(new Date());

const UI = {
  ja: {
    htmlLang: "ja",
    dateLocale: "ja-JP",
    siteName: "五行の装い",
    navToday: "今日",
    navTomorrow: "明日",
    navArchive: "過去",
    kicker: "毎朝更新 · 五行穿衣",
    loading: "読み込み中",
    defaultTitle: "今日の装いを整える",
    recommendedLabel: "今日のおすすめ色",
    share: "Xでシェア",
    tomorrowButton: "明日の予告",
    details: "詳しく見る",
    toneLabel: "Today's Tone",
    luckyLabel: "Lucky Colors",
    luckyTitle: "取り入れたい色",
    avoidLabel: "Careful Colors",
    avoidTitle: "控えめにしたい色",
    stylingLabel: "Styling",
    stylingTitle: "装いのすすめ",
    scenesLabel: "Scenes",
    scenesTitle: "シーン別の整え方",
    tomorrowLabel: "Tomorrow",
    tomorrowTitle: "明日の予告",
    archiveLabel: "Archive",
    archiveTitle: "過去の日更",
    followText: "日々の装いに、少しだけ余白と流れを。",
    followLink: "Xで更新を追う",
    footer: "五行の装い · Japanese daily prototype",
    visualFallback: "東洋の布色見本と漆器を配した、現代的な雑誌風の五行イメージ",
    visualCaptionFallback: "今日の色を、生活の質感に落とし込む。",
    tomorrowFallback: "明日の色は、朝の更新で整います。",
    tomorrowTemplate: (entry, color) => `${entry.dateDisplay}は「${entry.theme.title}」。${color}を軸に、軽やかな余白をつくる日です。`,
    errorTitle: "日更を読み込めませんでした",
  },
  zh: {
    htmlLang: "zh-CN",
    dateLocale: "zh-CN",
    siteName: "五行穿搭",
    navToday: "今日",
    navTomorrow: "明日",
    navArchive: "往期",
    kicker: "每日更新 · 五行穿衣",
    loading: "加载中",
    defaultTitle: "整理今天的穿搭",
    recommendedLabel: "今日推荐色",
    share: "分享到 X",
    tomorrowButton: "明日预告",
    details: "查看详情",
    toneLabel: "今日气场",
    luckyLabel: "Lucky Colors",
    luckyTitle: "推荐色",
    avoidLabel: "Careful Colors",
    avoidTitle: "谨慎色",
    stylingLabel: "Styling",
    stylingTitle: "穿搭建议",
    scenesLabel: "Scenes",
    scenesTitle: "场景穿搭",
    tomorrowLabel: "Tomorrow",
    tomorrowTitle: "明日预告",
    archiveLabel: "Archive",
    archiveTitle: "往期日更",
    followText: "给每天的衣着，留一点秩序和余白。",
    followLink: "在 X 关注更新",
    footer: "五行穿搭 · 多语言日更原型",
    visualFallback: "东方布料与现代生活方式构成的五行穿搭视觉图",
    visualCaptionFallback: "把今天的颜色，穿进生活质感里。",
    tomorrowFallback: "明日色彩会在早晨更新。",
    tomorrowTemplate: (entry, color) => `${entry.dateDisplay} 是「${entry.theme.title}」。以 ${color} 为轴，给穿搭留出轻盈感。`,
    errorTitle: "日更内容加载失败",
  },
  en: {
    htmlLang: "en",
    dateLocale: "en",
    siteName: "Five Elements Wear",
    navToday: "Today",
    navTomorrow: "Tomorrow",
    navArchive: "Archive",
    kicker: "Daily update · Five Elements Wear",
    loading: "Loading",
    defaultTitle: "Dress for today's flow",
    recommendedLabel: "Today's recommended colors",
    share: "Share on X",
    tomorrowButton: "Tomorrow",
    details: "View details",
    toneLabel: "Today's Tone",
    luckyLabel: "Lucky Colors",
    luckyTitle: "Colors to Wear",
    avoidLabel: "Careful Colors",
    avoidTitle: "Use With Care",
    stylingLabel: "Styling",
    stylingTitle: "Outfit Advice",
    scenesLabel: "Scenes",
    scenesTitle: "By Occasion",
    tomorrowLabel: "Tomorrow",
    tomorrowTitle: "Tomorrow Preview",
    archiveLabel: "Archive",
    archiveTitle: "Past Updates",
    followText: "A little space and rhythm for what you wear each day.",
    followLink: "Follow updates on X",
    footer: "Five Elements Wear · Multilingual daily prototype",
    visualFallback: "Modern East Asian fashion visual for daily five-elements outfit colors",
    visualCaptionFallback: "Bring today's color into everyday texture.",
    tomorrowFallback: "Tomorrow's colors will settle in with the morning update.",
    tomorrowTemplate: (entry, color) => `${entry.dateDisplay}: "${entry.theme.title}". Build around ${color} for a lighter sense of flow.`,
    errorTitle: "Daily update could not be loaded",
  },
  ko: {
    htmlLang: "ko",
    dateLocale: "ko-KR",
    siteName: "오행의 옷차림",
    navToday: "오늘",
    navTomorrow: "내일",
    navArchive: "지난 글",
    kicker: "매일 업데이트 · 오행 착장",
    loading: "불러오는 중",
    defaultTitle: "오늘의 흐름에 맞춰 입기",
    recommendedLabel: "오늘의 추천 색",
    share: "X에 공유",
    tomorrowButton: "내일 예고",
    details: "자세히 보기",
    toneLabel: "Today's Tone",
    luckyLabel: "Lucky Colors",
    luckyTitle: "추천 색",
    avoidLabel: "Careful Colors",
    avoidTitle: "주의할 색",
    stylingLabel: "Styling",
    stylingTitle: "착장 제안",
    scenesLabel: "Scenes",
    scenesTitle: "상황별 코디",
    tomorrowLabel: "Tomorrow",
    tomorrowTitle: "내일 예고",
    archiveLabel: "Archive",
    archiveTitle: "지난 업데이트",
    followText: "매일의 옷차림에 약간의 여백과 흐름을.",
    followLink: "X에서 업데이트 보기",
    footer: "오행의 옷차림 · 다국어 일일 프로토타입",
    visualFallback: "동양적 질감과 현대 패션을 담은 오행 착장 이미지",
    visualCaptionFallback: "오늘의 색을 생활의 질감으로 옮기기.",
    tomorrowFallback: "내일의 색은 아침 업데이트에서 정리됩니다.",
    tomorrowTemplate: (entry, color) => `${entry.dateDisplay}는 「${entry.theme.title}」. ${color}을 중심으로 가벼운 여백을 만들어 보세요.`,
    errorTitle: "일일 업데이트를 불러오지 못했습니다",
  },
};

const state = {
  dates: [],
  defaultDate: todayKey,
  tomorrowDate: "",
  currentDate: "",
  currentEntry: null,
  locale: DEFAULT_LOCALE,
  pendingVisualSrc: "",
  cache: new Map(),
  dataRequests: new Map(),
  imageCache: new Map(),
};

const els = {
  body: document.body,
  brandText: document.querySelector(".brand-text"),
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
  languageSelect: document.getElementById("languageSelect"),
};

init();

async function init() {
  els.body.classList.add("is-loading");
  state.locale = chooseLocale(readLocaleFromUrl() || localStorage.getItem("gogyo-locale") || navigator.language);
  renderStaticUI();

  try {
    const index = await fetchJson(DATA_INDEX);
    state.dates = index.dates;
    state.defaultDate = chooseDefaultDate(index);
    state.tomorrowDate = index.tomorrowDate || findOffsetDate(state.defaultDate, 1);
    const requestedDate = readDateFromUrl() || state.defaultDate;

    bindActions();
    renderArchive();
    warmPriorityImages(requestedDate);
    await loadDate(requestedDate, { replaceUrl: true });
    await renderTomorrowTeaser();
    warmRecentImages();
  } catch (error) {
    renderError(error);
  } finally {
    els.body.classList.remove("is-loading");
  }
}

function chooseLocale(value) {
  const normalized = String(value || "").toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("ko")) return "ko";
  if (normalized.startsWith("ja")) return "ja";
  return DEFAULT_LOCALE;
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

  const entry = await fetchDaily(dateKey, state.locale);
  state.currentDate = dateKey;
  renderDaily(entry);
  updateArchiveState();
  writeUrl(dateKey, state.locale, options.replaceUrl);
}

async function fetchDaily(dateKey, locale) {
  const cacheKey = `${dateKey}:${locale}`;
  if (state.cache.has(cacheKey)) {
    return state.cache.get(cacheKey);
  }
  if (state.dataRequests.has(cacheKey)) {
    return state.dataRequests.get(cacheKey);
  }

  const request = (async () => {
    let daily;
    try {
      daily = await fetchJson(`./daily/${dateKey}.json`);
    } catch {
      daily = await fetchLegacyDaily(dateKey, locale);
    }

    const normalized = normalizeDaily(daily, locale);
    state.cache.set(cacheKey, normalized);
    return normalized;
  })().finally(() => {
    state.dataRequests.delete(cacheKey);
  });

  state.dataRequests.set(cacheKey, request);
  return request;
}

async function fetchLegacyDaily(dateKey, locale) {
  try {
    return await fetchJson(`./daily/${dateKey}_${locale}.json`);
  } catch {
    return fetchJson(`./daily/${dateKey}_ja.json`);
  }
}

function normalizeDaily(daily, locale) {
  if (!daily.locales) return daily;

  const localized = daily.locales[locale] || daily.locales[DEFAULT_LOCALE];
  return {
    ...localized,
    id: daily.id,
    date: daily.date,
    status: daily.status,
    elementCycle: daily.elementCycle,
    visual: {
      ...(daily.visual || {}),
      alt: localized.visualAlt,
      caption: localized.visualCaption,
    },
  };
}

async function fetchJson(path) {
  const url = new URL(path, window.location.href);
  url.searchParams.set("v", String(Date.now()));
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} could not be loaded`);
  }
  return response.json();
}

function renderStaticUI() {
  const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
  document.documentElement.lang = ui.htmlLang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (ui[key]) element.textContent = ui[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (ui[key]) element.setAttribute("aria-label", ui[key]);
  });
  if (els.brandText) els.brandText.textContent = ui.siteName;
  if (els.title && !state.currentEntry) els.title.textContent = ui.defaultTitle;
  if (els.dateLine && !state.currentEntry) els.dateLine.textContent = ui.loading;
  if (els.luckyColorRail) els.luckyColorRail.setAttribute("aria-label", ui.recommendedLabel);
  if (els.visualImage && !state.currentEntry) els.visualImage.alt = ui.visualFallback;
  if (els.visualCaption && !state.currentEntry) els.visualCaption.textContent = ui.visualCaptionFallback;
  if (els.languageSelect) els.languageSelect.value = state.locale;
}

function renderDaily(entry) {
  const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
  state.currentEntry = entry;
  document.title = `${entry.dateDisplay} | ${entry.theme.title}`;
  els.title.textContent = entry.theme.displayTitle || entry.theme.title;
  els.dateLine.textContent = entry.dateDisplay;
  els.themeSubtitle.textContent = entry.theme.subtitle;
  els.dailyNote.textContent = entry.dailyNote;
  els.outfitSummary.textContent = entry.outfitAdvice.summary;
  const visual = entry.visual || {};
  const visualSrc = buildVisualSrc(visual.src || "./assets/five-elements-editorial.png", entry.date, state.locale);
  updateHeroImage(visualSrc);
  els.visualImage.alt = visual.alt || ui.visualFallback;
  els.visualImage.style.objectPosition = visual.position || "center";
  els.visualCaption.textContent = visual.caption || entry.visualCaption || ui.visualCaptionFallback;

  renderSwatches(els.luckyColorRail, entry.colors.recommended, "rail");
  renderSwatches(els.luckyColors, entry.colors.recommended, "chip");
  renderSwatches(els.avoidColors, entry.colors.avoid, "chip");
  renderScenes(entry.scenes);
}

function buildVisualSrc(src, dateKey, locale) {
  const url = new URL(src, window.location.href);
  url.searchParams.set("date", dateKey);
  url.searchParams.set("lang", locale);
  return url.href;
}

function updateHeroImage(src) {
  const currentSrc = els.visualImage.currentSrc || els.visualImage.src;
  if (currentSrc === src || els.visualImage.src === src || sameImagePath(currentSrc, src)) return;

  state.pendingVisualSrc = src;
  const record = preloadImage(src, "high");

  const applyImage = () => {
    if (state.pendingVisualSrc !== src) return;
    els.visualImage.src = src;
  };

  if (record.loaded) {
    applyImage();
    return;
  }

  record.promise.then(applyImage).catch(applyImage);
}

function sameImagePath(a, b) {
  try {
    const left = new URL(a, window.location.href);
    const right = new URL(b, window.location.href);
    return left.origin === right.origin && left.pathname === right.pathname;
  } catch {
    return false;
  }
}

function warmRecentImages() {
  const run = () => {
    const recentDates = [...state.dates].slice(-5);
    warmImageDates(recentDates, "low");
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.setTimeout(run, 900);
  }
}

function warmPriorityImages(dateKey) {
  const dates = uniqueDates([
    dateKey,
    state.defaultDate,
    state.tomorrowDate,
    findNeighborDate(dateKey, -1),
    findNeighborDate(dateKey, 1),
  ]);
  warmImageDates(dates, "high");
}

function warmImageDates(dateKeys, priority = "auto") {
  dateKeys.filter((dateKey) => state.dates.includes(dateKey)).forEach(async (dateKey) => {
    preloadExpectedModel(dateKey, priority);
    try {
      const entry = await fetchDaily(dateKey, state.locale);
      const visual = entry.visual || {};
      preloadImage(buildVisualSrc(visual.src || "./assets/five-elements-editorial.png", entry.date, state.locale), priority);
    } catch {
      // Visible content is already rendered; image warming is just a smoothness boost.
    }
  });
}

function preloadExpectedModel(dateKey, priority) {
  preloadImage(buildVisualSrc(`./assets/daily/models/${dateKey}.jpg`, dateKey, state.locale), priority);
}

function preloadImage(src, priority = "auto") {
  const key = imageCacheKey(src);
  const cached = state.imageCache.get(key);
  if (cached) return cached;

  const image = new Image();
  image.decoding = "async";
  if ("fetchPriority" in image) {
    image.fetchPriority = priority === "high" ? "high" : "low";
  }

  const record = {
    image,
    loaded: false,
    promise: null,
  };

  record.promise = new Promise((resolve, reject) => {
    image.onload = () => {
      record.loaded = true;
      resolve(image);
      if (image.decode) image.decode().catch(() => {});
    };
    image.onerror = reject;
  });
  record.promise.catch(() => {});

  state.imageCache.set(key, record);
  image.src = src;
  if (image.complete && image.naturalWidth > 0) {
    record.loaded = true;
  }

  return record;
}

function imageCacheKey(src) {
  try {
    const url = new URL(src, window.location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return src;
  }
}

function uniqueDates(dates) {
  return Array.from(new Set(dates.filter(Boolean)));
}

function findNeighborDate(dateKey, offset) {
  const index = state.dates.indexOf(dateKey);
  if (index < 0) return "";
  return state.dates[index + offset] || "";
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
    button.addEventListener("click", async () => {
      warmPriorityImages(dateKey);
      await loadDate(dateKey);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
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
  const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
  const target = state.tomorrowDate;
  if (!target || !state.dates.includes(target)) {
    els.tomorrowText.textContent = ui.tomorrowFallback;
    return;
  }

  const entry = await fetchDaily(target, state.locale);
  const firstColor = entry.colors.recommended[0]?.name || "";
  els.tomorrowText.textContent = ui.tomorrowTemplate(entry, firstColor);
}

function bindActions() {
  document.querySelectorAll("[data-jump]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = button.dataset.jump === "tomorrow" ? state.tomorrowDate : state.defaultDate;
      warmPriorityImages(target);
      await loadDate(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  els.languageSelect?.addEventListener("change", async () => {
    state.locale = chooseLocale(els.languageSelect.value);
    localStorage.setItem("gogyo-locale", state.locale);
    renderStaticUI();
    renderArchive();
    warmPriorityImages(state.currentDate || state.defaultDate);
    await loadDate(state.currentDate || state.defaultDate, { replaceUrl: true });
    await renderTomorrowTeaser();
    warmRecentImages();
  });

  els.shareButton.addEventListener("click", () => {
    const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
    const title = state.currentEntry?.theme?.title || els.title.textContent.replace(/\s+/g, "");
    const text = `${els.dateLine.textContent} ${title} | ${ui.siteName}`;
    const url = new URL(window.location.href);
    url.searchParams.set("date", state.currentDate);
    url.searchParams.set("lang", state.locale);
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.href)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  });

  window.addEventListener("popstate", async () => {
    state.locale = chooseLocale(readLocaleFromUrl() || state.locale);
    renderStaticUI();
    renderArchive();
    warmPriorityImages(readDateFromUrl() || state.defaultDate);
    await loadDate(readDateFromUrl() || state.defaultDate, { replaceUrl: true });
    await renderTomorrowTeaser();
  });
}

function renderError(error) {
  const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
  els.title.textContent = ui.errorTitle;
  els.dateLine.textContent = ui.siteName;
  els.themeSubtitle.textContent = error.message;
}

function writeUrl(dateKey, locale, replaceUrl) {
  const url = new URL(window.location.href);
  url.searchParams.set("date", dateKey);
  url.searchParams.set("lang", locale);
  if (replaceUrl) {
    window.history.replaceState({}, "", url);
  } else {
    window.history.pushState({}, "", url);
  }
}

function readDateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("date");
}

function readLocaleFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang");
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
  const ui = UI[state.locale] || UI[DEFAULT_LOCALE];
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  const weekday = new Intl.DateTimeFormat(ui.dateLocale, { weekday: "short", timeZone: "Asia/Tokyo" }).format(date);
  const [year, month, day] = dateKey.split("-");
  return `${year}.${month}.${day}（${weekday}）`;
}
