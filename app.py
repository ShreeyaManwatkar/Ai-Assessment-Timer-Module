from flask import Flask
from flask_cors import CORS
from models import db
from flask import request, jsonify
from datetime import datetime, timedelta
from models import TimerSession
from flask import render_template

app = Flask(__name__)
CORS(app)

app.config.from_object("config.Config")    #Loading config

db.init_app(app)     #initialize database

@app.route("/")
def home():
    return {"message": "Timer System API Running"}


@app.route("/timer/start", methods=["POST"])
def start_timer():
    data = request.get_json()

    session_id = data.get("session_id")
    question_id = data.get("question_id")
    candidate_id = data.get("candidate_id")

    # Delete existing timer if any
    existing_timer = TimerSession.query.filter_by(
        session_id=session_id,
        question_id=question_id
    ).first()

    if existing_timer:
        db.session.delete(existing_timer)
        db.session.commit()

    # Create new timer
    start_time = datetime.utcnow()
    end_time = start_time + timedelta(minutes=40)

    new_timer = TimerSession(
        session_id=session_id,
        question_id=question_id,
        candidate_id=candidate_id,
        start_time=start_time,
        end_time=end_time,
        status="running"
    )

    db.session.add(new_timer)
    db.session.commit()

    return jsonify({
        "remaining_time": 2400,
        "status": "running"
    })


@app.route("/timer/status", methods=["POST"])
def timer_status():
    data = request.get_json()

    session_id = data.get("session_id")
    question_id = data.get("question_id")

    timer = TimerSession.query.filter_by(
        session_id=session_id,
        question_id=question_id
    ).first()

    if not timer:
        return jsonify({"message": "Timer not found"}), 404

    now = datetime.utcnow()

    remaining_time = (timer.end_time - now).total_seconds()

    if remaining_time <= 0:
        timer.status = "expired"
        db.session.commit()
        remaining_time = 0

    return jsonify({
        "remaining_time": int(remaining_time),
        "status": timer.status
    })

@app.route("/timer/submit", methods=["POST"])
def submit_answer():
    data = request.get_json()

    session_id = data.get("session_id")
    question_id = data.get("question_id")

    timer = TimerSession.query.filter_by(
        session_id=session_id,
        question_id=question_id
    ).first()

    if not timer:
        return jsonify({"message": "Timer not found"}), 404

    now = datetime.utcnow()
    remaining_time = (timer.end_time - now).total_seconds()

    if remaining_time <= 0:
        timer.status = "expired"
        db.session.commit()
        return jsonify({
            "message": "Time already expired.",
            "status": "expired"
        }), 403

    timer.status = "submitted"
    db.session.commit()

    return jsonify({
        "message": "Answer submitted successfully.",
        "status": "submitted"
    })

@app.route("/assessment")
def assessment_page():
    return render_template("index.html")



if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
