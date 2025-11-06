# 🎬 BossFlix Movie Project

Website is publicly available on: <https://bossflix.org/>

## 🚀 Getting Started

Clone this repository and install dependencies:

```sh
# Clone the repo (choose one)
git clone https://github.com/p0xz/BossFlix-Moviesite.git
cd BossFlix-Moviesite

# or using GitHub CLI
gh repo clone p0xz/BossFlix-Moviesite
cd BossFlix-Moviesite

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
bun install
# or
yarn
```

## 🎯 Development Mode

After installing dependencies, run the dev server:

```sh
npm run dev
# or
bun run dev

# Open it in your browser right away
npm run dev -- --open
# or
bun run dev -- --open
```

## 🏗️ Building for Production

When you're ready to ship:

```sh
npm run build
# or
bun run build
```

## TODO

Feature / Priority

- [ ] Add filters for homepage search (mid)
- [ ] Add Movies & Series pages (low)
- [ ] Add transfer of watched / favourite (low)
- [ ] Add option to show recommendation (low)
- [ ] Add settings with default subtitles language option (mid)
- [ ] Add library sourced from opensubtitles so that users can attach another subtitles to their movie/show if the current list isn't working properly (mid)
- [ ] Add status to series if it's airing or ended (high)
- [ ] As with more sources for medias there's a need to sync all settings i.e: automatic subtitles & auto next feature (releasing soon [experimental])
- [ ] Add more sources for medias (very high, in work currently)

- [x] Add automatic subtitles option in series (experimental)
- [x] Add last watched (season & episode) of show
- [x] Add automatic next option in series

Check out your build locally with `npm run preview` or `bun run preview`.
