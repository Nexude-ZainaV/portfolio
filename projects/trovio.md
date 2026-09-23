# Trovio

**Catalogue everything you collect. Share it. Know what it's worth.**

A collection and inventory platform for anything worth keeping, built as one
codebase for web, PWA, Android and iOS.

**My role:** founder and engineer.

## What it does

The core is keeping an inventory of a collection and sharing it. Optional
layers ride on top: valuation and portfolio tracking, marketplace listings,
trade matching, and protection for high-value items.

## Engineering notes

- **Category-agnostic engine, vertical-first go-to-market.** The data model
  treats "an item in a collection" generically, so a new collecting category
  is configuration rather than a new feature — while launch focuses on one
  community at a time.
- **Stack:** Next.js 16, React 19, TypeScript, MySQL 8, Capacitor 7, PWA.
  It deliberately mirrors the HuniWhisp stack so patterns, tooling and
  operational knowledge carry across products.
- **Single source of truth for the brand.** The product name lives in one
  module, so a rename touches one file plus the native manifests rather than
  a search-and-replace across the codebase.
- CI and deployment through GitHub Actions.
