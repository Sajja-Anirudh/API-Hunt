import os
import sys
from dotenv import load_dotenv
from modules.crawler import discover_endpoints
from modules.bola_engine import run_bola_attack

load_dotenv()

# Target Application & Credentials from .env
FRONTEND_URL = os.getenv("TARGET_FRONTEND_URL", "http://localhost:5173")
USERNAME = os.getenv("ATTACKER_USERNAME", "dealer_alpha")
PASSWORD = os.getenv("ATTACKER_PASSWORD", "password123")

# Hardcoded victims we want to steal data from
VICTIM_TARGETS = [
    "u-e5f6g7h8-2000-4000-8000-abcdef654321",  # Victim User UUID
    "d-99990000-1111-2222-3333-444455556666"   # Victim Dealer UUID
]

def main():
    print("=== API-HUNTER INITIALIZED ===")
    
    credentials = {
        "username": USERNAME,
        "password": PASSWORD
    }
    
    # PHASE 1: Crawl and Loot
    print("\n[PHASE 1] Crawling Frontend & Looting Credentials...")
    # Make sure your discover_endpoints function accepts the credentials parameter!
    discovered_endpoints, looted_data = discover_endpoints(FRONTEND_URL)
    
    print(f"\n[*] Total Endpoints Discovered: {len(discovered_endpoints)}")
    for ep in discovered_endpoints:
        print(f"    - {ep}")

    # PHASE 2: BOLA Attack & CI/CD Logic
    if looted_data.get("token"):
        # Run the attack exactly ONCE
        attack_results = run_bola_attack(discovered_endpoints, looted_data, VICTIM_TARGETS)
        
        print("\n=== SCAN COMPLETE ===")
        
        # --- DEVSECOPS LOGIC ---
        if len(attack_results) > 0:
            print("\n[!!!] CI/CD GATE TRIGGERED: Critical BOLA vulnerabilities found!")
            print("[!!!] FAILED: Blocking deployment to production.")
            sys.exit(1) # Fails the GitHub Action
        else:
            print("\n[*] CI/CD GATE PASSED: No BOLA vulnerabilities detected.")
            sys.exit(0) # Passes the GitHub Action
    else:
        print("\n[X] Aborting Phase 2: No valid JWT looted during Phase 1.")
        print("\n=== SCAN COMPLETE ===")
        sys.exit(1) # Fail the build if the scanner can't even log in

if __name__ == "__main__":
    main()