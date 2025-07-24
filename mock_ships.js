const mockShips = [
  {
    id: 1,
    name: "Ocean Carrier",
    type: "Container Ship",
    status: "In Transit",
    lat: 35.0,
    lon: -40.0,
    speed: 22.5,
    course: 145,
    icon: "🛳️",
    color: "#3498db",
    emissions: [45, 12, 8],
    containers: ["CTN-1001", "CTN-1002"]
  },
  {
    id: 2,
    name: "Petrol Voyager",
    type: "Oil Tanker",
    status: "Loading",
    lat: 51.0,
    lon: -10.0,
    speed: 18.2,
    course: 270,
    icon: "⛴️",
    color: "#e74c3c",
    emissions: [62, 18, 15],
    containers: ["CTN-2001", "CTN-2002"]
  },
  {
    id: 3,
    name: "Swift Cargo",
    type: "Bulk Carrier",
    status: "In Transit",
    lat: 20.0,
    lon: -20.0,
    speed: 15.7,
    course: 80,
    icon: "🚢",
    color: "#2ecc71",
    emissions: [38, 10, 7],
    containers: ["CTN-3001"]
  },
  {
    id: 4,
    name: "Wind Runner",
    type: "Sailing Vessel",
    status: "Docked",
    lat: 40.0,
    lon: -74.0,
    speed: 0.0,
    course: 0,
    icon: "⛵",
    color: "#9b59b6",
    emissions: [5, 1, 0.5],
    containers: ["CTN-4001"]
  }
];