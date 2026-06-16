import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(3000) # wait for metro

    # Click first intention
    page.get_by_text("Morning Meditation").click(force=True)
    page.wait_for_timeout(1000)

    # Click second intention
    page.get_by_text("Review Weekly Goals").click(force=True)
    page.wait_for_timeout(1000)

    page.screenshot(path="./verification/screenshots/verification.png")
    page.wait_for_timeout(1500)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="./verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

    # rename video to a fixed path
    video_dir = "./verification/videos"
    video_files = [f for f in os.listdir(video_dir) if f.endswith(".webm")]
    if video_files:
        original_video = os.path.join(video_dir, video_files[0])
        renamed_video = os.path.join(video_dir, "video.webm")
        os.rename(original_video, renamed_video)