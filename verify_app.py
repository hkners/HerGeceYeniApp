from playwright.sync_api import sync_playwright, expect

def test_app_performance_change(page):
    page.goto("http://localhost:8081", wait_until="networkidle")

    # Wait for the main title to appear to ensure the app is loaded
    expect(page.locator("text=Aura Flow")).to_be_visible(timeout=10000)

    # In React Native Web, Animated views that are scaling constantly might never be "stable" for Playwright's click.
    # Let's force click it or click its parent.
    page.locator("text=Morning Meditation").click(force=True)

    # Allow some time for animation and state updates
    page.wait_for_timeout(1000)

    # Take a screenshot to verify the UI hasn't been visually broken by the memoization
    page.screenshot(path="verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_app_performance_change(page)
        finally:
            browser.close()
