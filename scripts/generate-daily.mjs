import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const ROOT = process.cwd();
const DAILY_DIR = path.join(ROOT, "daily");
const MODEL_DIR = path.join(ROOT, "assets", "daily", "models");
const INDEX_PATH = path.join(DAILY_DIR, "index.json");
const LOCALES = ["ja", "zh", "en", "ko"];
const TIME_ZONE = "Asia/Tokyo";
const IMAGE_QUALITY = Number(process.env.DAILY_IMAGE_QUALITY || 82);
const runFile = promisify(execFile);

const PRESETS = [
  {
    key: "wood_fire",
    source: "wood",
    target: "fire",
    baseImage: "2026-06-02.jpg",
    colors: {
      recommended: [
        ["#9caf88", { ja: "若草色", zh: "嫩草绿", en: "Young sage", ko: "연한 풀빛" }],
        ["#a73a2d", { ja: "朱赤", zh: "朱红", en: "Cinnabar", ko: "주홍" }],
        ["#eee6d2", { ja: "生成り", zh: "本白", en: "Natural ivory", ko: "내추럴 아이보리" }],
      ],
      avoid: [
        ["#1b1b1b", { ja: "重い黒", zh: "厚重黑", en: "Heavy black", ko: "무거운 검정" }],
        ["#5d5364", { ja: "濁った紫", zh: "浊紫", en: "Muddied purple", ko: "탁한 보라" }],
      ],
    },
    copy: {
      ja: {
        title: "木が火を育てる日",
        displayTitle: "木が火を\n育てる日",
        subtitle: "伸びる力を、明るい印象へつなげる日。やわらかな緑と赤みを少しだけ足すと、表情が自然に開きます。",
        note: "今日は、頑張りを見せるより、気持ちよく伸びていく服を選ぶ。",
        advice: "明るさを大きく見せるよりも、清潔感の中に小さな熱を置くのが上品です。若草色、生成り、朱赤の小物を一点だけ添えて。",
        caption: "木の軽さに、火のあたたかさを少し。",
        alt: "若草色、生成り、朱赤の差し色を取り入れた男女モデルの木生火の日の装い",
        scenes: ["通勤", "デート", "商談", "旅行", "撮影"],
      },
      zh: {
        title: "木生火的一天",
        displayTitle: "木生火\n的一天",
        subtitle: "把生长感转成明亮气色的一天。柔和绿色配一点朱红，会让整个人看起来更舒展。",
        note: "今天，别急着证明自己，穿得舒展一点就好。",
        advice: "不必把亮色穿得很满，干净底色里放一点热度就很高级。嫩草绿、本白和朱红点缀很适合今天。",
        caption: "木的轻盈里，放一点火的温度。",
        alt: "男女模特穿着嫩草绿、本白和朱红点缀的木生火穿搭",
        scenes: ["通勤", "约会", "商谈", "旅行", "拍照"],
      },
      en: {
        title: "Wood Feeds Fire",
        displayTitle: "Wood Feeds\nFire",
        subtitle: "A day to turn growth into brightness. Soft green with a small cinnabar accent keeps the look fresh and alive.",
        note: "Choose clothes that let you grow into the day, not force your way through it.",
        advice: "Keep the brightness contained and elegant. Try young sage, natural ivory, and one cinnabar accessory where the eye naturally lands.",
        caption: "A touch of fire inside the ease of wood.",
        alt: "Male and female models wearing young sage, natural ivory, and cinnabar accents for a Wood feeds Fire day",
        scenes: ["Commute", "Date", "Meeting", "Travel", "Photos"],
      },
      ko: {
        title: "목이 화를 키우는 날",
        displayTitle: "목이 화를\n키우는 날",
        subtitle: "자라나는 기운을 밝은 인상으로 연결하는 날입니다. 부드러운 초록에 주홍을 조금 더하면 얼굴빛이 살아납니다.",
        note: "오늘은 애쓰는 모습을 보이기보다 편안하게 자라는 옷을 고르세요.",
        advice: "밝음을 크게 드러내기보다 깨끗한 바탕에 작은 온기를 두는 편이 세련됩니다. 연한 풀빛, 아이보리, 주홍 포인트를 활용하세요.",
        caption: "목의 가벼움에 화의 온기를 조금.",
        alt: "연한 풀빛, 아이보리, 주홍 포인트를 입은 남녀 모델의 목생화 스타일",
        scenes: ["출근", "데이트", "미팅", "여행", "촬영"],
      },
    },
  },
  {
    key: "fire_earth",
    source: "fire",
    target: "earth",
    baseImage: "2026-06-03.jpg",
    colors: {
      recommended: [
        ["#cdbb96", { ja: "砂色", zh: "砂色", en: "Sand beige", ko: "모래빛" }],
        ["#914332", { ja: "煉瓦色", zh: "砖红", en: "Brick red", ko: "벽돌 레드" }],
        ["#c9a86a", { ja: "淡金", zh: "浅金", en: "Soft gold", ko: "연한 골드" }],
      ],
      avoid: [
        ["#486f8f", { ja: "冷たい青", zh: "冷蓝", en: "Cold blue", ko: "차가운 블루" }],
        ["#ffffff", { ja: "強い白", zh: "强白", en: "Stark white", ko: "강한 화이트" }],
      ],
    },
    copy: makeCopy("火が土を温める日", "火が土を\n温める日", "火暖土的一天", "火暖土\n的一天", "Fire Warms Earth", "Fire Warms\nEarth", "화가 토를 데우는 날", "화가 토를\n데우는 날", "火の気配を、土の静けさで受け止める。", "用土的安静，接住火的气息。", "Let earth hold the warmth of fire.", "화의 기운을 토의 고요함으로 받아들이기."),
  },
  {
    key: "earth_metal",
    source: "earth",
    target: "metal",
    baseImage: "2026-06-04.jpg",
    colors: {
      recommended: [
        ["#f1ead8", { ja: "アイボリー", zh: "象牙白", en: "Ivory", ko: "아이보리" }],
        ["#c5a768", { ja: "淡金", zh: "浅金", en: "Pale gold", ko: "연한 골드" }],
        ["#a7a39a", { ja: "石のグレー", zh: "石灰色", en: "Stone grey", ko: "스톤 그레이" }],
      ],
      avoid: [
        ["#314d39", { ja: "濃い緑", zh: "深绿", en: "Deep green", ko: "짙은 초록" }],
        ["#bc2f25", { ja: "強い赤", zh: "强红", en: "Strong red", ko: "강한 빨강" }],
      ],
    },
    copy: makeCopy("土が金を生む日", "土が金を\n生む日", "土生金的一天", "土生金\n的一天", "Earth Creates Metal", "Earth Creates\nMetal", "토가 금을 낳는 날", "토가 금을\n낳는 날", "土の安定から、金の澄んだ輪郭へ。", "从土的稳定，走向金的清晰。", "From earth's steadiness to metal's clear edge.", "토의 안정에서 금의 맑은 윤곽으로."),
  },
  {
    key: "metal_water",
    source: "metal",
    target: "water",
    baseImage: "2026-06-05.jpg",
    colors: {
      recommended: [
        ["#deded9", { ja: "白銀", zh: "白银", en: "White silver", ko: "화이트 실버" }],
        ["#a9c5cc", { ja: "薄水色", zh: "浅水蓝", en: "Pale water blue", ko: "연한 물빛" }],
        ["#273747", { ja: "墨紺", zh: "墨蓝", en: "Ink navy", ko: "먹빛 네이비" }],
      ],
      avoid: [
        ["#b99b55", { ja: "砂っぽい黄", zh: "沙黄色", en: "Sandy yellow", ko: "모래빛 노랑" }],
        ["#7a5b44", { ja: "くすんだ茶", zh: "灰棕", en: "Dusty brown", ko: "탁한 브라운" }],
      ],
    },
    copy: makeCopy("金が水を澄ませる日", "金が水を\n澄ませる日", "金生水的一天", "金生水\n的一天", "Metal Clears Water", "Metal Clears\nWater", "금이 물을 맑게 하는 날", "금이 물을\n맑게 하는 날", "金の端正さが、水の透明感を呼ぶ。", "金的利落，唤出水的透明。", "Metal's clean edge calls in water's clarity.", "금의 단정함이 물의 투명함을 부릅니다."),
  },
];

