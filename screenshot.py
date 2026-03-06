import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:8081", timeout=30000)

        # Wait a bit for the JS to execute and render the app
        await page.wait_for_timeout(5000)

        # Take a screenshot
        await page.screenshot(path="screenshot.png")

        print("Screenshot taken as screenshot.png")
        await browser.close()

asyncio.run(run())
