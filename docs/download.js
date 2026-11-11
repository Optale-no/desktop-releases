'use strict';

const releasesUrl = 'https://github.com/Optale-no/desktop-releases/releases/latest';
const platforms = {
  mac: {
    name: 'Mac', suffix: '-mac-universal.zip', detail: 'For Apple silicon and Intel Macs',
    steps: ['Download the ZIP file and double-click it to unpack the app.', 'Drag Optale Console into your Applications folder.', 'Open Optale Console from Applications and connect your workspace.'],
  },
  windows: {
    name: 'Windows', suffix: '-win-x64.exe', detail: 'For Windows, 64-bit',
    steps: ['Download the installer and open the EXE file.', 'Follow the installer to install Optale Console.', 'Open Optale Console and connect your workspace.'],
  },
  linux: {
    name: 'Linux', suffix: '-linux-x86_64.AppImage', detail: 'For Linux, x86_64',
    steps: ['Download the AppImage file.', 'Right-click the file, open Properties and allow it to run as a program.', 'Double-click the AppImage to open Optale Console and connect your workspace.'],
  },
};
const ua = navigator.userAgent;
const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const visitorPlatform = !mobile && /Mac/i.test(ua) ? 'mac' : !mobile && /Windows/i.test(ua) ? 'windows' : !mobile && /Linux/i.test(ua) ? 'linux' : null;
let selected = visitorPlatform;
let assets = [];
let loaded = false;
const download = document.querySelector('#download');
const releaseNote = document.querySelector('#release-note');

function render() {
  download.hidden = mobile;
  document.querySelector('#computer-guidance').hidden = !mobile;
  document.querySelector('#compatibility').hidden = mobile;
  document.querySelectorAll('[data-platform]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.platform === selected));
  });
  const platform = platforms[selected];
  if (platform) {
    const list = document.createElement('ol');
    for (const text of platform.steps) {
      const item = document.createElement('li');
      item.textContent = text;
      list.append(item);
    }
    document.querySelector('#steps').replaceChildren(list);
    document.querySelector('#install-title').textContent = `Install on ${platform.name}`;
    document.querySelector('#compatibility').textContent = platform.detail;
  }
  document.querySelector('#windows-note').hidden = selected !== 'windows';
  const asset = platform && assets.find(item => item.name.endsWith(platform.suffix));
  download.href = asset ? asset.browser_download_url : releasesUrl;
  download.replaceChildren(document.createTextNode(asset ? `Download for ${platform.name} ` : 'View latest release '));
  const arrow = document.createElement('span');
  arrow.setAttribute('aria-hidden', 'true');
  arrow.textContent = asset ? '↓' : '↗';
  download.append(arrow);
  if (loaded) {
    const missing = Object.values(platforms).filter(platform => !assets.some(asset => asset.name.endsWith(platform.suffix)));
    releaseNote.hidden = missing.length === 0;
    releaseNote.textContent = missing.length ? `${missing.map(platform => platform.name).join(', ')} downloads are not listed in this release. Open the latest release on GitHub to check available files.` : '';
  }
  document.querySelectorAll('[data-download]').forEach(link => {
    link.hidden = link.dataset.download === visitorPlatform;
    const platform = platforms[link.dataset.download];
    const asset = assets.find(item => item.name.endsWith(platform.suffix));
    link.href = asset ? asset.browser_download_url : releasesUrl;
    link.setAttribute('aria-label', asset ? `Download for ${platform.name}` : `Find ${platform.name} downloads on GitHub`);
  });
}

document.querySelectorAll('[data-platform]').forEach(button => {
  button.addEventListener('click', () => {
    selected = button.dataset.platform;
    render();
  });
});
render();

async function loadRelease() {
  try {
    const response = await fetch('https://api.github.com/repos/Optale-no/desktop-releases/releases/latest', { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Release unavailable');
    const release = await response.json();
    assets = (release.assets || []).filter(asset => typeof asset.name === 'string' && typeof asset.browser_download_url === 'string');
    const date = new Date(release.published_at);
    const dateText = Number.isNaN(date.getTime()) ? 'Release date unavailable' : `Released ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}`;
    document.querySelector('#release').textContent = `${release.tag_name || release.name || 'Latest release'} · ${dateText}`;
    loaded = true;
    render();
  } catch {
    document.querySelector('#release').textContent = 'Release details are unavailable right now.';
    releaseNote.hidden = false;
    releaseNote.textContent = 'We could not load the latest release. Open the latest release on GitHub to check for downloads.';
  }
}
loadRelease();
