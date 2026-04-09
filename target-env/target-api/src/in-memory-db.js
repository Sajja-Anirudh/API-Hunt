// in-memory-db.js

const db = {
    users: [
        { 
            id: "u-91c7a8e2-3f41-4b7a-9d12-6e9c1a2b3c44", 
            username: "dealer_alpha", 
            password: "password123", 
            dealer_id: "d-4f92c1a7-8b33-4d61-a9f2-2c8e7b91d501" 
        },
        { 
            id: "u-7a2e6b19-5d88-4c9f-a3b1-9e4f2c6d8a10", 
            username: "dealer_beta", 
            password: "password123", 
            dealer_id: "d-a8c3e912-1f44-47d2-b8c1-7d3e9f2056ab" 
        }
    ],
    
    // Car Indent History (indent_id now UUID-like)
   car_indents: [
    { 
        indent_id: "d-55a1c9e3-7b22-4d81-b6e3-91a7c2f4d8e1", 
        dealer_id: "d-4f92c1a7-8b33-4d61-a9f2-2c8e7b91d501", 
        model: "Range Rover Sport", 
        status: "Delivered",
        purpose: "VIP Client Purchase",
        client_name: "John Matthews",
        client_contact: "+44-7700-900123",
        price: 125000,
        discount_applied: 5000,
        internal_notes: "High-value client, priority service",
        payment_status: "Completed",
        delivery_address: "221B Baker Street, London",
        finance_approved: true
    },
    { 
        indent_id: "d-6b2d4e91-3c55-4f8a-a7d2-3e1f9b6c2a44", 
        dealer_id: "d-4f92c1a7-8b33-4d61-a9f2-2c8e7b91d501", 
        model: "Defender 110", 
        status: "Pending",
        purpose: "Corporate Fleet",
        client_name: "Apex Logistics Ltd.",
        client_contact: "+44-7700-900456",
        price: 98000,
        discount_applied: 8000,
        internal_notes: "Bulk order negotiation ongoing",
        payment_status: "Pending",
        delivery_address: "Docklands Business Park, London",
        finance_approved: false
    },
    { 
        indent_id: "d-9f3a7c12-8e66-4a2b-b9c1-5d7e3f2a1c90", 
        dealer_id: "d-a8c3e912-1f44-47d2-b8c1-7d3e9f2056ab", 
        model: "Discovery", 
        status: "In Transit",
        purpose: "Personal Use",
        client_name: "Sarah Collins",
        client_contact: "+44-7700-900789",
        price: 87000,
        discount_applied: 3000,
        internal_notes: "Requested custom interior",
        payment_status: "Partially Paid",
        delivery_address: "Manchester City Centre",
        finance_approved: true
    },
    { 
        indent_id: "d-c1e4b782-2a11-4d9c-a5f3-8b6d2e7f9012", 
        dealer_id: "d-a8c3e912-1f44-47d2-b8c1-7d3e9f2056ab", 
        model: "Range Rover Evoque", 
        status: "Delivered",
        purpose: "Luxury Lease",
        client_name: "David Turner",
        client_contact: "+44-7700-901000",
        price: 72000,
        discount_applied: 2000,
        internal_notes: "Lease agreement confidential",
        payment_status: "Completed",
        delivery_address: "Manchester Central",
        finance_approved: true
    }
    ],

    dealers: [
        { 
            dealer_id: "d-4f92c1a7-8b33-4d61-a9f2-2c8e7b91d501", 
            name: "Alpha Motors", 
            location: "London North", 
            rating: 4.8 
        },
        { 
            dealer_id: "d-a8c3e912-1f44-47d2-b8c1-7d3e9f2056ab", 
            name: "Beta Autos", 
            location: "Manchester Central", 
            rating: 4.2 
        }
    ]
};

module.exports = db;