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

// Initialize emissions chart
const emissionsChart = new Chart(document.getElementById('emissionsChart'), {
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

// Ship Detail Elements
const shipDetail = document.getElementById('ship-detail');
const dashboardContent = document.getElementById('dashboard-content');
const closeButton = document.getElementById('close-detail');

// Close detail panel
closeButton.addEventListener('click', () => {
  shipDetail.classList.add('d-none');
  dashboardContent.classList.remove('d-none');
});

// Ship markers array
const shipMarkers = [];

// Add mock ships
mockShips.forEach(ship => {
  // Create marker
  const marker = L.marker([ship.lat, ship.lon], {
    icon: L.divIcon({
      html: `<div class="ship-marker" style="background-color:${ship.color}">${ship.icon}</div>`,
      className: 'ship-icon'
    })
  }).addTo(map);
  
  // Store reference
  ship.marker = marker;
  shipMarkers.push(marker);
  
  // Add click handler
  marker.on('click', () => showShipDetails(ship));
  
  // Update ship list
  const shipItem = document.createElement('li');
  shipItem.className = 'list-group-item d-flex justify-content-between align-items-center clickable';
  shipItem.innerHTML = `
    <span>${ship.icon} ${ship.name}</span>
    <span class="badge bg-primary">${ship.type}</span>
  `;
  
  // Add click handler to list item
  shipItem.addEventListener('click', () => {
    map.setView([ship.lat, ship.lon], 5);
    showShipDetails(ship);
  });
  
  document.getElementById('ship-list').appendChild(shipItem);
});

// Show ship details function
function showShipDetails(ship) {
  // Update elements
  document.getElementById('ship-name').textContent = ship.name;
  document.getElementById('ship-icon').textContent = ship.icon;
  document.getElementById('ship-type').textContent = ship.type;
  document.getElementById('ship-status').textContent = ship.status;
  document.getElementById('ship-speed').textContent = `${ship.speed} knots`;
  document.getElementById('ship-course').textContent = `${ship.course}°`;
  document.getElementById('ship-updated').textContent = new Date().toLocaleTimeString();
  
  // Create individual ship chart
  const ctx = document.getElementById('ship-chart').getContext('2d');
  
  // Destroy previous chart if exists
  if (window.shipChart) window.shipChart.destroy();
  
  window.shipChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['CO₂', 'NOₓ', 'SOₓ'],
      datasets: [{
        data: ship.emissions,
        backgroundColor: ['#e74c3c', '#3498db', '#2ecc71']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
  
  // Show detail panel, hide dashboard
  shipDetail.classList.remove('d-none');
  dashboardContent.classList.add('d-none');
  
  // Center map on ship
  map.setView([ship.lat, ship.lon], 6);
}

// Simulate ship movement
setInterval(() => {
  mockShips.forEach(ship => {
    // Update position
    ship.lat += (Math.random() - 0.5) * 0.1;
    ship.lon += (Math.random() - 0.5) * 0.1;
    
    // Update marker position
    ship.marker.setLatLng([ship.lat, ship.lon]);
    
    // Update course direction
    ship.course = Math.floor(Math.random() * 360);
  });
}, 3000);