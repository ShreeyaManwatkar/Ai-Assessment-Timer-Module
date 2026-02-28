from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class TimerSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    session_id = db.Column(db.String(100), nullable=False)
    question_id = db.Column(db.String(100), nullable=False)
    candidate_id = db.Column(db.String(100), nullable=False)

    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String(20), default="active")  
    # active | submitted | expired

    auto_submitted = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TimerSession {self.session_id} - {self.question_id}>"