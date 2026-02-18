# M-U-PLUG // NEO-BRUTALIST COMMERCE

A premium retro gaming hardware storefront built with Shopify Hydrogen. Dark-mode-first, high-contrast command center aesthetic designed for collectors who demand excellence.

![Neo-Brutalist Design](https://img.shields.io/badge/DESIGN-Neo%20Brutalist-black?style=for-the-badge&labelColor=39ff14&color=000000)
![Hydrogen](https://img.shields.io/badge/Shopify-Hydrogen%202025.7.0-96bf48?style=for-the-badge)
![React Router](https://img.shields.io/badge/React%20Router-7.9.2-black?style=for-the-badge)

---

## PROJECT OVERVIEW

**M-U-PLUG** is a cutting-edge e-commerce experience selling retro gaming handhelds and accessories. Built on Shopify's Hydrogen framework with a custom Neo-Brutalist design language.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Shopify Hydrogen | 2025.7.0 |
| Routing | React Router | 7.9.2 |
| Styling | Tailwind CSS | v4.1.6 |
| Runtime | Node.js | >=18.0.0 |
| Build Tool | Vite | ^6.2.4 |
| Hosting | Shopify Oxygen | Edge Network |

### Architecture Highlights

- **Headless Commerce**: Decoupled frontend using Shopify Storefront API
- **Edge-Ready**: Optimized for Shopify Oxygen's global edge network
- **SEO-First**: Dynamic meta tags, Open Graph, structured data
- **Analytics Integration**: Shopify Analytics with automatic event tracking
- **Performance**: SWR caching strategy, optimized bundle splitting

---

## DESIGN SYSTEM (THE STYLE GUIDE)

### Core Philosophy

**Neo-Brutalist / Hardware Premium**

- No cheap 8-bit nostalgia
- Dark-mode-first command center aesthetic
- Rigid grid layouts with surgical precision
- Hardware photography pops against deep charcoals

### Color Palette

| Role | Color | Hex | CSS Variable |
|------|-------|-----|--------------|
| **Primary Background** | Deep Void | `#0a0a0a` | `--color-bg-primary` |
| **Secondary BG** | Elevated | `#141414` | `--color-bg-secondary` |
| **Primary Text** | Surgical White | `#ffffff` | `--color-fg-primary` |
| **Secondary Text** | Muted | `#a3a3a3` | `--color-fg-secondary` |
| **Accent Lime** | Industrial | `#39ff14` | `--color-accent-lime` |
| **Accent Magenta** | Warning/Error | `#ff00ff` | `--color-accent-magenta` |
| **Accent Cyan** | Interactive | `#00d4ff` | `--color-accent-cyan` |
| **Accent Amber** | Attention | `#ffaa00` | `--color-accent-amber` |
| **Error** | Critical | `#ff3333` | `--color-error` |
| **Success** | Confirmed | `#00ff88` | `--color-success` |

### Typography

| Role | Font | Usage |
|------|------|-------|
| **Display/Headers** | Space Grotesk | Page titles, massive typography (4xl-8xl) |
| **Body** | Inter | Paragraphs, descriptions |
| **Mono/Data** | JetBrains Mono | Prices, specs, codes, navigation |

#### Type Scale

```
h1: clamp(3rem, 8vw, 8rem) - Hero titles
h2: clamp(2rem, 5vw, 4rem) - Section headers
h3: clamp(1.5rem, 3vw, 2.5rem) - Sub-sections
body: 1rem - Standard text
mono-xs: 0.625rem (10px) - Specs, metadata
```

### Hard Shadow Button System

All interactive buttons use the **Hard Shadow Offset** pattern:

```css
/* Default State */
shadow-[4px_4px_0px_0px_var(--color-fg-primary)]

/* Hover State */
shadow-[2px_2px_0px_0px_var(--color-fg-primary)]
translate-x-[2px]
translate-y-[2px]

/* Active State */
shadow-none
translate-x-[4px]
translate-y-[4px]
```

**Visual Effect**: Button appears to depress when clicked, creating tactile feedback.

### Border Philosophy

- **Sharp edges only**: `border-radius: 0` (neo-brutalist principle)
- **Hierarchy through weight**:
  - `border-2`: Cards, inputs
  - `border-4`: Major sections, header/footer
  - `border-b-4`: Section dividers

---

## KEY COMPONENTS

### ProductCard

**File**: `app/components/ProductCard.jsx`

The atomic unit of commerce. Displays products with neo-brutalist styling.

**Features:**
- CRT scanline overlay effect on images
- Hard-bordered 4:3 aspect ratio
- Dynamic badges (NEW, RESTOCK, SALE)
- Animated add-to-cart with shadow offset
- Tech specs display from product tags

**Usage:**
```jsx
<ProductCard
  product={product}
  variant="standard" // or "featured" for 2x2 grid
  badge="NEW"
/>
```

### BentoGrid

**File**: `app/components/BentoGrid.jsx`

Rigid grid system for architectural layouts.

**Features:**
- 1px gap system for grid lines
- Configurable column spans
- Responsive breakpoints
- Cell background elevation

**Usage:**
```jsx
<BentoGrid cols={4}>
  <BentoCell colSpan={2} rowSpan={2}>Featured</BentoCell>
  <BentoCell>Standard</BentoCell>
</BentoGrid>
```

### Cart (Drawer)

**Files**: `app/components/CartMain.jsx`, `CartLineItem.jsx`, `CartSummary.jsx`

Slide-out cart drawer with brutalist aesthetic.

**Features:**
- "YOUR HAUL" header (Space Grotesk)
- Hard-bordered quantity controls
- Lime-green checkout button with shadow offset
- Empty state: "CART EMPTY // GO LOOT"
- Real-time optimistic updates

### Marquee

**File**: `app/components/Marquee.jsx`

Infinite scrolling announcement banner.

**Features:**
- Smooth CSS animation (`will-change: transform`)
- Color variants: lime, magenta, cyan, amber
- Speed controls: slow (45s), normal (30s), fast (20s)
- Pauses on hover

**Usage:**
```jsx
<Marquee variant="lime" speed="normal">
  <MarqueeItem>FREE SHIPPING ON ALL ORDERS</MarqueeItem>
  <MarqueeItem>NEW DROPS EVERY FRIDAY</MarqueeItem>
</Marquee>
```

---

## PROJECT STRUCTURE

```
app/
├── components/           # Reusable UI components
│   ├── BentoGrid.jsx
│   ├── CartMain.jsx
│   ├── CartLineItem.jsx
│   ├── CartSummary.jsx
│   ├── Footer.jsx
│   ├── Marquee.jsx
│   ├── Navbar.jsx
│   ├── PageLayout.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   ├── ProductGallery.jsx
│   ├── ProductPrice.jsx
│   └── TechSpecs.jsx
├── routes/              # Page routes
│   ├── ($locale)._index.jsx           # Home
│   ├── ($locale).products.$handle.jsx # Product Detail
│   ├── ($locale).collections.$handle.jsx # Collection
│   ├── ($locale).search.jsx           # Search Results
│   ├── ($locale).pages.$handle.jsx    # CMS Pages
│   ├── ($locale).$.jsx                 # 404 Catch-all
│   └── ...
├── styles/
│   ├── tailwind.css     # Design tokens & base styles
│   └── app.css          # Component-specific styles
├── lib/                 # Utilities
│   ├── fragments.js     # GraphQL fragments
│   └── variants.js      # Variant helpers
└── root.jsx             # Root layout with analytics
```

---

## SETUP & DEVELOPMENT

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Shopify CLI (for deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd m-u-plug

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Shopify credentials:
# - PUBLIC_STORE_DOMAIN
# - PUBLIC_STOREFRONT_API_TOKEN
# - PUBLIC_CHECKOUT_DOMAIN
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will start at http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Output: dist/ directory with client and server bundles
```

### Preview

```bash
# Preview production build locally
npm run preview
```

---

## DEPLOYMENT

### Shopify Oxygen (Recommended)

Shopify Oxygen is the globally distributed edge platform for Hydrogen storefronts.

```bash
# Install Shopify CLI globally (if not already installed)
npm install -g @shopify/cli

# Authenticate with Shopify
shopify auth

# Deploy to Oxygen
shopify hydrogen deploy

# Or using npm script
npm run deploy
```

**Deployment Checklist:**
- [ ] Environment variables configured in Shopify Partner Dashboard
- [ ] Storefront API access token has correct permissions
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking verified
- [ ] SEO meta tags validated

### Alternative: Node.js Server

```bash
# Build for Node.js
npm run build

# Start production server
npm start
```

---

## ANALYTICS & TRACKING

Shopify Analytics is automatically integrated and fires the following events:

| Event | Trigger | Data Payload |
|-------|---------|--------------|
| `page_view` | Route change | Page path, title |
| `product_view` | PDP load | Product ID, title, price, variant |
| `collection_view` | Collection load | Collection ID, handle |
| `cart_view` | Cart drawer open | Cart ID, item count |
| `add_to_cart` | Add to cart click | Product, variant, quantity |
| `search` | Search submitted | Query, results count |

**Verification:**
Check the browser's Network tab for requests to `https://monorail-edge.shopifysvc.com/`

---

## SEO

### Meta Title Formats

| Page | Format | Example |
|------|--------|---------|
| Home | `M-U-PLUG // RETRO HARDWARE` | - |
| Product | `Title // $XX.XX USD \| M-U-PLUG` | `Miyoo Mini // $89.99 USD \| M-U-PLUG` |
| Collection | `Name // ARCHIVE \| M-U-PLUG` | `Handhelds // ARCHIVE \| M-U-PLUG` |
| Search | `Search: Term \| M-U-PLUG` | `Search: Miyoo \| M-U-PLUG` |

### Open Graph Tags

All pages include:
- `og:title`
- `og:description`
- `og:type` (product, product.group, website)
- `og:site_name`
- `og:image` (product/collection featured image)

---

## CACHING STRATEGY

Public pages use **Stale-While-Revalidate (SWR)** caching:

```http
Cache-Control: public, max-age=60, stale-while-revalidate=600
```

**Explanation:**
- Pages cached for 60 seconds
- Stale content served for up to 10 minutes while revalidating in background
- Error pages: No cache
- Cart/checkout: No cache
- Static assets: 1 year cache

---

## CUSTOMIZATION

### Adding New Product Tags

Tags can drive specs and badges. Format:
```
SPEC: VALUE        → Displayed in TechSpecs component
NEW                → Shows "NEW" badge (lime)
RESTOCK            → Shows "RESTOCK" badge (cyan)
SALE               → Shows "SALE" badge (magenta)
```

Example tags in Shopify Admin:
```
SCREEN: 3.5" IPS
CPU: Quad-Core
RAM: 4GB
NEW
```

### Adding New Colors

Edit `app/styles/tailwind.css`:

```css
@theme {
  --color-accent-orange: #ff6600;
}
```

Use in components:
```jsx
<span className="text-[var(--color-accent-orange)]">
```

---

## TROUBLESHOOTING

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .react-router
npm install
npm run build
```

### GraphQL Errors

```bash
# Regenerate TypeScript types
npm run codegen
```

### Environment Issues

```bash
# Verify environment variables
cat .env
# Ensure all required vars are set
```

---

## CONTRIBUTING

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "feat: description"`
3. Push branch: `git push origin feature/name`
4. Open Pull Request

**Commit Message Convention:**
- `feat:` New feature
- `fix:` Bug fix
- `style:` CSS/styling changes
- `refactor:` Code restructuring
- `docs:` Documentation updates

---

## LICENSE

Proprietary - M-U-PLUG Commerce

---

## SYSTEM STATUS

![System](https://img.shields.io/badge/STATUS-ONLINE-39ff14?style=for-the-badge&labelColor=000000)
![Version](https://img.shields.io/badge/VERSION-2025.7.0-00d4ff?style=for-the-badge&labelColor=000000)

---

**M-U-PLUG // RETRO HARDWARE**  
*Authentic gaming hardware. Contemporary performance. Built for collectors.*
