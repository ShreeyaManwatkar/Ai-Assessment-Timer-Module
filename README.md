# AI Assessment Timer Module

A secure, backend-synced timer system for AI-based assessment platforms.

## Features

- 30-minute per-question timer
- Real-time countdown synced with backend
- Auto-submit on expiry
- Manual tamper prevention
- Resume timer on page refresh
- Submit & Start button state protection
- Warning alerts (5 min & 1 min remaining)

## Tech Stack

- Flask
- PostgreSQL (optional for production)
- HTML, CSS, Vanilla JS
- REST API based timer sync

## How to Run

```bash
pip install -r requirements.txt
python app.py
