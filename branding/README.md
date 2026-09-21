# Branding

Fixed inputs the tools read (`tools/reel`, `tools/carousel`):

```text
assets/finkavo-logo-512.png                      the logo: never recreate it in CSS
assets/fonts/fraunces-normal-latin(-ext).woff2   display serif: headlines only, never digits (its 3 reads as a 5)
assets/fonts/noto-sans-normal-latin(-ext).woff2  everything else, including all numbers
```

Palette used by the reels: deep `#06181a`, petrol `#0f2f33`, ink `#0b2a2c`, cream `#f6f1e7`, mint `#7fe0c0`, amber `#f3b072`,
coral `#ff7d63`. The fonts are embedded in the page and awaited before any frame is drawn.
