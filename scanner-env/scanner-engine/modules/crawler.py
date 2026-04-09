# modules/crawler.py
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright
import jwt

DEFAULT_CREDENTIALS = {
    "username": "dealer_alpha",
    "password": "password123",
}

LOGIN_FIELD_HINTS = ["user", "email", "login", "username", "dealer", "userusername"]
SKIP_BUTTON_TEXT = ["logout", "sign out", "delete", "remove"]


def _normalize_url(base, href):
    if not href:
        return None
    if href.startswith("/"):
        return urljoin(base, href)
    if href.startswith("http://") or href.startswith("https://"):
        return href
    return urljoin(base, href)


def _same_origin(url_a, url_b):
    return urlparse(url_a).netloc == urlparse(url_b).netloc


def _extract_token_payload(token):
    decoded = jwt.decode(token, options={"verify_signature": False})
    return {
        "uuid": decoded.get("userId") or decoded.get("uuid") or decoded.get("sub"),
        "username": decoded.get("username") or decoded.get("user") or decoded.get("name"),
        "dealer_id": decoded.get("dealer_id") or decoded.get("dealerId") or decoded.get("dealer")
    }


def _find_login_form(page):
    # Find the password field first, then identify the corresponding username/email field.
    password_fields = page.locator('input[type="password"]')
    if password_fields.count() == 0:
        return None

    password_field = password_fields.first
    username_field = None

    candidate_fields = page.locator('input[type="text"], input[type="email"], input:not([type])')
    for i in range(candidate_fields.count()):
        field = candidate_fields.nth(i)
        attrs = (
            (field.get_attribute("id") or "") + " " +
            (field.get_attribute("name") or "") + " " +
            (field.get_attribute("placeholder") or "") + " " +
            (field.get_attribute("aria-label") or "")
        ).lower()
        if any(hint in attrs for hint in LOGIN_FIELD_HINTS):
            username_field = field
            break

    if not username_field and candidate_fields.count() > 0:
        username_field = candidate_fields.first

    return username_field, password_field


def _find_login_submit(page):
    submit_selectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("sign in")',
        'button:has-text("login")',
        'button:has-text("unlock")',
        'input[type="button"]',
    ]

    for selector in submit_selectors:
        button = page.locator(selector).first
        if button.count() and button.is_visible() and button.is_enabled():
            return button

    return None


def _fill_login_form(page, credentials):
    login_inputs = _find_login_form(page)
    if not login_inputs:
        return False

    username_field, password_field = login_inputs
    if not username_field or not password_field:
        return False

    username_field.fill(credentials["username"])
    password_field.fill(credentials["password"])

    submit_button = _find_login_submit(page)
    if submit_button:
        submit_button.click()
        return True

    password_field.press("Enter")
    return True


def _safe_click(button, current_url, page):
    try:
        text = (button.inner_text() or "").lower()
        if any(skip in text for skip in SKIP_BUTTON_TEXT):
            return
        button.click(timeout=1500)
        page.wait_for_timeout(700)
        if page.url != current_url:
            page.go_back()
            page.wait_for_load_state("networkidle")
    except Exception:
        return


def _interact_history_page(page):
    try:
        model_input = page.locator('input[placeholder="Enter Car Model..."]').first
        add_button = page.locator('button:has-text("+ Add"), button:has-text("Add")').first
        if model_input.count() and add_button.count() and add_button.is_visible() and add_button.is_enabled():
            model_input.fill("Test Model")
            add_button.click()
            page.wait_for_timeout(1200)

        delete_button = page.locator('button:has-text("Delete")').first
        if delete_button.count() and delete_button.is_visible() and delete_button.is_enabled():
            delete_button.click()
            page.wait_for_timeout(1200)
    except Exception:
        return


def _scan_form_actions(page, base_url, discovered_endpoints):
    for form in page.locator("form").all():
        action = form.get_attribute("action")
        method = (form.get_attribute("method") or "GET").upper()
        normalized = _normalize_url(base_url, action)
        if normalized:
            discovered_endpoints.add((method, normalized))


