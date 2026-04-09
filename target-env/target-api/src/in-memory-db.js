// in-memory-db.js
const db = {
    // We have two dealers to demonstrate BOLA using UUIDs
    users: [
        {
            id: "u-a1b2c3d4-1000-4000-8000-abcdef123456",
            username: "dealer_alpha",
            password: "password123",
            dealer_id: "d-11112222-3333-4444-5555-666677778888"
        },
        {
            id: "u-e5f6g7h8-2000-4000-8000-abcdef654321",
            username: "dealer_beta",
            password: "password123",
            dealer_id: "d-99990000-1111-2222-3333-444455556666"
        }
    ],

    // Car Indent History (Notice they map to the new Dealer UUIDs)
    car_indents: [
        { 
            indent_id: "ind-1001", 
            dealer_id: "d-11112222-3333-4444-5555-666677778888", 
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
        }, { 
            indent_id: "ind-1002", 
            dealer_id: "d-11112222-3333-4444-5555-666677778888", 
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
        }, { 
            indent_id: "ind-1003", 
            dealer_id: "d-99990000-1111-2222-3333-444455556666", 
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
        }, { 
            indent_id: "ind-1004", 
            dealer_id: "d-99990000-1111-2222-3333-444455556666", 
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

    // Dealer Details
    dealers: [
        { 
            dealer_id: "d-11112222-3333-4444-5555-666677778888", 
            name: "Alpha Motors", 
            location: "London North", 
            rating: 4.8 
        }, { 
            dealer_id: "d-99990000-1111-2222-3333-444455556666", 
            name: "Beta Autos", 
            location: "Manchester Central", 
            rating: 4.2 
        }
    ]
};

module.exports = db;