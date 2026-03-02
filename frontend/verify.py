from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Test mobile viewport (e.g., iPhone X size)
        page.set_viewport_size({"width": 375, "height": 812})

        # Take a screenshot of the Home page
        page.goto("http://localhost:5173")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="home_mobile.png", full_page=True)

        # Take a screenshot of the Chat page
        page.goto("http://localhost:5173/chat")
        page.wait_for_load_state("networkidle")
        page.screenshot(path="chat_mobile.png", full_page=True)

        # Take a screenshot of the Chat page with text
        page.fill("textarea", "This is a test message to see how it looks on mobile")
        page.screenshot(path="chat_mobile_typing.png")

        browser.close()

if __name__ == "__main__":
    main()
