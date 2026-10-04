# Plan: Remove hero image from Season Guides pages

## Context
- `app/(relate)/magazines/[club]/page.tsx` currently passes `bgImage={club.heroImage}` to `PageHero`
- This causes the season guides library page to render with the club hero photo as a full-bleed background
- The user confirmed: season guides pages should not have hero images

## Proposed change
In `app/(relate)/magazines/[club]/page.tsx`, remove the `bgImage={club.heroImage}` prop from the `<PageHero>` component.

This will make the season guides page fall back to the default gradient background (defined in `PageHero.tsx`) instead of the club hero photo.

## Scope
- 1 file changed
- No new files or folders
- No other pages affected

## Validation
- Navigate to `/magazines/sprout`, `/magazines/surge`, etc.
- Confirm the full-bleed club photo is gone and the gradient background is shown instead
- Confirm page still renders title, tagline, description and publication library correctly
