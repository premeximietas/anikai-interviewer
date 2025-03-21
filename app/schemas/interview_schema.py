from pydantic import BaseModel, Field
from typing import List, Optional

class Skill(BaseModel):
    name: str = Field(..., description="Name of the skill")
    description: str = Field(..., description="Description of the required skill")
    proficiency: str = Field(..., description="Proficiency level of the skill")

class InterviewRequest(BaseModel):
    interview_name: str = Field(..., description="Name of the interview")
    skills: List[Skill] = Field(..., description="List of required skills")
    custom_questions: Optional[List[str]] = Field(None, description="List of custom questions")
    interview_language: str = Field("en", description="Language of the interview")
    can_change_interview_language: bool = Field(False, description="Flag if language can be changed")
    only_coding_round: bool = Field(False, description="Flag for coding round only")
    is_coding_round_required: bool = Field(False, description="Flag to check if coding round is required")
    selected_coding_language: str = Field("python", description="Preferred coding language")
    is_proctoring_required: bool = Field(True, description="Flag for proctoring requirement")
