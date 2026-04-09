# scanner/modules/bola_engine.py
import requests
import time

def run_bola_attack(target_uuids, base_url, token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    results = []
    
    for uuid in target_uuids:
        url = f"{base_url}{uuid}"
        response = requests.get(url, headers=headers)
        
        # (Add your logic to check for 200 OK and data extraction here)
        # Append findings to the results list
        
    return results