function makeCopy(jaTitle, jaDisplay, zhTitle, zhDisplay, enTitle, enDisplay, koTitle, koDisplay, jaCaption, zhCaption, enCaption, koCaption) {
  return {
    ja: {
      title: jaTitle,
      displayTitle: jaDisplay,
      subtitle: "色数を増やさず、素材と余白で今日の流れを整える日です。",
      note: "今日は、服の輪郭を静かに整える。",
      advice: "おすすめ色を一つ主役にして、残りは淡いニュートラルで受け止めると上品です。小物は一点だけ光らせて。",
      caption: jaCaption,
      alt: `${jaTitle}の男女モデルの装い`,
      scenes: ["通勤", "デート", "商談", "旅行", "撮影"],
    },
    zh: {
      title: zhTitle,
      displayTitle: zhDisplay,
      subtitle: "少一点颜色堆叠，多一点材质和留白，今天的穿搭会更顺。",
      note: "今天，把衣服轮廓整理清楚就很好。",
      advice: "选一个推荐色做主角，其余用柔和中性色承接。配饰只留一个亮点，会更高级。",
      caption: zhCaption,
      alt: `${zhTitle}的男女模特穿搭`,
      scenes: ["通勤", "约会", "商谈", "旅行", "拍照"],
    },
    en: {
      title: enTitle,
      displayTitle: enDisplay,
      subtitle: "A day to use texture and space rather than too many colors.",
      note: "Let the outline of your clothes do the quiet work.",
      advice: "Choose one recommended color as the focus and support it with soft neutrals. Keep the accessory highlight to a single point.",
      caption: enCaption,
      alt: `Male and female models styled for ${enTitle}`,
      scenes: ["Commute", "Date", "Meeting", "Travel", "Photos"],
    },
    ko: {
      title: koTitle,
      displayTitle: koDisplay,
      subtitle: "색을 많이 쓰기보다 소재와 여백으로 오늘의 흐름을 정리하는 날입니다.",
      note: "오늘은 옷의 윤곽을 조용히 정돈하세요.",
      advice: "추천 색 하나를 중심에 두고 나머지는 부드러운 뉴트럴로 받쳐 주세요. 액세서리 포인트는 하나면 충분합니다.",
      caption: koCaption,
      alt: `${koTitle}의 남녀 모델 스타일`,
      scenes: ["출근", "데이트", "미팅", "여행", "촬영"],
    },
  };
}

