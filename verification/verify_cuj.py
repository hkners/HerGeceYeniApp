from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(2000)

    # Click first intention
    page.get_by_text("Morning Meditation").click(force=True)
    page.wait_for_timeout(1000)

    # Click second intention
    page.get_by_text("Deep Work Session").click(force=True)
    page.wait_for_timeout(1000)

    # Take screenshot at the key moment
    page.screenshot(path="/app/verification/screenshots/verification.png")
    page.wait_for_timeout(2000)  # Hold final state for the video

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/app/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

    # Rename video
    video_dir = "/app/verification/videos"
    for filename in os.listdir(video_dir):
        if filename.endswith(".webm") and filename != "video.webm":
            os.rename(os.path.join(video_dir, filename), os.path.join(video_dir, "video.webm"))
