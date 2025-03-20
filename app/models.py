import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, DateTime, JSON
from database.database_instance import Base
from datetime import datetime

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String, unique=True, nullable=False, default=lambda: str(uuid.uuid5(uuid.NAMESPACE_DNS, "interview")))
    interview_name = Column(String, nullable=False)
    interview_language = Column(String, default="en")
    can_change_interview_language = Column(Boolean, default=False)
    only_coding_round = Column(Boolean, default=False)
    is_coding_round_required = Column(Boolean, default=False)
    selected_coding_language = Column(String, default="python")
class Interviewer(Base):
    __tablename__ = "interviewers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    interviewer_id = Column(String, unique=True, nullable=False, default=lambda: str(uuid.uuid5(uuid.NAMESPACE_DNS, "interviewer")))
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False)
    interview_id = Column(String, ForeignKey("interviews.interview_id"), nullable=False, default=lambda: str(uuid.uuid5(uuid.NAMESPACE_DNS, "interviewer")))
    
class InterviewFeedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String, ForeignKey("interviews.interview_id"), nullable=False)
    interviewer_id = Column(String, ForeignKey("interviewers.interviewer_id"), nullable=False)
    feedback_data = Column(JSON, nullable=False)  # Stores the entire feedback JSON in one column
    date_created = Column(DateTime, default=datetime.utcnow)
    date_modified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)