class HealthTracker:
    def __init__(self) -> None:
        self.is_healthy: bool = False

    def mark_healthy(self) -> None:
        self.is_healthy = True
        print("[HEALTH] Backend marked healthy.")

    def mark_unhealthy(self) -> None:
        self.is_healthy = False
        print("[HEALTH] Backend shutting down.")

    def status(self) -> dict:
        return {
            "status": "healthy" if self.is_healthy else "unhealthy"
        }

# Singleton instance (optional)
health_tracker = HealthTracker()