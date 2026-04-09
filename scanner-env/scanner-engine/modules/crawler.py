from playwright.sync_api import sync_playwright
from urllib.parse import urlparse

def discover_endpoints(target_url, api_domain_filter=None):
    """
    Navigates to a frontend URL and captures all API endpoints it hits.
    """
    discovered_endpoints = set()

    with sync_playwright() as p:
        # Launch a headless browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Intercept network requests
        def handle_request(request):
            # We only care about XHR/Fetch (API calls), not images or CSS
            if request.resource_type in ["xhr", "fetch"]:
                url = request.url
                
                # Optional: Filter to only include your backend domain
                if api_domain_filter and api_domain_filter not in url:
                    return
                
                method = request.method
                discovered_endpoints.add((method, url))
                print(f"[+] Discovered API Call: {method} {url}")

        # Attach the event listener to the page
        page.on("request", handle_request)

        print(f"[*] Navigating to {target_url} to capture traffic...")
        # Go to the frontend app and wait for network to go idle
        page.goto(target_url, wait_until="networkidle")

        # Optional: You can add code here to interact with the page 
        # e.g., page.click("button#login") to trigger more API calls.

        browser.close()

    return list(discovered_endpoints)

# Quick Test
if __name__ == "__main__":
    frontend_app_url = "http://localhost:4200" # Your Angular app
    backend_domain = "localhost:3000"          # Your NestJS/Node app
    
    endpoints = capture_frontend_endpoints(frontend_app_url, backend_domain)
    print(f"\nTotal endpoints found: {len(endpoints)}")