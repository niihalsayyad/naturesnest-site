# Nature's Nest Exotic Resort — Website

*Where the hills meet the sea* · Live domain: **https://nnexotic.i-gpt.in**

Plain HTML/CSS/JS. No build tools, plugins or monthly fees.

## Files

| File | What it is |
|---|---|
| `index.html` | Home: hero, booking strip, welcome, rooms, amenities, photo strip, reviews carousel, map, CTA |
| `rooms.html` | Economy & Deluxe Sea View rooms + WhatsApp booking form (`#book`) |
| `amenities.html` | Pool, spa, restaurant, bar, gym, kids' area + in-room amenities |
| `gallery.html` | Filterable photo gallery with lightbox (click to enlarge, ← → keys, swipe) |
| `reviews.html` | Guest reviews + rating summary |
| `policies.html` | Cancellation, pet, children & ID policies |
| `contact.html` | Contact cards, enquiry form, Google Map, quick booking |
| `css/style.css` | Design system: brand colours/fonts at the top (`:root`) |
| `js/main.js` | Menu, animations, WhatsApp booking, lightbox, carousel. **Settings at the top** |
| `images/` | Full-size photos · `images/thumbs/` = 800px versions for fast loading |
| `CNAME`, `sitemap.xml`, `robots.txt`, `404.html` | GitHub Pages / SEO files |

## Brand colours (`css/style.css`)

| Token | Use | Value |
|---|---|---|
| `--forest` | Header, headings (Forest Green) | `#1F4A2C` |
| `--gold` | Buttons (Sunset Gold, dark text) | `#E9A93B` |
| `--ivory` | Page background (Natural Ivory) | `#FAF6EC` |
| `--brown` | Body text (Earth Brown) | `#4E3B2C` |
| `--teal` | Links & highlights (Ocean Teal) | `#1A7178` |

## Before launch: to-do

1. **Reviews:** replace the 6 sample reviews (marked with a yellow "Sample" badge) in `index.html` and `reviews.html` with real guest reviews, then delete the `<span class="sample-badge">…</span>` tags. Also update the rating summary on `reviews.html`.
2. **Google Map:** Google Maps → your resort → Share → *Embed a map* → copy the `src="…"` URL and paste it over the `iframe src` in `index.html` and `contact.html`. It currently searches by resort name.
3. **Contact form → email:** get a free key at https://web3forms.com and paste it into `web3formsKey` at the top of `js/main.js`. Until then the form sends the enquiry via WhatsApp.
4. **Social links:** replace `https://instagram.com/`, `https://facebook.com/` and `https://youtube.com/` with your real profile URLs (search & replace across all `.html` files).
5. Optional: add a street address and email address to the footer and contact page.

## Preview locally

Double-click `index.html`, or in VS Code right-click it → **Open with Live Server**.

## Publish on GitHub Pages with your domain

1. Create a GitHub repo and upload everything in this folder (keep the folder structure).
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
3. At your DNS provider for `i-gpt.in`, add a **CNAME** record: name `nnexotic` → value `<your-github-username>.github.io`.
4. Back in **Settings → Pages**, confirm the custom domain shows `nnexotic.i-gpt.in` (the `CNAME` file sets it), wait for the DNS check, then tick **Enforce HTTPS**.
5. Submit `https://nnexotic.i-gpt.in/sitemap.xml` in Google Search Console.
