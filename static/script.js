const startBtn = document.getElementById("startBtn");
const submitBtn = document.getElementById("submitBtn");
const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status");

let interval = null;
let remainingTime = 0;
let fiveMinuteWarningShown = false;
let oneMinuteWarningShown = false;

// Dummy values (later will come from real session system)
const session_id = "S1";
const question_id = "Q1";
const candidate_id = "C1";

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

async function checkExistingTimer() {
    try {
        const response = await fetch("http://127.0.0.1:5000/timer/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id, question_id })
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.status === "running") {
            remainingTime = parseInt(data.remaining_time);
            timerDisplay.innerText = formatTime(remainingTime);

            startBtn.disabled = true;
            startCountdown();
        }

        if (data.status === "submitted") {
            timerDisplay.innerText = "00:00";
            statusText.innerText = "Answer already submitted.";
            startBtn.disabled = true;
            submitBtn.disabled = true;
        }

        if (data.status === "expired") {
            timerDisplay.innerText = "00:00";
            statusText.innerText = "Time Expired.";
            startBtn.disabled = true;
            submitBtn.disabled = true;
        }

    } catch (error) {
        console.log("No existing timer found.");
    }
}

function startCountdown() {
    if (interval) clearInterval(interval);

    interval = setInterval(async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/timer/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id, question_id })
            });

            const data = await response.json();

            console.log("Backend remaining:", data.remaining_time);

            remainingTime = parseInt(data.remaining_time);

            // 5-minute warning
            if (remainingTime <= 300 && !fiveMinuteWarningShown && remainingTime > 60) {
                alert("⚠️ 5 minutes remaining!");
                fiveMinuteWarningShown = true;
            }

            // 1-minute warning
            if (remainingTime <= 60 && !oneMinuteWarningShown && remainingTime > 0) {
                alert("⏳ Final minute remaining!");
                oneMinuteWarningShown = true;
            }

            timerDisplay.innerText = formatTime(remainingTime);

            if (data.status === "expired") {
                clearInterval(interval);
                submitBtn.disabled = true;
                statusText.innerText = "Time Expired. Auto-submitted.";
            }

        } catch (error) {
            console.error("Error fetching timer status:", error);
        }

    }, 1000);
}

startBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/timer/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id, question_id, candidate_id })
        });

        const data = await response.json();

        console.log("Start API remaining:", data.remaining_time);

        remainingTime = parseInt(data.remaining_time);
        timerDisplay.innerText = formatTime(remainingTime);

        statusText.innerText = "Timer Started";

        startBtn.disabled = true;

        fiveMinuteWarningShown = false;
        oneMinuteWarningShown = false;

        startCountdown();

    } catch (error) {
        console.error("Error starting timer:", error);
    }
});

submitBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/timer/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id, question_id })
        });

        const data = await response.json();

        if (!response.ok) {
            statusText.innerText = "Cannot submit. Timer already expired.";
            return;
        }

        statusText.innerText = data.message;

        if (data.status === "submitted") {
            clearInterval(interval);
            submitBtn.disabled = true;  
            statusText.innerText = "Answer submitted successfully.";
        }

    } catch (error) {
        console.error("Error submitting:", error);
    }
});

window.onload = function () {
    checkExistingTimer();
};