const args = new Map(process.argv.slice(2).map((arg, index, all) => {
  if (!arg.startsWith("--")) return [String(index), arg];
  const [key, value] = arg.slice(2).split("=");
  return [key, value ?? all[index + 1] ?? "true"];
}));

const targetDate = args.get("date") || todayInTokyo();
const preset = PRESETS[dayIndex(targetDate) % PRESETS.length];
const daily = await buildDaily(targetDate, preset);

await mkdir(DAILY_DIR, { recursive: true });
await mkdir(MODEL_DIR, { recursive: true });
daily.visual = daily.visual || {};
daily.visual.src = await ensureImage(targetDate, preset, daily);
await writeFile(path.join(DAILY_DIR, `${targetDate}.json`), `${JSON.stringify(daily, null, 2)}\n`);
await updateIndex(targetDate);

console.log(`Generated daily content for ${targetDate} (${preset.key})`);

async function buildDaily(dateKey, preset) {
  const aiDaily = await maybeGenerateWithOpenAI(dateKey, preset);
  if (aiDaily) return aiDaily;

  return {
    id: dateKey,
    date: dateKey,
    status: "published",
    elementCycle: {
      source: preset.source,
      target: preset.target,
      relationship: "generating",
    },
    visual: {
      src: `./assets/daily/models/${dateKey}.jpg`,
      position: "center top",
    },
    locales: Object.fromEntries(LOCALES.map((locale) => [locale, buildLocale(dateKey, locale, preset)])),
  };
}

