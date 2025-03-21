from config import router
from .controller.chatbot_controller import * 

router.add_api_route(
    "/interview",
    CreateInterview.post,
    methods=["POST"],
)

router.add_api_route(
    "/interview",
    GetAllInterViews.get,
    methods=["GET"],
)

router.add_api_route(
    "/interview/{interviewId}",
    UpdateInterView.patch,
    methods=["PATCh"],
)

router.add_api_route(
    "/interview/{interviewId}",
    DeleteInterViews.delete,
    methods=["DELETE"],
)