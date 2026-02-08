import requests
import base64

BASE_URL = "http://localhost:8000"

if __name__ == "__main__":
    # Test creating a post
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + base64.b64encode(b"andrew:maxwell").decode("utf-8")
    }
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content."
    }
    response = requests.post(f"{BASE_URL}/posts", json=post_data, headers=headers)
    post = response.json()

    assert response.status_code == 201

    post_id = post["id"]

    # Test retrieving the post by ID
    response = requests.get(f"{BASE_URL}/posts/{post_id}")
    assert response.status_code == 200
    retrieved_post = response.json()
    assert retrieved_post["title"] == post_data["title"]
    assert retrieved_post["content"] == post_data["content"]

    # Test retrieving posts with pagination
    response = requests.get(f"{BASE_URL}/posts", params={"limit": 1, "offset": 0})
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["id"] == post_id

    # Test creating a subscriber
    response = requests.post(
        f"{BASE_URL}/subscribers",
        json={
            "email": "test@test.com",
            "first_name": "Test",
            "last_name": "User"
        }
    )
    assert response.status_code == 201

    print("All tests passed.")