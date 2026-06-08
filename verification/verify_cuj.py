import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8081")
    page.wait_for_timeout(1000)

    # Click first intention
    page.locator('text=Morning Meditation').click(force=True)
    page.wait_for_timeout(1000)

    # Click second intention
    page.locator('text=Review Weekly Goals').click(force=True)
    page.wait_for_timeout(1000)

    # Uncheck first intention
    page.locator('text=Morning Meditation').click(force=True)
    page.wait_for_timeout(1000)

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

            # Find and rename the generated video
            video_dir = "/app/verification/videos"
            for file in os.listdir(video_dir):
                if file.endswith(".webm"):
                    os.rename(
                        os.path.join(video_dir, file),
                        os.path.join(video_dir, "video.webm")
                    )
                    break

            browser.close()