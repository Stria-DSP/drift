#!/bin/bash
cd /Users/josephdavancens/dev/stria/drift
git init
git add .
git commit -m "Initial commit: Drift (formerly Planedrifter)

Drift is a phase-based generative sequencer for Ableton Live (Max for Live)
by Stria. Two playheads drift over one user-defined pattern (Reich-style
phasing); MIDI out and internal bar sound. Logic, not AI."
echo "Git repository initialized successfully"
git log --oneline -1
git status
