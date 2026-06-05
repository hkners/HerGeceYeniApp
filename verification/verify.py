from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:8081")  # Metro Bundler default port
    page.wait_for_timeout(2000) # Wait for bundling

    # Toggle 'Morning Meditation'
    page.get_by_text("Morning Meditation").click(force=True)
    page.wait_for_timeout(1000)

    # Toggle 'Review Weekly Goals'
    page.get_by_text("Review Weekly Goals").click(force=True)
    page.wait_for_timeout(1000)

    # Toggle 'Hydrate & Stretch'
    page.get_by_text("Hydrate & Stretch").click(force=True)
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
            browser.close()

    # Rename video to a fixed path
    video_files = os.listdir("/app/verification/videos")
    webm_files = [f for f in video_files if f.endswith('.webm')]
    if webm_files:
        old_path = os.path.join("/app/verification/videos", webm_files[0])
        new_path = "/app/verification/videos/video.webm"
        os.rename(old_path, new_path)