function buildLocale(dateKey, locale, preset) {
  const copy = preset.copy[locale];
  return {
    locale: localeCode(locale),
    dateDisplay: formatDate(dateKey, locale),
    theme: {
      title: copy.title,
      displayTitle: copy.displayTitle,
      subtitle: copy.subtitle,
    },
    colors: {
      recommended: preset.colors.recommended.map(([hex, names]) => ({ name: names[locale], hex })),
      avoid: preset.colors.avoid.map(([hex, names]) => ({ name: names[locale], hex })),
    },
    outfitAdvice: {
      summary: copy.advice,
    },
    scenes: copy.scenes.map((label, index) => ({ label, text: sceneText(locale, label, index) })),
    dailyNote: copy.note,
    visualCaption: copy.caption,
    visualAlt: copy.alt,
  };
}

function sceneText(locale, label, index) {
  const text = {
    ja: ["清潔感のある主役色を一つだけ。", "顔まわりにやわらかな色を置いて。", "落ち着いた中性色で信頼感を整えて。", "動きやすい素材で軽やかに。", "背景に合わせて小物を一点だけ効かせて。"],
    zh: ["只保留一个干净的主色。", "把柔和色放在脸周，更容易亲近。", "用中性色整理出可信赖的气场。", "选择好行动的材质，保持轻盈。", "根据背景只留一个配饰亮点。"],
    en: ["Keep one clean color in focus.", "Place the softer tone near the face.", "Use grounded neutrals for quiet trust.", "Choose easy-moving fabric for travel.", "Let one accessory respond to the background."],
    ko: ["깨끗한 중심색 하나만 남기세요.", "얼굴 가까이에 부드러운 색을 두세요.", "차분한 뉴트럴로 신뢰감을 정돈하세요.", "움직이기 편한 소재로 가볍게.", "배경에 맞춰 소품 하나만 살리세요."],
  };
  return text[locale][index] || label;
}

