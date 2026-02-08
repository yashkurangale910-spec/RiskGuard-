
Verify Dashboard Data & API Connectivity
The user reports missing data on the dashboard. We will verify the database state and API responses.

## Verification Steps
1. [ ] **Backend Health**: Verify `GET /health` returns 200 OK.
2. [ ] **Database Counts**: Run `debug_db.py` to confirm student/intervention counts > 0.
3. [ ] **API Endpoint (Students)**: Verify `GET /api/students` returns a clean JSON list (fixing the previous 500 error).
4. [ ] **API Endpoint (Dashboard)**: Verify `GET /api/dashboard/stats` returns valid statistics.
