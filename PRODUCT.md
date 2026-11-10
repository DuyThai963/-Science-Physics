# PRODUCT.md - CineAdult Dual-Engine Streaming Platform

## 1. Vision & Purpose
CineAdult is a high-performance, dark-mode streaming web platform designed for adult entertainment media. It provides a fluid, unified interface powered by two interchangeable API sources:
- **VSPhim Engine** (`https://nguon.vsphim.com/api-document`)
- **TopXX Engine** (`https://topxx.vip/api/`)

Users can seamlessly toggle between engines with one click, preserving active search filters, favorites, and watch history while browsing thousands of high-definition titles.

## 2. Target Audience & Usage Conditions
- **Audience**: Adult media viewers who value fast loading, high-definition streaming, privacy, and curated category exploration.
- **Usage Conditions**: Low-light / night viewing (OLED display optimized), mobile & desktop responsive, zero distracting ads or popups in the interface itself.

## 3. Core Capabilities & Tasks
1. **Dynamic Engine Switcher**: Toggle seamlessly between `VSPhim` and `TopXX` on the fly. State is retained in session/URL.
2. **Catalog Discovery & Filtering**: Browse latest uploads, trending movies, genres (Asian, Uncensored, Vietsub, Western, Cosplay, etc.), and release years.
3. **Instant Search**: Search movies by title, code (JAV code), or keyword with debounce and live result preview.
4. **Cinematic Video Player**:
   - Multi-server / Multi-episode support (VSPhim servers, TopXX streaming links).
   - Embedded responsive player with Theater Mode (widescreen), Light-off mode, and Fullscreen.
5. **Personalized Library**: Client-side (localStorage) Favorites and Watch History tracking.
6. **Robust API Proxy & Normalizer**: High-speed Node.js backend to bypass CORS constraints, normalize heterogeneous API schemas, and cache upstream responses.

## 4. Technical Constraints & Budgets
- **Response Time**: < 200ms for cached queries.
- **Accessibility**: WCAG AA contrast compliance, keyboard navigability, clear focus states.
- **Zero AI-Design Clichés**: Avoid gratuitous purple mesh gradients and template card grids.

