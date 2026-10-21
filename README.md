# Blockley Farm Enterprises

Website for Blockley Farm Enterprises, Karoi, Zimbabwe.

**Canonical source:** https://github.com/mmmposhi-lab/Blockley-Farm-Enterprises

**Production address:** https://blockleyfarmenterprises.netlify.app/

Edit this repository. Older ChatGPT HTML exports and downloaded Netlify output are archives, not parallel editable sources. HTML contains the photo paths, captions, contacts and business copy; JavaScript never chooses images by their position.

## Check and build

Use Node.js 24; no npm dependencies or API credentials are needed.

```sh
node --test
node scripts/build.mjs
```

`dist/` contains only the site, active photographs and `build-info.json`. It excludes source documents, tests, unused illustrative images and corrupt legacy JPEGs. The build validates local paths, section links, photo hashes/dimensions, contact URL formats and SEO metadata. A failed check stops the build.

For the additional strict image decode check, use Python 3.12 and install `requirements-dev.txt`, then run `python scripts/check-images.py`. GitHub Actions runs these checks on pushes and pull requests.

## Netlify settings

The repository's `netlify.toml` defines build command `node --test && node scripts/build.mjs`, publish directory `dist`, and Node version 24. The dashboard must link this exact repository and the `main` production branch.

**Dashboard verified on 21 October 2026:** the site already uses this repository, production is `main@be80e2f`, and publishing is now locked to deployment `6abe8ba9ce82afe4dc2d91ea`. The remaining integration changes and full deployment ZIP download are pending because the browser connection failed during the download attempt. Disable the Cloudinary build integration before deploying the repaired source. Also disable the unconfigured `@21yunbox/netlify-plugin-21yunbox-deploy-to-china-cdn` integration, which is reporting plugin errors; retain Lighthouse for verification. `skip_processing` disables Netlify post-processing; it does not disable a separately enabled Cloudinary build plugin.

## Release process

Make changes on a branch, open a pull request, pass Site checks and inspect a Netlify Deploy Preview. Obtain owner approval for the reviewed commit before publishing to production. Keep production auto-publishing locked until that approval; previews and GitHub checks should continue to run. Do not use Netlify Drop or make a separate ChatGPT-only copy for ongoing edits.

The initial repair branch and draft pull request use `[skip netlify]` to prevent unreviewed deployment while dashboard access is unresolved. Remove the marker and push a new commit only after the dashboard is safely configured and a hosted preview is authorized.

See [maintenance and release instructions](docs/MAINTENANCE.md) for backups, rollback, photo updates and the remaining dashboard work.
