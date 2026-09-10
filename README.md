# techstay.tech

[![Hugo](https://img.shields.io/badge/Hugo-FF4088?style=for-the-badge&logo=hugo&logoColor=white)](https://gohugo.io/)
[![Theme: FixIt](https://img.shields.io/badge/Theme-FixIt-008AD9?style=for-the-badge)](https://fixit.lruihao.cn/)

Techstay's blog, <https://techstay.tech>

## Development

```sh
hugo server
```

## Build

```sh
hugo
```

Output goes to `public/`.

## Notes

- Multilingual site: English at `/`, 简体中文 at `/zh/` (config in `hugo.toml`, content in `content/en` and `content/zh`).
- The [FixIt](https://github.com/hugo-fixit/FixIt) theme (v1.0 alpha) is a git submodule tracking `main` at `themes/FixIt`. After cloning, run `git submodule update --init` to fetch it. Update it with `git submodule update --remote`.
- **Dart Sass is required** by the theme (`scoop install sass` / see [Hugo docs](https://gohugo.io//functions/css/sass/#dart-sass)). The Hugo extended binary alone is not enough.
- Old VuePress URLs (`/posts/foo.html`) redirect to the new paths via Hugo aliases.
