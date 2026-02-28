# Timer Module - Assessment System

A robust and production-ready timer module designed for online assessment platforms. This application provides a secure, real-time countdown timer with backend synchronization, automatic submission on expiry, and comprehensive tamper prevention mechanisms.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture & Technical Details](#architecture--technical-details)
- [How It Works](#how-it-works)
- [Security Features](#security-features)
- [Future Enhancements](#future-enhancements)

---

## Overview

The Timer Module is a comprehensive solution for managing time-bound assessments in online examination systems. It ensures fair evaluation by providing a synchronized timer between the frontend and backend, preventing user tampering, and automatically submitting answers when time expires.

This system is ideal for:
- Online examination platforms
- Timed coding challenges
- Quiz applications
- Assessment management systems
- Competitive programming platforms

---

## ✨ Features

### Core Timer Functionality
- **30-minute per-question timer**: Each question gets a dedicated 30-minute time slot
- **Real-time countdown synced with backend**: Timer display updates every second with backend validation
- **Auto-submit on expiry**: Automatically submits answers when time runs out
- **Resume timer on page refresh**: Maintains timer state even if the page is refreshed or browser crashes
- **Submit & Start button state protection**: Prevents multiple submissions or timer resets

### User Experience
- **Warning alerts**: 
  - Alert notification at 5 minutes remaining
  - Final alert at 1 minute remaining
- **Real-time status display**: Shows current timer status and operation feedback
- **Responsive UI**: Clean, modern interface with smooth animations

### Security & Reliability
- **Manual tamper prevention**: Backend validation prevents client-side manipulation
- **Session-based tracking**: Each assessment session is uniquely tracked
- **Status validation**: Prevents submission after expiry or duplicate submissions
- **Database persistence**: All timer states are saved in SQLite for reliability

---

## 📁 Project Structure

```
Timer-Module-Ai-Assessment/
│
├── app.py                  # Main Flask application & API endpoints
├── config.py              # Configuration settings (database URI, etc.)
├── models.py              # SQLAlchemy database models
├── requirements.txt       # Python dependencies
├── README.md             # This file
│
├── static/
│   ├── script.js         # Frontend JavaScript (timer logic & API calls)
│   └── style.css         # Styling (responsive & modern design)
│
├── templates/
│   └── index.html        # HTML template (assessment interface)
│
├── instance/             # Flask instance folder (auto-generated)
│   └── timer.db         # SQLite database (auto-generated)
│
└── __pycache__/         # Python cache (auto-generated)
```

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
- **pip** - Python package manager (comes with Python)
- **Git** (optional) - For version control
- **Modern web browser** - Chrome, Firefox, Safari, or Edge

### Verify Python Installation

```bash
python --version
pip --version
```

---

## Installation

### Step 1: Clone or Download the Project

**Using Git:**
```bash
git clone <repository-url>
cd Timer-Module-Ai-Assessment
```

**Or download and extract the ZIP file, then navigate to the project directory:**
```bash
cd Timer-Module-Ai-Assessment
```

### Step 2: Create a Virtual Environment

Creating a virtual environment is recommended to isolate project dependencies:

**On Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

After activation, your terminal should show `(venv)` prefix.

### Step 3: Install Dependencies

Install all required Python packages from the requirements.txt file:

```bash
pip install -r requirements.txt
```

**Expected Output:**
```
Successfully installed blinker-1.9.0 click-8.3.1 ... Flask-3.1.3
```

### Step 4: Verify Installation

Verify all packages are installed:

```bash
pip list
```

---

## Usage

### Starting the Application

1. **Activate the virtual environment** (if not already activated):
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Start the Flask application**:
   ```bash
   python app.py
   ```

   **Expected Output:**
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   WARNING: This is a development server.
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5000/assessment
   ```

4. **You should see the Assessment Timer interface** with:
   - Timer display showing "30:00"
   - "Start Timer" button (blue)
   - "Submit Answer" button (dark)
   - Status text area

### Using the Timer

1. **Click "Start Timer"**
   - Timer begins countdown from 30:00
   - Backend creates a timer session and stores the end time
   - Start button becomes disabled
   - Timer display updates every second

2. **Complete Your Answer**
   - While the timer is running, write your answer
   - The page will stay synchronized with the backend countdown

3. **Submit Your Answer**
   - Click "Submit Answer" before time expires
   - A confirmation message appears: "Answer submitted successfully."
   - Submit button becomes disabled (prevents double submission)
   - Timer stops

4. **If Time Expires**
   - Notifications appear at 5 minutes and 1 minute remaining
   - When timer reaches 0:00, the system automatically submits
   - Status displays: "Time Expired. Auto-submitted."

5. **Page Refresh**
   - If you accidentally refresh the page during the timer
   - The system automatically resumes the same timer
   - No time is lost

---

## API Documentation

The backend provides three main REST API endpoints:

### 1. Start Timer
**Endpoint:** `POST /timer/start`

**Purpose:** Initiates a new timer session for a candidate attempting a question.

**Request Body:**
```json
{
    "session_id": "S1",
    "question_id": "Q1",
    "candidate_id": "C1"
}
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | Unique identifier for the assessment session |
| question_id | string | Unique identifier for the current question |
| candidate_id | string | Unique identifier for the candidate |

**Response (Success - 200):**
```json
{
    "remaining_time": 1800,
    "status": "running"
}
```

**Response Details:**
- `remaining_time`: Time in seconds (1800 = 30 minutes)
- `status`: Current timer status ("running")

---

### 2. Get Timer Status
**Endpoint:** `POST /timer/status`

**Purpose:** Retrieves the current status and remaining time for an active timer.

**Request Body:**
```json
{
    "session_id": "S1",
    "question_id": "Q1"
}
```

**Response (Success - 200):**
```json
{
    "remaining_time": 1452,
    "status": "running"
}
```

**Possible Status Values:**
- `running`: Timer is active
- `submitted`: Answer has been submitted
- `expired`: Time has expired

**Response (Not Found - 404):**
```json
{
    "message": "Timer not found"
}
```

---

### 3. Submit Answer
**Endpoint:** `POST /timer/submit`

**Purpose:** Submits the candidate's answer and stops the timer.

**Request Body:**
```json
{
    "session_id": "S1",
    "question_id": "Q1"
}
```

**Response (Success - 200):**
```json
{
    "message": "Answer submitted successfully.",
    "status": "submitted"
}
```

**Response (Time Expired - 403):**
```json
{
    "message": "Time already expired.",
    "status": "expired"
}
```

**Response (Not Found - 404):**
```json
{
    "message": "Timer not found"
}
```

---

## Architecture & Technical Details

### Backend Stack
- **Framework:** Flask 3.1.3
  - Lightweight and flexible Python web framework
  - Perfect for REST APIs and quick prototyping
  
- **Database:** SQLite with SQLAlchemy ORM
  - Zero configuration, file-based database
  - Automatic schema creation on startup
  - ACID compliance for data integrity
  
- **CORS Support:** Flask-CORS 6.0.2
  - Enables cross-origin requests for frontend-backend communication
  
- **Dependencies:**
  - SQLAlchemy 2.0.47: ORM for database operations
  - Werkzeug 3.1.6: WSGI utilities for Flask
  - Jinja2 3.1.6: Template engine for HTML rendering

### Frontend Stack
- **HTML5:** Semantic markup for the assessment interface
- **CSS3:** Modern styling with gradients and animations
- **Vanilla JavaScript:** No external libraries required
  - Fetch API for HTTP requests
  - DOM manipulation for real-time UI updates
  - Local state management for warning flags

### Database Schema

**TimerSession Model:**
```
Table: timer_session
├── id (Integer, Primary Key)
├── session_id (String, 100 chars)
├── question_id (String, 100 chars)
├── candidate_id (String, 100 chars)
├── start_time (DateTime)
├── end_time (DateTime)
├── status (String: active/submitted/expired)
├── auto_submitted (Boolean)
└── created_at (DateTime)
```

---

## How It Works

### Flow Diagram

```
1. USER LOADS PAGE
   ↓
2. checkExistingTimer() - Check for active sessions in DB
   ├─→ If active: Resume countdown
   ├─→ If submitted: Disable buttons, show status
   └─→ If expired: Show expiry message, disable buttons
   ↓
3. USER CLICKS "START TIMER"
   ↓
4. startTimer() Frontend → POST /timer/start Backend
   ↓
5. Backend: Create TimerSession (end_time = now + 30 min)
   ↓
6. Frontend: Receives remaining_time, disables Start button
   ↓
7. startCountdown() - Every 1 second:
   └─→ Fetch /timer/status from backend
   └─→ Check for expiry or warnings
   └─→ Update UI display
   ↓
8a. USER CLICKS "SUBMIT" (before time expires)
    └─→ POST /timer/submit → Backend updates status
    └─→ Show success message, disable Submit button
    ↓
8b. TIMER REACHES 0:00 (Auto-submit)
    └─→ Backend marks status as "expired"
    └─→ Frontend detects expiry
    └─→ Show "Auto-submitted" message
```

### Real-time Synchronization

- **Every second**, the frontend fetches the server time to prevent client-side manipulation
- **Backend calculates** remaining time as: `end_time - current_server_time`
- **Client cannot advance the timer** by modifying JavaScript or browser time
- **Failed submissions after expiry** are rejected by the backend

---

## Security Features

### 1. **Backend Time Authority**
- Server-side time calculation prevents client-side tampering
- Clients cannot advance or slow down the timer
- Expiry is determined by backend, not client

### 2. **Session Tracking**
- Each assessment session has a unique ID
- Multiple sessions can coexist independently
- Prevents interference between different candidates

### 3. **Status Validation**
- Cannot submit after expiry
- Cannot submit twice (status checked on attempt)
- Cannot restart a running timer without approval

### 4. **Database Persistence**
- All timer states saved immediately in SQLite
- Server crash doesn't lose timer data
- Can resume sessions after downtime

### 5. **Button State Protection**
- Start button disabled after timer begins
- Submit button disabled after successful submission
- Prevents accidental double-starts or resets

---

## Troubleshooting

### Issue: "Address already in use" error
**Solution:** Another process is using port 5000
```bash
# Kill the process and restart
# On Windows: Open Task Manager and end Python process
# Or use a different port in config.py
```

### Issue: Database locked error
**Solution:** Close all Flask instances and clear `instance/timer.db`
```bash
# Delete the database (it will be recreated)
del instance\timer.db
```

### Issue: Timer not syncing with backend
**Solution:** Ensure Flask is running and check browser console for errors
```bash
# Check if Flask is running: http://localhost:5000
# Open browser DevTools (F12) to see network requests
```

### Issue: CORS error in browser console
**Solution:** Already handled by Flask-CORS, but verify `app.py` has `CORS(app)`

---

## Development & Contribution

### Running in Development Mode
The application runs in debug mode by default:
```bash
python app.py
```

### Making Changes
1. Make code changes (they auto-reload in debug mode)
2. Refresh browser to see frontend changes
3. Backend changes trigger automatic restart

### Testing the APIs
Use tools like **Postman** or **cURL** to test APIs:
```bash
curl -X POST http://localhost:5000/timer/start \
  -H "Content-Type: application/json" \
  -d '{"session_id":"S1","question_id":"Q1","candidate_id":"C1"}'
```

---

## Changelog

### Version 1.0.0 (Initial Release)
- ✅ Core timer functionality (30 minutes per question)
- ✅ Real-time backend synchronization
- ✅ Auto-submit on expiry
- ✅ Warning alerts (5 min & 1 min)
- ✅ Page refresh resume capability
- ✅ Button state protection
- ✅ Manual tamper prevention
- ✅ RESTful API with full documentation
- ✅ Responsive UI with animations

---

**Created for Internship Assessment | Timer Module v1.0**
