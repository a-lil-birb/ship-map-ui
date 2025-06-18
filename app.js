// Initialize map
const map = L.map('map').setView([30.0, -20.0], 3);

// Add tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load mock shipping routes
fetch('mock_routes.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: "#0066cc", weight: 2 }
    }).addTo(map);
  });

// Add mock ships
mockShips.forEach(ship => {
  const marker = L.marker([ship.lat, ship.lon], {
    icon: L.divIcon({
      html: `<div class="ship-marker" style="background-color:${ship.color}">${ship.icon}</div>`,
      className: 'ship-icon'
    })
  }).addTo(map);
  
  // Update ship list
  const shipItem = document.createElement('li');
  shipItem.className = 'list-group-item d-flex justify-content-between';
  shipItem.innerHTML = `
    <span>${ship.icon} ${ship.name}</span>
    <span class="badge bg-primary">${ship.type}</span>
  `;
  document.getElementById('ship-list').appendChild(shipItem);
});

// Simulate ship movement
setInterval(() => {
  mockShips.forEach(ship => {
    ship.lat += (Math.random() - 0.5) * 0.1;
    ship.lon += (Math.random() - 0.5) * 0.1;
  });
}, 3000);

// Initialize emissions chart
new Chart(document.getElementById('emissionsChart'), {
  type: 'bar',
  data: {
    labels: ['CO₂', 'NOₓ', 'SOₓ'],
    datasets: [{
      label: 'Emissions (kg/km)',
      data: [12.8, 3.2, 2.1],
      backgroundColor: ['#e74c3c', '#3498db', '#2ecc71']
    }]
  }
});