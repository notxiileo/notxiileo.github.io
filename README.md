# Portfolio site

A two-page portfolio site: plain HTML/CSS/JS, no build step, ready for GitHub Pages.

## Files

- `index.html` — the landing page: hero, skills, a "featured work" teaser (3 cards linking into the timeline), commissions/Ko-fi, and contact (Discord first, email second).
- `work.html` — the full build timeline: every project, each with its own scrollable strip of images/video clips.
- `styles.css` — all styling and the color/gradient/type tokens (shared by both pages).
- `script.js` — loader, matrix rain, gradient glitch, marquee, scroll-progress bar, timeline rail, count-up stats, the media lightbox (prev/next + video), cursor glow, magnetic buttons, and scroll reveal (shared by both pages).
- `favicon.svg` — the browser tab icon.
- `images/` — placeholder gallery tiles (`work-01.svg` … `work-10.svg`) and two video posters (`video-01-poster.svg`, `video-02-poster.svg`). Replace these with real screenshots/thumbnails.
- `videos/` — empty except for a note; this is where your real `.mp4` clips go.

## Add your own photos and clips to the timeline

Open `work.html`. Each project is a `<li class="timeline-entry">` with a `<div class="filmstrip">` inside — a horizontally-scrolling strip of `<button class="media-thumb">` tiles, mixing images and videos freely. To edit:

**An image tile:**
```html
<button class="media-thumb" data-type="image" data-src="images/your-photo.jpg" data-title="Sunken Temple" data-desc="Whatever you want the caption to say.">
  <img src="images/your-photo.jpg" alt="Describe the image">
</button>
```

**A video tile:**
```html
<button class="media-thumb" data-type="video" data-src="videos/your-clip.mp4" data-poster="images/your-poster.jpg" data-title="Updraft" data-desc="Wind tunnel chain, full route.">
  <img src="images/your-poster.jpg" alt="Describe the clip">
  <span class="play" aria-hidden="true"></span>
  <span class="media-kind">video</span>
</button>
```

Drop your real files into `images/` and `videos/`, then update the `src`/`data-src`/`data-poster` paths to match. Copy a whole `<button class="media-thumb">` block to add more media to one project — there's no limit, the strip just scrolls.

Clicking any tile opens a lightbox with that project's full set: use the ‹ › arrows, the arrow keys, or swipe-scroll to move between items, Esc or the ✕ to close. Videos play with native controls right there in the lightbox. Each project card also has a dashed "view full gallery — N items" pill under its filmstrip — it jumps straight into that project's lightbox from the first item, so update the number when you add or remove media from a `<div class="filmstrip">`.

To add a whole new project, copy an entire `<li class="timeline-entry" id="...">...</li>` block, give it a unique `id`, and update the year/title/description/links/filmstrip. The scroll-lit rail and dot on the left work automatically for however many entries you have — no extra setup needed.

If you want a project on the timeline to also show up as a "featured" teaser on the homepage, copy one of the `<a class="feature-card">` blocks in `index.html`'s "Recent builds" section and point its `href` at `work.html#your-project-id`.

## Commissions, Ko-fi, and contact

- **Ko-fi**: in `index.html`, search for `ko-fi.com/notxiileo` (two places: the support section and the CTA at the bottom of `work.html`) and swap in your real Ko-fi shop URL.
- **Discord**: search both HTML files for `discord.gg/your-invite` and replace with your real invite link. Also update the `@ notxiileo` tag text in the contact section if your actual Discord username differs.
- **Email**: search for `hello@notxiileo.dev` in `index.html` and replace with your real address.
- **Commissions list**: the bullet points under "Get a custom map or model built" in `index.html` — edit freely to match what you actually take on.

## Customize the rest

- The `.stat-num` cards on the homepage — each has a `data-count` and `data-suffix` (e.g. `K+`).
- The `.skill-card` blocks for Unity / Blender / Substance Painter.
- The marquee tags in `.marquee-track` (duplicated once in the markup for a seamless loop — edit both copies).
- The about section's story and the `.ledger` (your workflow steps).

The color, gradient, and type tokens live at the top of `styles.css` (`--green`, `--cyan`, `--violet`, `--grad-a`, `--grad-discord`, `--grad-kofi`, `--bg`, `--font`, `--font-display`) if you want to shift the palette.

## About the animated bits

- A thin gradient bar across the very top fills as you scroll either page.
- A short boot loader plays once on the homepage — a typed status line and a gradient progress bar — then fades into the hero content. It doesn't block scrolling or the nav.
- The falling characters behind each hero are a `<canvas>` matrix-rain loop, contained to the hero only.
- Two blurred gradient orbs drift slowly behind each hero.
- A bold uppercase lime-green statement banner (`.big-marquee`, homepage only) scrolls right under the hero — edit the phrases inside `.big-marquee-track` in `index.html` (there are two identical sets of `<span>`s back to back for the seamless loop; edit both). It uses a lime accent (`--lime` / `--lime-dim` in `styles.css`) that's a yellow-green variant of the site's existing green palette, and pauses on hover like the smaller tag marquee below it.
- The homepage headline's second line uses an animated gradient and glitches on hover — plus a brief automatic glitch pulse every few seconds so it stays alive even if no one hovers it.
- The tag strip scrolls infinitely and pauses on hover.
- On `work.html`, a vertical rail next to the timeline fills with a gradient as you scroll, and each project's dot lights up green once it's in view.
- Filmstrips scroll horizontally with snap points; clicking a tile opens the lightbox with prev/next navigation and video playback.
- Stat numbers count up once when they scroll into view; cards, feature tiles, and the commission panel fade up into place as you scroll.
- A soft glow follows the cursor on desktop, and buttons marked `.magnetic` pull slightly toward the pointer when you're near them.
- Everyone with `prefers-reduced-motion` turned on gets static equivalents automatically — no loader animation, no rain loop, no count-up, no glitch, no magnetic pull.

## Deploy to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Add `index.html`, `work.html`, `styles.css`, `script.js`, `favicon.svg`, and the `images/` and `videos/` folders to the repo root.
3. Commit and push to the `main` branch.
4. In the repo, go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick `main` and `/ (root)`, then save.
6. Wait a minute or two — your site will be live at `https://<your-username>.github.io/<repo-name>/`.

If you want it at `https://<your-username>.github.io` directly (no repo name in the URL), name the repository `<your-username>.github.io`.

Large video files can slow down a git push — if a clip is more than ~50MB, consider compressing it first (e.g. with HandBrake) so the repo stays quick to clone.

## Run it locally

No build tools needed — just open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