def discover_endpoints(target_url):
    discovered_endpoints = set()
    looted_data = {"token": None, "uuid": None, "username": None, "dealer_id": None}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        target_origin = urlparse(target_url).netloc

        def handle_request(request):
            if request.resource_type in ["xhr", "fetch"]:
                discovered_endpoints.add((request.method, request.url))
                print(f"    [+] Discovered API: {request.method} {request.url}")

        def handle_response(response):
            if response.status in [200, 201] and response.request.resource_type in ["xhr", "fetch"]:
                try:
                    data = response.json()
                except Exception:
                    return

                if isinstance(data, dict) and "token" in data:
                    token = data["token"]
                    looted_data["token"] = token
                    payload = _extract_token_payload(token)
                    looted_data.update(payload)
                    print("\n    [!] JWT LOOTED.")
                    print(f"    [!] Extracted User ID: {looted_data['uuid']}")
                    print(f"    [!] Extracted Dealer ID: {looted_data['dealer_id']}")
                    print(f"    [!] Extracted Username: {looted_data['username']}\n")

        page.on("request", handle_request)
        page.on("response", handle_response)

        login_url = _normalize_url(target_url, "/login")
        print(f"[*] Navigating to login page: {login_url}...")
        page.goto(login_url)
        page.wait_for_load_state("networkidle")

        print("[*] Looking for login form...")
        try:
            page.wait_for_selector('input[type="password"]', timeout=8000)
        except Exception:
            pass

        if _fill_login_form(page, DEFAULT_CREDENTIALS):
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(1500)
            print("[*] Login form submitted.")
        else:
            print("[!] No login form found on /login. Trying root page for login form...")
            page.goto(target_url)
            page.wait_for_load_state("networkidle")
            if _fill_login_form(page, DEFAULT_CREDENTIALS):
                page.wait_for_load_state("networkidle")
                page.wait_for_timeout(1500)
                print("[*] Login form submitted from root page.")
            else:
                print("[!] Still no login form found. Continuing without automated login.")

        if not looted_data["token"]:
            stored_token = page.evaluate("() => window.localStorage.getItem('dealer_token')")
            if stored_token:
                looted_data["token"] = stored_token
                looted_data.update(_extract_token_payload(stored_token))
                print("\n    [!] JWT LOOTED from localStorage.")
                print(f"    [!] Extracted User ID: {looted_data['uuid']}")
                print(f"    [!] Extracted Dealer ID: {looted_data['dealer_id']}")
                print(f"    [!] Extracted Username: {looted_data['username']}\n")

        print("\n[*] Commencing BFS spidering and endpoint discovery...")
        visited_urls = set([page.url])
        queue = [page.url]

        while queue:
            current_url = queue.pop(0)
            print(f"\n    -> [BFS] Exploring Page: {current_url}")

            if page.url != current_url:
                page.goto(current_url)
                page.wait_for_load_state("networkidle")

            _scan_form_actions(page, current_url, discovered_endpoints)

            if "/dashboard/history" in current_url:
                _interact_history_page(page)

            anchors = page.locator("a[href]")
            for i in range(anchors.count()):
                link = anchors.nth(i)
                href = link.get_attribute("href")
                normalized = _normalize_url(current_url, href)
                if normalized and _same_origin(normalized, target_url) and normalized not in visited_urls:
                    visited_urls.add(normalized)
                    queue.append(normalized)

            buttons = page.locator("button")
            for i in range(buttons.count()):
                _safe_click(buttons.nth(i), current_url, page)

            # Also click links that look like buttons and may trigger API activity
            link_buttons = page.locator('a:has-text("Continue"), a:has-text("Next"), a:has-text("Dashboard"), a:has-text("History")')
            for i in range(link_buttons.count()):
                try:
                    btn = link_buttons.nth(i)
                    if btn.is_visible() and btn.is_enabled():
                        btn.click()
                        page.wait_for_timeout(500)
                        if page.url != current_url:
                            page.go_back()
                            page.wait_for_load_state("networkidle")
                except Exception:
                    continue

        browser.close()

    return [f"{method} {url}" for method, url in sorted(discovered_endpoints)], looted_data