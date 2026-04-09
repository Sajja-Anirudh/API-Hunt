# modules/crawler.py
from playwright.sync_api import sync_playwright
import jwt

def discover_endpoints(target_url):
    discovered_endpoints = set()
    looted_data = {"token": None, "uuid": None}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # --- Interceptors ---
        def handle_request(request):
            if request.resource_type in ["xhr", "fetch"]:
                discovered_endpoints.add((request.method, request.url))
                print(f"    [+] Discovered API: {request.method} {request.url}")

        def handle_response(response):
            if "login" in response.url and response.status in [200, 201]:
                try:
                    data = response.json()
                    if "token" in data:
                        looted_data["token"] = data["token"]
                        decoded = jwt.decode(data["token"], options={"verify_signature": False})
                        # Adjust key based on your Node.js JWT payload structure
                        looted_data["uuid"] = decoded.get("userId")       # The main ID for BOLA
                        looted_data["username"] = decoded.get("username") # Optional context
                        looted_data["dealer_id"] = decoded.get("dealer_id")
                        
                        print(f"\n    [!] JWT LOOTED.")
                        print(f"    [!] Extracted User ID: {looted_data['uuid']}")
                        print(f"    [!] Extracted Dealer ID: {looted_data['dealer_id']}\n")
                except Exception:
                    pass

        page.on("request", handle_request)
        page.on("response", handle_response)

        # --- Login Sequence ---
        print(f"[*] Navigating to {target_url}...")
        page.goto(target_url)
        page.wait_for_timeout(1000)

        print("[*] Executing Automated Login...")
        page.fill("#userUsername", "dealer_alpha")  
        page.fill("#userPassword", "password123")    
        page.click("button[type='submit']")
        page.wait_for_load_state("networkidle")

        # --- BFS SPIDERING ENGINE ---
        print("\n[*] Commencing BFS Spidering...")
        
        # Initialize our BFS Queue with the dashboard URL
        visited_urls = set([page.url])
        queue = [page.url]

        while queue:
            current_url = queue.pop(0)
            print(f"\n    -> [BFS] Exploring Page: {current_url}")
            
            # Navigate to the queued page
            if page.url != current_url:
                page.goto(current_url)
                page.wait_for_load_state("networkidle")

            # 1. Extract all new URLs (<a> tags) to add to our queue
            links = page.locator("a").all()
            for link in links:
                href = link.get_attribute("href")
                if href and href.startswith(target_url) and href not in visited_urls:
                    visited_urls.add(href)
                    queue.append(href)

            # 2. Interact with buttons on the CURRENT page
            buttons = page.locator("button").all()
            for i in range(len(buttons)):
                try:
                    # We have to re-locate the button in case the DOM slightly shifted
                    btn = page.locator("button").nth(i)
                    if btn.is_visible() and btn.is_enabled():
                        btn.click(timeout=1000)
                        page.wait_for_timeout(500) # Wait for potential API calls
                        
                        # CRITICAL FIX: If clicking the button redirected us away, GO BACK!
                        if page.url != current_url:
                            print(f"       [!] Redirect detected. Navigating back to maintain BFS state.")
                            page.go_back()
                            page.wait_for_load_state("networkidle")
                except Exception:
                    continue # Ignore unclickable buttons

        browser.close()

    return list(discovered_endpoints), looted_data