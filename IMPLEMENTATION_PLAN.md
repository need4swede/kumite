# Kumite Web App Implementation Plan

## Overview
Build a CodeWars-inspired web application for serving coding challenges with an online IDE. The application will auto-discover challenges across multiple programming languages and provide real-time test execution.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React + Monaco Editor (VS Code's editor)
- **Containerization**: Docker + docker-compose

## File Structure Convention
All challenges follow a standardized structure:
```
challenges/
├── python/
│   └── unit-XXX/
│       ├── README.md      (challenge description)
│       ├── solution.py    (user edits this)
│       └── test.py        (unit tests)
├── javascript/
│   └── unit-XXX/
│       ├── README.md
│       ├── solution.js
│       └── test.js
└── [other languages]/
```

## Implementation Phases

### Phase 1: Restructure Existing Code
1. **Reorganize existing Python units into new structure**
   - Move `python/unit-XXX/` to `challenges/python/unit-XXX/`

2. **Rename files to standardized convention**
   - Rename `app.py` → `solution.py`
   - Rename `run.py` → `test.py`
   - Apply to all existing units

3. **Create README.md files for each unit**
   - Extract challenge descriptions/instructions
   - Format as markdown

### Phase 2: Backend Development
4. **Set up backend directory structure**
   - Create `backend/` directory
   - Create `requirements.txt` with dependencies:
     - FastAPI
     - uvicorn
     - pytest (for Python execution)

5. **Implement FastAPI main.py with API endpoints**
   - `GET /challenges` - List all challenges by language
   - `GET /challenges/{lang}/{unit}` - Get specific challenge details
   - `POST /execute/{lang}/{unit}` - Run user code against tests
   - CORS configuration for frontend

6. **Implement challenge_loader.py for auto-discovery**
   - Scan `challenges/` directory
   - Detect language folders
   - Load challenge metadata (README.md, starter code)
   - Cache challenge information

7. **Implement code_executor.py for running tests**
   - Language-agnostic interface
   - Python executor implementation (pytest)
   - Capture stdout, stderr, test results
   - Timeout and error handling

### Phase 3: Frontend Development
8. **Set up frontend directory structure with React + Vite**
   - Initialize React project using Vite
   - Configure TypeScript (optional) or JavaScript
   - Set up project structure

9. **Install and configure Monaco Editor**
   - Install `@monaco-editor/react`
   - Configure language support (Python, JavaScript, etc.)
   - Set up themes and editor options

10. **Implement ChallengeList component**
    - Display languages and units
    - Filter/search functionality
    - Challenge selection handler

11. **Implement CodeEditor component with Monaco**
    - Monaco Editor integration
    - Language-specific syntax highlighting
    - Code state management
    - "Run Tests" button

12. **Implement TestResults component**
    - Display test execution results
    - Show pass/fail status
    - Format stdout/stderr output
    - Error highlighting

### Phase 4: Dockerization
13. **Create Dockerfile for backend**
    - Python base image
    - Install dependencies
    - Copy backend code
    - Expose FastAPI port
    - Multi-stage build for optimization

14. **Create Dockerfile for frontend**
    - Node base image for build
    - Build React app
    - Nginx for serving static files
    - Multi-stage build

15. **Create docker-compose.yml**
    - Backend service configuration
    - Frontend service configuration
    - Volume mounts for challenges directory
    - Network configuration
    - Environment variables

### Phase 5: Testing
16. **Test the complete application locally**
    - Start services with docker-compose
    - Test challenge loading
    - Test code execution for Python
    - Verify UI/UX flow
    - Check error handling

## Scalability Design
- **Auto-discovery**: Backend automatically detects new languages/units
- **Standardized structure**: Same file naming across all languages
- **Executor pattern**: Easy to add new language executors
- **To add a new language**: Simply create `challenges/{language}/unit-XXX/` with the standard files