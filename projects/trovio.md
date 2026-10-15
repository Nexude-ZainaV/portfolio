# Trovio

Catalogue everything you collect, share it, and know what it's worth.

A collection and inventory platform for anything worth keeping, built as one
codebase for web, PWA, Android and iOS.

My role: founder and engineer.

## What it does

The core is keeping an inventory of a collection and sharing it. Optional
layers sit on top: valuation and portfolio tracking, marketplace listings,
trade matching, and protection for high-value items.

## Engineering notes

- The data model treats "an item in a collection" generically, so adding a
  new collecting category is configuration, not a new feature. Launch still
  goes one community at a time.
- Next.js 16, React 19, TypeScript, MySQL 8, Capacitor 7 and a PWA. I kept it
  on the same stack as HuniWhisp on purpose, so patterns, tooling and
  operational knowledge carry over between products.
- The product name lives in one module. Renaming it means one file plus the
  native manifests, not a search and replace across the codebase.
- CI and deployment run on GitHub Actions.
