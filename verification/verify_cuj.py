import os
import glob
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(2000)

    # Click the first intention to toggle it
    page.get_by_text("Morning Meditation").click(force=True)
    page.wait_for_timeout(1000)

    # Take screenshot at the key moment
    page.screenshot(path="/app/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

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

    # Rename the dynamically generated video to a fixed path
    video_files = glob.glob("/app/verification/videos/*.webm")
    if video_files:
        os.rename(video_files[0], "/app/verification/videos/video.webm")
