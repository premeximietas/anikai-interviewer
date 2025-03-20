# anikai-interviewer
Anikai-Interviewer is an AI-powered assessment platform designed to streamline candidate evaluations. It enables structured skill-based assessments, custom questions, and coding tests while ensuring fairness and accuracy through automated proctoring and intelligent insights.


## Project Structure
```
anikai-interviewer/
│── app/
│   ├── controller/
│   │   └── chatbot_controller.py
│   ├── helper/
│   │   └── chatbot_helper.py
│   ├── schemas/
│   │   ├── chatbot_schema.py
│   │   ├── models.py
│   │   ├── routes.py
│   ├── database/
│── .env
│── .gitignore
│── config.py
│── LICENSE
│── main.py
│── README.md
```

# Folders and Files Explanation

### app/

#### controller/
`chatbot_controller.py`: Handles API endpoints related to chatbot operations.

#### helper/
`chatbot_helper.py`: Implements logic for chatbot interactions, such as response processing.

#### schemas/
`chatbot_schema.py`: Defines request/response models for chatbot APIs.

`models.py`: Defines database models using SQLAlchemy.

`routes.py`: Registers and organizes API routes.

#### database/
This folder is intended for database configurations and session management

#### config.py
Contains application-level configurations, including database connections and external service settings.

#### main.py
The entry point of the FastAPI application.
Initializes the app and includes API routes.


## 🚀 Getting Started

### Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/activate   # On macOS/Linux
venv\Scripts\activate      # On Windows
```
### Install dependencies:
```
pip install -r requirements.txt
```
### Set up the .env file:
```
cp .env.example .env
```
### Run the application:
```
python main.py
```

