import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": 414, "height": 896},  # iPhone 11 Pro Max size for mobile look
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True
        )

        print("Navigating to local expo web server...")
        await page.goto("http://localhost:8081", timeout=60000)

        print("Waiting for root element...")
        await page.wait_for_selector('#root', state='visible', timeout=60000)

        # Wait a little bit for initial animations (FadeIn) to settle
        print("Waiting for animations to settle...")
        await page.wait_for_timeout(2000)

        print("Taking initial screenshot...")
        await page.screenshot(path="screenshot_initial.png")

        print("Clicking a task to complete it...")
        # Since it's animated with continuous scaling loops, we might need force=True
        # We find a task by its accessibility label which we added in the code
        task_locator = page.locator('div[aria-label="Complete task: Morning Yoga at 6am"]')
        if await task_locator.count() > 0:
             await task_locator.first.click(force=True)

             # Wait for the FadeOutUp animation to finish
             print("Waiting for task complete animation...")
             await page.wait_for_timeout(1000)

             print("Taking post-complete screenshot...")
             await page.screenshot(path="screenshot_post_complete.png")
        else:
            print("Could not find task to click")

        print("Clicking FAB to add task...")
        fab_locator = page.locator('div[aria-label="Add Task"]')
        if await fab_locator.count() > 0:
            await fab_locator.click(force=True)
            await page.wait_for_timeout(500)
            print("Taking post-FAB click screenshot...")
            await page.screenshot(path="screenshot_add_task.png")

        print("Clicking Focus Mode to toggle...")
        focus_locator = page.locator('div[aria-label="Toggle Focus Mode"]')
        if await focus_locator.count() > 0:
            await focus_locator.click(force=True)
            await page.wait_for_timeout(1000)
            print("Taking focus mode screenshot...")
            await page.screenshot(path="screenshot_focus_mode.png")

        await browser.close()
        print("Testing complete.")

asyncio.run(run())
