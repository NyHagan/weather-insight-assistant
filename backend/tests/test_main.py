from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_home_route():
    res = client.get("/")
    assert res.status_code == 200
    assert "status" in res.json()

def test_weather(monkeypatch):
    def fake_conn():
        class FakeCursor:
            def execute(self, query): pass
            @property
            def description(self): return [("temperature",), ("humidity",)]
            def fetchall(self): return [(22, 65)]
            def close(self): pass
        class FakeConn:
            def cursor(self): return FakeCursor()
            def close(self): pass
        return FakeConn()

    monkeypatch.setattr("backend.main.get_connection", fake_conn)

    res = client.get("/weather")
    assert res.status_code == 200
    assert "data" in res.json()
    assert isinstance(res.json()["data"], list)


def test_whoami(monkeypatch):
    def fake_conn():
        class FakeCursor:
            def execute(self, q): pass
            def fetchone(self): return ("fake_suser", "fake_user")
            def close(self): pass
        class FakeConn:
            def cursor(self): return FakeCursor()
            def close(self): pass
        return FakeConn()

    monkeypatch.setattr("backend.main.get_connection", fake_conn)

    res = client.get("/whoami")
    assert res.status_code == 200
    assert res.json() == {"login": "fake_suser", "db_user": "fake_user"}
