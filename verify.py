from playwright.sync_api import sync_playwright
import os
import glob

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(2000)

    # Click the first intention card
    page.get_by_text("Morning Meditation").click(force=True)
    page.wait_for_timeout(1000)

    # Click the third intention card
    page.get_by_text("Deep Work Flow").click(force=True)
    page.wait_for_timeout(1000)

    # Take screenshot at the key moment
    page.screenshot(path="./verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

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

    # Rename the video file to a known path
    video_files = glob.glob("./verification/videos/*.webm")
    if video_files:
        os.rename(video_files[0], "./verification/videos/video.webm")
