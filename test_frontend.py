from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to local Expo web server...")
    # Wait for the Metro bundler to be ready
    time.sleep(15)
    page.goto("http://localhost:8081")

    # Wait for React Native Web to render the app
    page.wait_for_selector('text=Aura Flow', timeout=30000)
    print("Page loaded successfully.")

    # Wait for intentions to render
    page.wait_for_selector('text=Morning Meditation', timeout=10000)

    # Click an item to toggle
    print("Clicking 'Morning Meditation'...")
    item = page.get_by_text('Morning Meditation', exact=True)
    item.click(force=True)

    # Wait for animation
    time.sleep(2)

    # Click another item
    print("Clicking 'Review Weekly Goals'...")
    item2 = page.get_by_text('Review Weekly Goals', exact=True)
    item2.click(force=True)

    time.sleep(2)

    page.screenshot(path="screenshot.png")
    print("Screenshot saved to screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
