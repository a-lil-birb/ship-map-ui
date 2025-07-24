const mockContainers = [
  {
    id: "CTN-1001",
    type: "reefer",
    status: "good",
    co2PerKm: 8.2,
    coldChainPenalty: 35, // Percentage extra
    shipId: 1,
    goods: {
      description: "Fresh salmon",
      category: "perishable",
      condition: "good",
      perishability: 15, // Percentage (0-100)
      weight: 18 // tons
    }
  },
  {
    id: "CTN-1002",
    type: "reefer",
    status: "warning",
    co2PerKm: 7.8,
    coldChainPenalty: 35,
    shipId: 1,
    goods: {
      description: "Pharmaceuticals",
      category: "temperature-sensitive",
      condition: "moderate",
      perishability: 42,
      weight: 12
    }
  },
  {
    id: "CTN-2001",
    type: "dry",
    status: "good",
    co2PerKm: 4.1,
    coldChainPenalty: 0,
    shipId: 2,
    goods: {
      description: "Electronics",
      category: "durable",
      condition: "good",
      perishability: 2,
      weight: 22
    }
  },
  {
    id: "CTN-2002",
    type: "dry",
    status: "good",
    co2PerKm: 3.9,
    coldChainPenalty: 0,
    shipId: 2,
    goods: {
      description: "Automotive parts",
      category: "industrial",
      condition: "good",
      perishability: 5,
      weight: 25
    }
  },
  {
    id: "CTN-3001",
    type: "reefer",
    status: "critical",
    co2PerKm: 9.1,
    coldChainPenalty: 40,
    shipId: 3,
    goods: {
      description: "Organic produce",
      category: "perishable",
      condition: "critical",
      perishability: 85,
      weight: 15
    }
  },
  {
    id: "CTN-4001",
    type: "dry",
    status: "good",
    co2PerKm: 4.3,
    coldChainPenalty: 0,
    shipId: 4,
    goods: {
      description: "Textiles",
      category: "non-perishable",
      condition: "good",
      perishability: 1,
      weight: 20
    }
  }
];