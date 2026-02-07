from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import students, interventions, dashboard
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
app.include_router(students.router)
app.include_router(interventions.router)
app.include_router(dashboard.router)

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
