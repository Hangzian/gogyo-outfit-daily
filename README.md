# 五行の装い prototype

日本語向けの「五行穿衣日更」静的サイト原型です。トップページは当日の JSON を読み込み、過去日付と明日予告にも切り替えられます。
現在は `ja`、`zh`、`en`、`ko` の 4 言語をサポートしています。

Public URL:

https://gogyo-outfit-daily-ja.pages.dev/

GitHub Pages fallback:

https://hangzian.github.io/gogyo-outfit-daily/

## Run

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Stable Deploy

This prototype can be hosted as a static site.

### GitHub Pages

Serve the repository root from the `main` branch. The site uses relative asset paths, so it works under a GitHub Pages subpath such as `/gogyo-outfit-daily/`.

### Cloudflare Pages

The primary production host is Cloudflare Pages.

```bash
npm run build
npx wrangler pages deploy dist --project-name gogyo-outfit-daily-ja
```

Cloudflare Pages publishes the `dist/` folder. The `daily/` JSON files can be served with `Cache-Control: no-store` so daily updates do not get stuck behind a long CDN cache.

## Daily data

Daily entries live in `daily/YYYY-MM-DD.json`.

Each daily file contains shared metadata and a `locales` object:

```json
{
  "date": "2026-06-04",
  "visual": {
    "src": "./assets/daily/models/2026-06-04.png",
    "position": "center top"
  },
  "locales": {
    "ja": {},
    "zh": {},
    "en": {},
    "ko": {}
  }
}
```

Legacy files such as `daily/YYYY-MM-DD_ja.json` are still kept for compatibility, but the frontend reads the multilingual file first.

`daily/index.json` controls the published dates, default date, and tomorrow preview:

```json
{
  "locale": "ja-JP",
  "defaultDate": "2026-06-04",
  "tomorrowDate": "2026-06-05",
  "dates": ["2026-06-04", "2026-06-05"]
}
```

The current frontend expects each daily file to include:

- `dateDisplay`
- `theme.title`
- `theme.subtitle`
- `colors.recommended`
- `colors.avoid`
- `outfitAdvice.summary`
- `scenes`
- `dailyNote`
- `visualCaption`
- `visual.src`
- `visual.alt`
- `visual.caption`

If a daily file omits `visual`, the page falls back to `assets/five-elements-editorial.png`.
Current daily hero images use model outfit photos under `assets/daily/models/`.

## Daily Automation

Generate one day manually:

```bash
npm run generate:daily -- --date 2026-06-06
```

The generator writes:

- `daily/YYYY-MM-DD.json`
- `assets/daily/models/YYYY-MM-DD.png` if the image does not exist
- updated `daily/index.json`

The GitHub Actions workflow at `.github/workflows/daily-update.yml` runs daily at `21:10 UTC`, which is morning in Japan/China, and then deploys to Cloudflare Pages.

Recommended repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `OPENAI_API_KEY` if AI copy/image generation should be enabled

Optional repository variables:

- `USE_OPENAI_TEXT=true`
- `GENERATE_IMAGES=true`
- `OPENAI_TEXT_MODEL=gpt-5-mini`
- `OPENAI_IMAGE_MODEL=gpt-image-2`

Without OpenAI variables, the workflow still generates multilingual template content and reuses the closest existing model image, so the publishing flow stays alive.
