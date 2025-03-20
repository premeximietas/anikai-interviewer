from fastapi.responses import JSONResponse
from starlette.endpoints import HTTPEndpoint
from fastapi import Request, status
from ..schemas.chatbot_schema import InterviewRequest
from ..models import Interview
from database.database_session import db_session


class CreateInterview(HTTPEndpoint):
    async def post(request: Request):
        try:
            data = await request.json()
            interview_data = InterviewRequest(**data)
            interview = Interview(**interview_data.dict())

            with db_session() as db:  # Ensure db_session() is callable
                db.add(interview)
                db.commit()
                db.refresh(interview)  # Refresh to get the generated ID

            return JSONResponse(
                content={"message": "Interview created successfully", "id": interview.id},
                status_code=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return JSONResponse(
                content={"error": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )


class GetAllInterViews(HTTPEndpoint):
    async def get(request:Request):
        pass

class UpdateInterView(HTTPEndpoint):
    async def patch(request:Request):
        pass


class DeleteInterViews(HTTPEndpoint):
    async def delete(request:Request):
        pass
