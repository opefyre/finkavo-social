# hand-carousels

Hand-written photo carousels, one spec file per batch. A spec is a list of carousels; each has a photo from `img/`, a
list of slides (`cover`, `content`, `rows`, `figure`, `cta`) and a caption. See `specs/batch-2.mjs` for a fully worked
batch, including the sourcing notes at the top.

```bash
cd tools/carousel
node build.mjs specs/batch-2.mjs        # → out/<id>/01.png … and out/<id>-caption.txt
```

`build.mjs` fails the build (nothing is written for that carousel) when:

- copy leaves the **grid crop** (y 135–1215; the profile grid centre-crops 4:5 to 1:1) or the side margins
- text overflows its box, a box clips its content, or two pieces of furniture overlap
- a **serif headline contains a "3"** (Fraunces draws it as a "5"): put numbers in a chip, row, figure or body copy
- the logo straddles the grid crop
- a caption has **more than 5 hashtags**, or a malformed one

Adding a carousel: copy one entry in a spec file, change the content, check every figure against a primary source, keep
the caption to three topic tags + `#viveremportugal` + `#Finkavo`, then build. **Look at every slide.** AI stock photos can
contain garbled text: crop it out with `photoPos` or choose another. Post at 18:00 Lisbon; reels go out at 09:00.

Publish: upload `out/<id>/NN.png` to R2 as `social/carousels/YYYY/MM/DD/<uuid>/NN.png`, then
`node ../buffer/create-carousel-draft.mjs out/<id>-caption.txt <dueAt> "<title>" <url1> <url2> …`.
