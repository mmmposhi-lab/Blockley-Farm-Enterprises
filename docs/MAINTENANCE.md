# Maintenance and release instructions

The GitHub repository is the editable source of truth. Netlify is the deployment destination. ChatGPT can prepare changes, but those changes must reach a repository branch before they can become the official site.

## First dashboard session — pending secure sign-in

1. Select the existing `blockleyfarmenterprises` project. Verify its production address matches `https://blockleyfarmenterprises.netlify.app/`.
2. Record the published deployment ID, permalink and originating Git commit, when available. Download the entire successful deployment ZIP. Preserve it separately from the repaired source.
3. Lock the published deployment to stop production auto-publishing during review. Do not stop builds, which would also stop previews.
4. Verify or connect `mmmposhi-lab/Blockley-Farm-Enterprises`, with production branch `main`. A new GitHub access authorization, if required, must be completed securely by the owner.
5. Inspect enabled build integrations. Disable the Cloudinary build integration responsible for rewriting local image URLs. Do not copy any environment-variable values, tokens or credentials into chat, logs or source files.
6. Confirm the settings in `netlify.toml`: Node 24, build `node --test && node scripts/build.mjs`, publish `dist`. Do not publish the repository root.
7. Enable pull-request Deploy Previews. Keep the current production deployment locked. The first repair draft has a `[skip netlify]` marker; remove it from the pull-request title and push a new commit without the marker when ready to build a preview.
8. Check the generated preview HTML and its actual image requests. Every photograph must use its local `assets/` path, including with JavaScript disabled. Confirm all gallery images load, contact links point to the intended people, the map opens correctly, and the build-info commit matches the reviewed source. Preview headers must include `X-Robots-Tag: noindex`.
9. Show the owner the preview and exact final commit. Publish only after approval. With production auto-publishing still locked, merge the approved change, build `main`, inspect that production build's permalink, then publish that successful deployment manually. Keep this manual publish gate for future releases unless the owner changes the policy.
10. Verify production after publishing: home page, every photograph, keyboard/mobile navigation, enquiry destinations, map, `robots.txt`, `sitemap.xml`, a missing URL returning HTTP 404, and `build-info.json` containing the approved commit.

## Backups and rollback

The 21 October preparation created a backup of public deployment responses, all known publicly accessible repository assets, the complete pre-repair GitHub source snapshot at commit `be80e2f5c0c17b42fd49efc591eaf67e50512b8d`, and the older September ChatGPT HTML export. Its public snapshot manifest includes hashes and failed downloads. It is not a complete Netlify deployment archive; download that archive in the first dashboard session above.

For rollback, keep the previous successful Netlify deployment. Publish that previous deployment from the dashboard if a release fails, and keep auto-publishing locked so a later build does not overwrite the rollback. Also revert the faulty repository change so source and production converge again. Do not delete prior deployments during this repair.

## Updating photographs

Use original, permissioned farm photos. Inspect each image visually, decode it without a truncated-image workaround, and confirm its subject before giving it a caption. Never present illustrative/generated poultry photos as farm photographs.

Update the matching `src`, image dimensions, `alt`, gallery link `href`, link name and `data-caption` together in `index.html`. Record the file, real dimensions, provenance and SHA-256 in `photo-manifest.json`. Reordering cards must never change which photograph a card shows. Run the build and strict image decoder before requesting review.

The corrupt legacy files `broilers-blockley-oct-2026.jpg`, `real-broilers-blockley-oct-2026.jpg` and `real-fish-ponds-blockley-oct-2026.jpg` are retained in Git history/source for recovery, excluded from the public build, and must not be reintroduced without valid originals. Use the existing valid poultry and pond photos for now. The sideways supply-carton photograph was replaced in the gallery by an existing real vegetable photograph. No original photo bytes were altered.

Dedicated authentic photographs for pigs, lablab, BSF production and transport are still needed if those subjects are to be shown. Do not invent product photos or current stock availability.

## Contacts and routine checks

Preserve the contact details confirmed in the repository. The October repair keeps all existing phone numbers and email addresses. WhatsApp links contain an editable enquiry outline; opening the link does not send a message automatically. URL validation does not establish that a number is active or an email inbox is monitored.

After any content change, run the checks and review the rendered result. Periodically confirm contact ownership, delivery wording, visiting arrangements and product availability. At each release, inspect the smallest phone layout, a tablet and desktop; use keyboard-only navigation; confirm labels and captions; and verify links without sending test messages or making calls unless authorized.

## Reference documentation

- [Netlify deployment management, locking, skip markers and rollback](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/)
- [Netlify Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)
- [Cloudinary integration installation and image rewriting](https://netlify.cloudinary.dev/installation)
- [Cloudinary integration management](https://cloudinary.com/blog/further-image-optimization-tips-netlify)
