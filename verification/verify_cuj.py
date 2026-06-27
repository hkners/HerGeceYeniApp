from playwright.sync_api import sync_playwright
import os
import glob

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(1000)

    # Click first intention
    page.get_by_text("Morning Meditation (10 min)").click(force=True)
    page.wait_for_timeout(800)

    # Click second intention
    page.get_by_text("Hydrate: Drink 2L of water").click(force=True)
    page.wait_for_timeout(800)

    # Toggle first back off
    page.get_by_text("Morning Meditation (10 min)").click(force=True)
    page.wait_for_timeout(800)

    page.screenshot(path="verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

            video_files = glob.glob("verification/videos/*.webm")
            if video_files:
                os.rename(video_files[0], "verification/videos/video.webm")
