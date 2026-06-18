from playwright.sync_api import Page, expect, sync_playwright
import time
import os

def test_aura_flow(page: Page):
    page.goto("http://localhost:8081")

    # Wait for the app to load
    page.wait_for_selector("text=Aura Flow")

    # Wait a bit for animations to settle
    time.sleep(2)

    # Find an intention and click it to toggle completion
    meditation_card = page.get_by_text("Morning Meditation").first
    meditation_card.click(force=True)

    # Wait for completion animation
    time.sleep(1)

    # Take screenshot
    page.screenshot(path="/app/verification/verification.png")

if __name__ == "__main__":
    os.makedirs("/app/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport
        context = browser.new_context(
            viewport={'width': 390, 'height': 844},
            is_mobile=True,
            has_touch=True
        )
        page = context.new_page()
        try:
            test_aura_flow(page)
        finally:
            browser.close()