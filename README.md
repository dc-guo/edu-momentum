# MomentumACT — Adaptive Momentum Learning System Demo

MomentumACT is a local ACT prep demo showing an anti-cram learning loop. It adapts the type of practice a student receives each day instead of pushing longer study time.

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
