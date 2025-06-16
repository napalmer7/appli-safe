# App Safety Backend

This FastAPI-based backend powers the child app safety dashboard.

## Setup

1. Create a virtual environment and activate it.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Add your MongoDB connection string to `.env`:

```env
MONGO_URI=your-mongodb-uri
```

4. Run the API:

```bash
uvicorn main:app --reload
```

Endpoints:
- `POST /apps/`: Add app
- `GET /apps/`: List apps (with optional filters)
- `POST /feedback/`: Submit feedback
- `GET /feedback/{app_id}`: Get feedback by app