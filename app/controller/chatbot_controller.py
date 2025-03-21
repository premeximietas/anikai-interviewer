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
        try:
            with db_session() as db:
                interviews = db.query(Interview).all()
                if not interviews:
                    return JSONResponse(
                        content={"interviews": []},
                        status_code=status.HTTP_200_OK
                    )
                interviews = [interview.to_dict() for interview in interviews]
            return JSONResponse(
                content={"interviews": interviews},
                status_code=status.HTTP_200_OK,
            )
        except Exception as e:
            return JSONResponse(
                content={"error": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

class UpdateInterView(HTTPEndpoint):
    async def patch(request:Request):
        try:
            data = await request.json()
            interview_data = InterviewRequest(**data)
            interview = Interview(**interview_data.dict())
            interview_id = request.path_params["interviewId"]
            if not interview_id:
                return JSONResponse(
                    content={"error": "Interview ID is required"},
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            with db_session() as db:  # Ensure db_session() is callable
                interview = db.query(Interview).filter(Interview.id == interview_id).first()
                if not interview:
                    return JSONResponse(
                        content={"error": "Interview not found"},
                        status_code=status.HTTP_404_NOT_FOUND
                    )
                for key, value in data.items():
                    if hasattr(interview, key) and key != "id":  # Ensure ID is not overwritten
                        setattr(interview, key, value)
                db.commit()
                db.refresh(interview)  # Refresh to get the generated ID

            return JSONResponse(
                content={"message": "Interview updated successfully", "id": interview.id},
                status_code=status.HTTP_200_OK
            )

        except Exception as e:
            return JSONResponse(
                content={"error": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )


class DeleteInterViews(HTTPEndpoint):
    async def delete(request:Request):
        try:
            data = await request.json()
            interview_id = request.path_params["interviewId"]
            if not interview_id:
                return JSONResponse(
                    content={"error": "Interview ID is required"},
                    status_code=status.HTTP_400_BAD_REQUEST
                )
            with db_session() as db:
                # Retrieve the interview by ID
                interview = db.query(Interview).filter(Interview.id == interview_id).first()
                if not interview:
                    return JSONResponse(
                        content={"error": "Interview not found"},
                        status_code=status.HTTP_404_NOT_FOUND
                    )
                db.delete(interview)
                db.commit()
                return JSONResponse(
                content={"message": "Interview deleted successfully", "id": interview_id},
                status_code=status.HTTP_200_OK
            )
        except Exception as e:
            return JSONResponse(
                content={"error": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST
            )