async function maybeGenerateWithOpenAI(dateKey, preset) {
  if (!process.env.OPENAI_API_KEY || process.env.USE_OPENAI_TEXT !== "true") return null;

  const prompt = [
    "Create one daily Five Elements outfit guide as strict JSON.",
    `Date: ${dateKey}. Cycle: ${preset.source} generates ${preset.target}.`,
    "Languages: ja, zh, en, ko. Keep the exact schema used by this site.",
    "Tone: modern lifestyle magazine, not fortune-telling, concise and useful.",
    "Return JSON only.",
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-5-mini",
      input: prompt,
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI text generation failed: ${response.status}`);
    return null;
  }

  const payload = await response.json();
  const text = payload.output_text || payload.output?.flatMap((item) => item.content || []).map((part) => part.text).filter(Boolean).join("\n");
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    parsed.id = dateKey;
    parsed.date = dateKey;
    parsed.visual = parsed.visual || { src: `./assets/daily/models/${dateKey}.jpg`, position: "center top" };
    return parsed;
  } catch {
    console.warn("OpenAI returned non-JSON content; using template fallback.");
    return null;
  }
}

async function ensureImage(dateKey, preset, daily) {
  const jpgName = `${dateKey}.jpg`;
  const jpgDestination = path.join(MODEL_DIR, jpgName);
  if (existsSync(jpgDestination)) return modelAsset(jpgName);

  const pngName = `${dateKey}.png`;
  const pngDestination = path.join(MODEL_DIR, pngName);
  if (existsSync(pngDestination)) {
    if (await optimizeToJpeg(pngDestination, jpgDestination)) return modelAsset(jpgName);
    return modelAsset(pngName);
  }

  if (process.env.OPENAI_API_KEY && process.env.GENERATE_IMAGES === "true") {
    const generated = await maybeGenerateImage(dateKey, preset, daily, pngDestination);
    if (generated) {
      if (await optimizeToJpeg(pngDestination, jpgDestination)) return modelAsset(jpgName);
      return modelAsset(pngName);
    }
  }

  const source = path.join(MODEL_DIR, preset.baseImage);
  if (preset.baseImage.endsWith(".jpg") || preset.baseImage.endsWith(".jpeg")) {
    await copyFile(source, jpgDestination);
    return modelAsset(jpgName);
  }

  if (await optimizeToJpeg(source, jpgDestination)) return modelAsset(jpgName);
  await copyFile(source, pngDestination);
  return modelAsset(pngName);
}

function modelAsset(fileName) {
  return `./assets/daily/models/${fileName}`;
}

async function optimizeToJpeg(source, destination) {
  const quality = String(IMAGE_QUALITY);
  const commands = [
    ["sips", ["-s", "format", "jpeg", "-s", "formatOptions", quality, source, "--out", destination]],
    ["magick", [source, "-auto-orient", "-strip", "-quality", quality, destination]],
    ["convert", [source, "-auto-orient", "-strip", "-quality", quality, destination]],
  ];

  for (const [command, args] of commands) {
    try {
      await runFile(command, args);
      return true;
    } catch {
      // Try the next converter; local macOS has sips, GitHub runners commonly have ImageMagick.
    }
  }

  console.warn(`Image optimization unavailable; keeping original image for ${path.basename(source)}.`);
  return false;
}

async function maybeGenerateImage(dateKey, preset, daily, destination) {
  const prompt = [
    "Photorealistic modern Japanese lifestyle magazine fashion image.",
    "Two fictional adult East Asian models, one man and one woman, fully clothed.",
    `Five Elements theme: ${preset.source} generates ${preset.target}.`,
    `Recommended colors: ${daily.locales.en.colors.recommended.map((color) => color.name).join(", ")}.`,
    "Refined studio, clean East Asian paper and stone textures, no text, no logos, no watermark.",
    "Vertical fashion editorial, suitable for a 4:5 web hero.",
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-2",
      prompt,
      size: process.env.OPENAI_IMAGE_SIZE || "1024x1536",
    }),
  });

  if (!response.ok) {
    console.warn(`OpenAI image generation failed: ${response.status}`);
    return false;
  }

  const payload = await response.json();
  const b64 = payload.data?.[0]?.b64_json;
  if (!b64) return false;

  await writeFile(destination, Buffer.from(b64, "base64"));
  return true;
}

async function updateIndex(dateKey) {
  const index = JSON.parse(await readFile(INDEX_PATH, "utf8"));
  const dates = Array.from(new Set([...(index.dates || []), dateKey])).sort();
  index.defaultLocale = "ja";
  index.locales = LOCALES;
  index.defaultDate = dateKey;
  index.tomorrowDate = addDays(dateKey, 1);
  index.dates = dates.slice(-60);
  await writeFile(INDEX_PATH, `${JSON.stringify(index, null, 2)}\n`);
}

function todayInTokyo() {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dayIndex(dateKey) {
  return Math.floor(new Date(`${dateKey}T00:00:00+09:00`).getTime() / 86400000);
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  date.setDate(date.getDate() + days);
  return dateKeyInTokyo(date);
}

function formatDate(dateKey, locale) {
  const localeName = localeCode(locale);
  const date = new Date(`${dateKey}T00:00:00+09:00`);
  const weekday = new Intl.DateTimeFormat(localeName, { weekday: "short", timeZone: TIME_ZONE }).format(date);
  const [year, month, day] = dateKey.split("-");
  return `${year}.${month}.${day}（${weekday}）`;
}

function localeCode(locale) {
  return {
    ja: "ja-JP",
    zh: "zh-CN",
    en: "en",
    ko: "ko-KR",
  }[locale];
}

function dateKeyInTokyo(date) {
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
