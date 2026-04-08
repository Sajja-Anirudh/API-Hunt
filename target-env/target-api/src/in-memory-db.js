// A simple in-memory database simulating the Dealership Management Software
const db = {
    // We have two dealers to demonstrate BOLA. Dealer 101 and Dealer 102.
    users: [
        { id: 1, username: "dealer_alpha", password: "password123", dealer_id: 101 },
        { id: 2, username: "dealer_beta", password: "password123", dealer_id: 102 }
    ],
    
    // Car Indent History
    car_indents: [
        { indent_id: 1001, dealer_id: 101, model: "Range Rover Sport", status: "Delivered" },
        { indent_id: 1002, dealer_id: 101, model: "Defender 110", status: "Pending" },
        { indent_id: 1003, dealer_id: 102, model: "Discovery", status: "In Transit" },
        { indent_id: 1004, dealer_id: 102, model: "Range Rover Evoque", status: "Delivered" }
    ],

    // Dealer Details
    dealers: [
        { dealer_id: 101, name: "Alpha Motors", location: "London North", rating: 4.8 },
        { dealer_id: 102, name: "Beta Autos", location: "Manchester Central", rating: 4.2 }
    ]
};

module.exports = db;