Drop the licensed font files here (they are commercial TypeType fonts, so
they can't be bundled in the repo — get them from the team's type license):

  TTNeoris-Regular.woff2 / .ttf      -> big & important titles
  TTNeoris-Bold.woff2 / .ttf
  JustSans-Regular.woff2 / .ttf      -> body and everything else
  JustSans-Medium.woff2 / .ttf

The @font-face rules in src/app/globals.css already point to these exact
filenames. Until the files exist, the app silently falls back to the Geist
stack — nothing breaks.
