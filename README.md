# Optale Console downloads

This repository holds public desktop release assets and the static download page in `docs/`. The page uses HTML, CSS and plain JavaScript. It needs no build step.

## Preview locally

```sh
python3 -m http.server 8080 --directory docs
```

Open `http://localhost:8080`. All page assets, including Inter and the app icon, are self-hosted. The page makes one request to the public GitHub latest-release API. There are no trackers or analytics.

## Release downloads

The page reads `https://api.github.com/repos/Optale-no/desktop-releases/releases/latest` at load and selects assets by filename suffix:

- Mac: `*-mac-universal.zip`, for Apple silicon and Intel.
- Windows: `*-win-x64.exe`, for 64-bit Windows.
- Linux: `*-linux-x86_64.AppImage`.

Publish these assets on a GitHub Release. No page edit is needed for a new version. The page shows the release tag and its publication date in UTC. If the API fails, times out, or has no published release, links lead to `https://github.com/Optale-no/desktop-releases/releases/latest` with a plain explanation. Missing platform assets also link there rather than inventing a file URL.

Desktop visitors get their platform's download and three install steps. The platform buttons change the instructions and main download. Phone and tablet visitors get guidance to open the page on a computer. There is no top header or separate list of platform download links.

The platform highlight slides to the selected button. Download details and install steps cross-fade, and the install panel adjusts its height over 240 milliseconds with ease-out timing. These effects are disabled when the visitor requests reduced motion.

Windows is currently unsigned. Its instructions explain the "Windows protected your PC" prompt, "More info" and "Run anyway".

## Hosting

GitHub Pages serves `main` with `/docs` as its source at `https://download.optale.com`. Keep `docs/CNAME` when updating the page.

The footer's Release notes link opens the public changelog at `https://optale.com/changelog`.

## Visual sources

`docs/assets/icon.png` and `docs/assets/inter.woff2` come from `Optale-no/console`, branch `origin/desktop/m1`, at `desktop/build/icon.png` and `desktop/src/picker/inter.woff2`. Colors and typography follow the native picker and the Console dark-zinc theme.

## Browser acceptance evidence

Captured with Chrome for Testing on KS-7, against the locally served page:

- Mac, Windows and Linux desktop user agents at 1440 by 1000.
- iPhone user agent at 390 by 844.
- Each platform with mocked release `v0.1.0`, publication date November 11, 2026, and the three matching assets.
- Each platform with an API HTTP 503 response.

The original screenshots are in `/home/thor/optale-artifacts/desktop-primary/download-page/`. Updated screenshots and motion evidence are in its `v2/` directory, named `<platform>-success.png` and `<platform>-api-failure.png`. Browser checks cover page behavior, not installation or real release binaries.
