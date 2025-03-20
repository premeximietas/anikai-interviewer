from database.database_instance import Base, engine

def initialize_database():
    """Initialize database tables if they don't exist."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        raise