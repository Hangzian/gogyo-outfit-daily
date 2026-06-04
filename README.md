# 五行の装い prototype

日本語向けの「五行穿衣日更」静的サイト原型です。トップページは当日の JSON を読み込み、過去日付と明日予告にも切り替えられます。

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

The project is also set up for Cloudflare Pages.

```bash
npm run build
npx wrangler pages deploy dist --project-name gogyo-outfit-daily
```

Cloudflare Pages publishes the `dist/` folder. The `daily/` JSON files can be served with `Cache-Control: no-store` so daily updates do not get stuck behind a long CDN cache.

## Daily data

Daily entries live in `daily/YYYY-MM-DD_ja.json`.

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
