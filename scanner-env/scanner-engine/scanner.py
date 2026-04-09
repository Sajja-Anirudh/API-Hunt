# scanner/scanner.py

# 1. Import configurations
from config import FRONTEND_URL, BACKEND_DOMAIN, TARGET_UUIDS, VULNERABLE_API_BASE, ATTACKER_TOKEN

# 2. Import modules
from modules.crawler import discover_endpoints
from modules.bola_engine import run_bola_attack
# from modules.reporter import send_to_supabase

def main():
    print("=== API-HUNTER INITIALIZED ===")
    
    # Phase 1: Reconnaissance
    print("\n[PHASE 1] Crawling Frontend for Endpoints...")
    endpoints = discover_endpoints(FRONTEND_URL, BACKEND_DOMAIN)
    
    # Phase 2: Active Scanning (BOLA)
    print("\n[PHASE 2] Executing BOLA Attack on discovered parameters...")
    attack_results = run_bola_attack(TARGET_UUIDS, VULNERABLE_API_BASE, ATTACKER_TOKEN)
    
    # Phase 3: Reporting
    # print("\n[PHASE 3] Logging to Supabase...")
    # send_to_supabase(attack_results)

    print("\n=== SCAN COMPLETE ===")

if __name__ == "__main__":
    main()