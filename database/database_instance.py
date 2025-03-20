from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import SQLITE_DATABASE

print(SQLITE_DATABASE)

# Create the engine
engine = create_engine(f"sqlite:///{SQLITE_DATABASE}.db")

# Create declarative base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
