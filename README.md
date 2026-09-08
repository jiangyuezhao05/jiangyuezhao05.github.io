# Jiangyue Zhao — Academic Website

Source for [jiangyuezhao05.github.io](https://jiangyuezhao05.github.io/), built with Jekyll and hosted by GitHub Pages.

## Content

- Homepage content: `_data/homepage.yml`
- Homepage structure: `_layouts/home.html`
- Miscellaneous page: `_misc/index.md`
- Primary navigation: `_data/navigation.yml`
- Academic styling: `assets/css/academic-home.css`

## Local preview

Install the dependencies once:

```bash
bundle config set --local path vendor/bundle
bundle install
```

Then start the real Jekyll site on port 4180:

```bash
./scripts/preview.sh
```

Open <http://127.0.0.1:4180/>. This preview is generated from the same layouts, includes, styles, and scripts used by the deployed site. It remains available only while the preview command is running.

## Production build

```bash
bundle exec jekyll build
```

The generated site is written to `_site/`, which is intentionally ignored by Git.
