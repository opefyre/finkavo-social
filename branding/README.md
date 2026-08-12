# Branding

The renderer uses committed, non-secret copies of the approved Finkavo artwork:

```text
branding/assets/finkavo-logo-512.png
branding/assets/lisbon-desk-background-v1.png
```

The app and existing Instagram posts establish this palette:

- petrol: `#14332F`
- petrol deep: `#0A2320`
- page cream: `#EEEAE1`
- mint: `#DAF0E6`
- peach: `#E3A171`
- ink: `#1B2B29`

The PNG logo is a fixed input and must never be recreated in CSS. The Lisbon desk image is an original generated background with no embedded text or branding; all copy and marks are rendered deterministically on top. CTAs are editorial text, never fake UI buttons.

Typography matches the original Finkavo social campaign: self-hosted variable Fraunces for display headlines and self-hosted variable Noto Sans for supporting copy. The renderer embeds both Latin ranges, waits for them to load, and never uses condensed fonts, scaling transforms, or artificial font stretching.
