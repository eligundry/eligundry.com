import os

import requests
from requests.auth import HTTPBasicAuth
from PIL import Image

host = os.getenv("ELIGUNDRY_HOST")
password = os.getenv("PASSWORD")
auth = HTTPBasicAuth('eligundry', password)
resp = requests.get(
    f"https://{host}/api/memes",
    verify=False,
    auth=auth,
)
memes = resp.json()

for meme in memes:
    if all(meme['size']):
        continue

    print(f"fetching image {meme['url']}")
    image_resp = requests.get(meme['url'], stream=True)
    image_resp.raw.decode_content = True
    img = Image.open(image_resp.raw)
    width, height = img.size

    print(f"updating image size for {meme['url']}")
    requests.patch(
        f"https://{host}/api/memes/{meme['id']}",
        json={
            'width': width,
            'height': height,
        },
        auth=auth,
        verify=False,
    )
