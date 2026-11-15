# Addy CDN Scripts

> **Merging to `main` is a production release.** The public addy.so / addy.com pages load
> these files straight from GitHub through jsDelivr `@latest`, which serves `main` (the repo
> has no tags and no `dev` branch). There is no build, no CI, no staging copy and no review
> gate between a merge and live pages. Test before merging, and treat a revert as the only
> rollback.

Plain browser JavaScript for Addy's public web pages. The marketing site is built in Framer,
so any logic those pages need (consent form, email preferences, lender directory, Chrome
extension install and uninstall pages, Google Ads conversions) lives here and is embedded as
a `<script>` tag. The scripts talk to the backend `api` Cloud Function; nothing in this repo
is used by the app, the client or the extension.

How a page loads a file:

```
https://cdn.jsdelivr.net/gh/addy-ai/cdn-scripts@latest/landing-page/js/consent-form.min.js
```

jsDelivr minifies on request, so the repo holds only `consent-form.js`; never commit `.min.js`.

## Folder map

```
landing-page/js/       one script per Framer page: consent-form, email-preferences,
                       email-client (request access), delete-account, chrome-extension,
                       chrome-uninstalled (feedback), lenders + lenders-list (directory data),
                       pricing, home, home-2, subscribed, help-center, how-to-train,
                       accept-business-invite; plus a couple of .html snippets
customer-inquiry-bot/js/index.js   older chat-bubble embed (the live bot has its own repo)
ui-framework/          small experimental input, selector and slider widgets, not loaded
                       by any page found in this repo
```

## Running and validating

There is no `package.json`, no lint, no tests and no build. To check a change, open a page
that embeds the script, or serve a local HTML file that loads your working copy, and watch
the browser console and network tab. After merging, confirm the live page picks it up.

## Worth knowing

- The file path is the public URL. Renaming or moving a file breaks every page that embeds
  it; add the new path and leave the old one until the Framer page is updated.
- jsDelivr caches `@latest`. After a merge, purge each changed file at
  `https://purge.jsdelivr.net/gh/addy-ai/cdn-scripts@latest/<path>.min.js`.
- One page serves dev and prod: `consent-form.js` uses the dev API
  (`addy-ai-dev`) only when the page URL has `?env=dev`, otherwise prod. Most other scripts
  hard-code the prod `api` URL.
- These are not Node modules: no `require`, no bundler. Scripts run as classic `<script>`
  tags (some wrapped in an IIFE), so keep them self-contained and avoid leaking globals.
- Forms here collect borrower contact and consent data from the public internet. Validate
  input, and never log it to the console.
- `lenders-list.js` is a large generated data array (~20k lines); edit it with a script,
  not by hand.
