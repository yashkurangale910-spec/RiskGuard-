from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import students, interventions, dashboard, auth, users
import uvicorn

app = FastAPI(title="College Dropout Identification & Support System API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In prod, specify the exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(students.router)
app.include_router(interventions.router)
app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {
        "message": "RiskGuard API is running",
        "docs": "/docs",
        "health": "/health",
        "frontend": "http://localhost:5173"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
