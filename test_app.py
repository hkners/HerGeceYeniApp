import time
import os
from playwright.sync_api import sync_playwright

def test_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()

        try:
            page.goto('http://localhost:8081')
            time.sleep(15)  # Wait for Metro bundler

            # Initial screenshot
            page.screenshot(path='/home/jules/verification/screenshots/screenshot.png')
            page.wait_for_timeout(500)

            # Test interactions (clicking the first habit)
            element = page.locator('[role="checkbox"]').nth(0)
            if element.is_visible():
                element.click(force=True)
                page.wait_for_timeout(1000)
                page.screenshot(path='/home/jules/verification/screenshots/interaction.png')
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    test_app()
