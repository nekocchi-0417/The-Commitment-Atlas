# The Commitment Atlas

A research dashboard of 32 provisions marked Verified in the source workbook, restricted throughout to the six sectors in the midterm paper.

## Use

Open `output/commitment-atlas.html` in a modern browser, or serve `dist/` on a static host. The standalone file works without an account, installation or network connection; external sources require internet access. Hosted URLs preserve filters and open records. Local file links work only on the same computer.

- Six sector profiles with source-linked examples and proposed takeaways.
- 17 selected historical milestones linked to included provisions.
- Comparison of up to three sectors.
- Ten proposed AI lessons organised by five lifecycle lenses.
- Search, sector and boundary-type filters; filtered CSV and full JSON downloads.
- White default theme and a saved day/night toggle.

The six sectors are nuclear; chemical and biological weapons; biotech and human genetics; pharmaceuticals and human research; finance and anti-money laundering; and export controls. The website, bundled dataset and exports share the same scope.

## Evidence

Source snapshot: 20 November 2026. Workbook modification date: 29 October 2026, from Drive metadata. Authors: Zhang Yue and Shagufta Sen.

- [Workbook](https://docs.google.com/spreadsheets/d/1kT2igmcThhO0EwrEAmsQuemUioZal_HZ/edit)
- [Midterm paper](https://docs.google.com/document/d/1Dy3qgh0-cQTOYL6E_e3VyC_vHPw-aWnclB1T6V8EC7c/edit)

Verification reports the workbook checkbox; it does not establish independent review of dashboard synthesis. Sector summaries, selected chronology and AI lessons are AI-assisted interpretations. Separate human approval of these additions is not recorded. Original quotes and source fields are preserved. A record is one mapped provision or boundary, which need not be an absolute ban.

The dataset is static. Changing the Google workbook does not automatically update this website. The lifecycle lens organises questions, without scores, rankings or an assumed universal sequence.

Duplicate source IDs retain unique dashboard keys and worksheet-row locators. The IAEA significant-quantity title is corrected for display, with the original title preserved. Four explicit continuation rows resolve instrument-level fields from their earlier same-instrument entries; raw blanks remain available.

## Maintain

`data/atlas.json` is the canonical snapshot. Preserve original fields and unique `uid` keys. Sector and lesson references use these unique keys, and milestones use `linkedRecordUids`.

Run:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

The build rejects out-of-scope sectors, unverified records and unresolved references. It regenerates `dist/data.js`, `dist/atlas-data.json` and the self-contained HTML in `output/`. A deliberate source revision that changes record counts also requires updating the build's reviewed-count guard.

The interface is buildless HTML, CSS and JavaScript with no third-party runtime dependencies, external fonts, analytics or images. Theme preference is stored locally in the browser. To preview, run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist`.

Sites hosting identity is preserved in `.openai/hosting.json`.

## Validation

Automated checks cover six-sector scope, all routes and 24 sector views, all 32 record dialogs, rejection of excluded records, filters, CSV exports, methods content and theme preference. Retained source fields were compared against the preceding snapshot and preserved.

Browser checks covered light and dark layouts, persistence after reload, evidence filtering, pointer and keyboard record opening, Escape dismissal and the methods page. Rendered text contrast checks on cover, lessons and methods found no ratios below 4.5:1 in the checked states. Width checks at 390 and 1440 CSS pixels showed no page overflow; the desktop grid had three columns. These checks are not a full accessibility audit or research validation.
