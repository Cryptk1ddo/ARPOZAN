This is a minimal Next.js port scaffold for the ARPOZAN site.

Local commands

1) Install dependencies

```bash
cd nextjs
npm install
```

2) Run dev server

```bash
npm run dev
```

3) Production build (CI-style check)

```bash
npm run build
npm run start
```

Troubleshooting

- If `npm run build` fails, copy the full terminal output here and I'll fix the code. Common causes:
	- Missing npm install
	- PostCSS/Tailwind not installed (we added `postcss.config.js` and `tailwind.config.js`)

Notes
- Assets are under `nextjs/public/assets`.
- Product pages live in `nextjs/pages` (`maca`, `zinc`, `Yohimbin`, `Long-jack`).
- I added a small `CartContext` and shared components (`components/Carousel.js`, `components/StickyCTA.js`).

