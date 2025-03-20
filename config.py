from fastapi import FastAPI, APIRouter
from sqlalchemy.orm import declarative_base


import os

from dotenv import load_dotenv

load_dotenv()

SQLITE_DATABASE = os.environ.get("SQLITE_DATABASE")

Base = declarative_base()


app = FastAPI()
router = APIRouter()