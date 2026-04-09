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
        { indent_id: "ind-1001", dealer_id: "d-11112222-3333-4444-5555-666677778888", model: "Range Rover Sport", status: "Delivered" },
        { indent_id: "ind-1002", dealer_id: "d-11112222-3333-4444-5555-666677778888", model: "Defender 110", status: "Pending" },
        { indent_id: "ind-1003", dealer_id: "d-99990000-1111-2222-3333-444455556666", model: "Discovery", status: "In Transit" },
        { indent_id: "ind-1004", dealer_id: "d-99990000-1111-2222-3333-444455556666", model: "Range Rover Evoque", status: "Delivered" }
    ],

    // Dealer Details
    dealers: [
        { dealer_id: "d-11112222-3333-4444-5555-666677778888", name: "Alpha Motors", location: "London North", rating: 4.8 },
        { dealer_id: "d-99990000-1111-2222-3333-444455556666", name: "Beta Autos", location: "Manchester Central", rating: 4.2 }
    ]
};

module.exports = db;