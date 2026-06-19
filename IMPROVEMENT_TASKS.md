# FreeMovie Improvement Tasks

## P0 - Access Reliability

- [ ] Create a shared API client for all external requests.
  - Add a reusable module such as `js/apiClient.js`.
  - Route TMDb, OMDb, and other blocked external API calls through the existing Cloudflare Worker proxy.
  - Keep direct fetch only for same-origin static files.

- [ ] Replace direct `fetch` calls across the site.
  - Update movie pages.
  - Update series pages.
  - Update search pages.
  - Update genres pages.
  - Update upcoming pages.
  - Update home page to use the shared client instead of local duplicate `proxify` functions.

- [ ] Add retry and timeout handling for API requests.
  - Fail fast when a request hangs.
  - Retry transient failures once or twice.
  - Return user-friendly error states instead of raw browser errors.

## P0 - Download Link Reliability

- [ ] Stop showing guessed download links as confirmed links.
  - Current format `/Movies/{year}/{imdbNumber}` should be treated as unverified.
  - Do not present a link as downloadable unless it has been verified or provided by a trusted source.

- [ ] Add a download availability model.
  - Track `available`, `unavailable`, `unknown`, and `broken` states.
  - Show clear UI for each state.
  - Hide download buttons when links are unavailable.

- [ ] Add a source of truth for download links.
  - Use a JSON file, API endpoint, or generated index for movie download metadata.
  - Include IMDb ID, TMDb ID, quality, language, size, source, and last checked date.

- [ ] Add broken link reporting.
  - Add a "Report broken link" action on movie and series pages.
  - Pre-fill the report with TMDb ID, IMDb ID, title, year, and current URL.

## P1 - Error And Loading UX

- [ ] Replace raw errors like `Failed to fetch`.
  - Show Persian user-facing messages.
  - Example: `اتصال به منبع اطلاعات برقرار نشد. چند دقیقه دیگر دوباره تلاش کنید.`

- [ ] Add specific error states.
  - API blocked or unavailable.
  - Movie not found.
  - Download link unavailable.
  - Download server unavailable.
  - Rate limit or API key failure.

- [ ] Improve loading states.
  - Use consistent skeletons across home, movie, series, and search pages.
  - Avoid layout jumps after data loads.

## P1 - Search And Discovery

- [ ] Improve search by Persian and English titles.
  - Query TMDb in Persian and English where useful.
  - Merge and deduplicate results.

- [ ] Add search filters.
  - Movie or series.
  - Year.
  - Genre.
  - Rating.
  - Download availability.

- [ ] Add better empty states.
  - Show suggestions when no result is found.
  - Offer spelling variations or English title search.

- [ ] Add sorting options.
  - Popularity.
  - Release date.
  - Rating.
  - Recently added download links.

## P1 - Code Structure

- [ ] Centralize configuration.
  - Move API keys, proxy URL, image base URLs, and defaults into `js/config.js`.

- [ ] Centralize API logic.
  - Add `js/apiClient.js`.
  - Add helpers for TMDb movie details, series details, external IDs, search, and trending content.

- [ ] Centralize UI error rendering.
  - Add a small helper for consistent Persian error messages.
  - Use it across movie, series, search, and home pages.

- [ ] Remove duplicated helpers.
  - Remove duplicated `proxify`.
  - Remove duplicated loading bar logic.
  - Remove repeated default poster logic where possible.

- [ ] Normalize movie and series page behavior.
  - Same loading behavior.
  - Same error behavior.
  - Same proxy behavior.
  - Same download availability behavior.

## P2 - Download Page Experience

- [ ] Redesign movie download section around real availability.
  - Show quality labels like `480p`, `720p`, `1080p`.
  - Show language or subtitle state.
  - Show file size where available.
  - Show last checked date.

- [ ] Add clear unavailable states.
  - Example: `لینک دانلود این فیلم هنوز اضافه نشده است.`
  - Add request/report action.

- [ ] Add server health indication.
  - If a server returns `503`, show it as temporarily unavailable.
  - Do not open broken server links blindly.

## P2 - SEO Improvements

- [ ] Fix canonical URLs.
  - Movie pages should canonicalize to their own movie URL.
  - Series pages should canonicalize to their own series URL.
  - Avoid using the home page canonical on detail pages.

- [ ] Improve dynamic metadata.
  - Update title, description, Open Graph, and Twitter metadata after movie or series data loads.
  - Include title, year, overview, and poster.

- [ ] Improve structured data.
  - Complete Movie schema.
  - Add TVSeries schema for series pages.
  - Avoid empty schema fields.

- [ ] Improve sitemap strategy.
  - Add important movie and series detail pages.
  - Generate sitemap entries from available indexed content if possible.

## P2 - Monitoring And Maintenance

- [ ] Add a link checker script.
  - Check generated or stored download URLs.
  - Mark links as broken when they return `4xx`, `5xx`, or timeout.

- [ ] Add a basic smoke test.
  - Home page loads trending content.
  - Movie detail page loads TMDb data through proxy.
  - Search page returns results.
  - Download unavailable state renders correctly.

- [ ] Document deployment steps.
  - Commit changes.
  - Push to GitHub Pages branch.
  - Wait for deployment.
  - Verify key pages without VPN.

