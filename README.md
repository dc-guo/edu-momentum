# MomentumACT — Adaptive Momentum Learning System Demo

MomentumACT is a local ACT prep demo showing an anti-cram learning loop. It adapts the type of practice a student receives each day instead of pushing longer study time.

## ⚠️ MVP scope

This is a very early MVP, built as a proof of concept — not a production study tool. Its purpose is to demonstrate one idea: **different learners need different language, encouragement, and pacing.**

- A student rebuilding momentum after a break gets recovery-focused framing ("Let's rebuild your momentum") and more review/confidence questions — not guilt about a broken streak.
- A student on a roll gets growth framing and new concepts to keep progressing.
- Streaks, consistency percentiles, and progress metrics are framed around practice frequency and rhythm, never test scores or pressure.

Everything here is intentionally simplified to make that adaptation visible: three hardcoded demo personas, a small static question bank (~30 questions), a rule-based session engine, and localStorage persistence. There is no backend, no auth, no real spaced-repetition model, and the questions are illustrative rather than official ACT material.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo walkthrough

1. Select Rebuilding Momentum.
2. Confirm recovery message and predicted focus.
3. Start Quick Session.
4. Complete check-in.
5. Answer all 5 questions.
6. Review explanations.
7. Show Session Summary.
8. Select confidence.
9. Switch to Growth Mode.
10. Repeat briefly to show adaptation.

## Troubleshooting

If PowerShell blocks npm scripts:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

If old data appears, click Reset Demo.
