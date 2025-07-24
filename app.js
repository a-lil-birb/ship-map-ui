// Initialize map
const map = L.map('map').setView([30.0, -20.0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Load routes
fetch('mock_routes.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        return {
          color: feature.properties.name === "Montreal-Liverpool" ? "#e74c3c" : 
                 feature.properties.name === "Halifax-Hamburg" ? "#9b59b6" : "#0066cc",
          weight: 4,
          opacity: 0.7
        };
      }
    }).addTo(map);
  });

// UI Elements
const containerDetail = document.getElementById('container-detail');
const dashboardContent = document.getElementById('dashboard-content');
const closeButton = document.getElementById('close-detail');
const focusShipButton = document.getElementById('focus-ship');

// Close detail panel
closeButton.addEventListener('click', () => {
  containerDetail.classList.add('d-none');
  dashboardContent.classList.remove('d-none');
});

// Ship markers lookup
const shipMarkers = new Map();

// Add mock ships
mockShips.forEach(ship => {
  const marker = L.marker([ship.lat, ship.lon], {
    icon: L.divIcon({
      html: `<div class="ship-marker" style="background-color:${ship.color}">${ship.icon}</div>`,
      className: 'ship-icon'
    })
  }).addTo(map);
  
  // Store reference
  shipMarkers.set(ship.id, marker);
  
  // Add popup
  marker.bindPopup(`
    <b>${ship.name}</b><br>
    Type: ${ship.type}<br>
    Containers: ${ship.containers.length}
  `);
});

// Current selected container
let selectedContainer = null;

// Render container list
function renderContainerList() {
  const containerList = document.getElementById('container-list');
  containerList.innerHTML = '';
  
  const showReefer = document.getElementById('filter-reefer').checked;
  const showDry = document.getElementById('filter-dry').checked;
  const searchTerm = document.getElementById('container-search').value.toLowerCase();
  
  mockContainers.forEach(container => {
    // Apply filters
    if ((container.type === 'reefer' && !showReefer) || 
        (container.type === 'dry' && !showDry)) return;
    
    if (searchTerm && !container.id.toLowerCase().includes(searchTerm)) return;
    
    const ship = mockShips.find(s => s.id === container.shipId);
    
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center clickable';
    item.innerHTML = `
      <div>
        <span class="badge bg-${container.type === 'reefer' ? 'danger' : 'primary'} me-2">${container.type === 'reefer' ? '❄️' : '📦'}</span>
        <strong>${container.id}</strong>
        <div class="text-muted small">${container.description}</div>
      </div>
      <div class="text-end">
        <div class="small">${ship ? ship.name : 'In transit'}</div>
        <span class="badge bg-${container.status === 'good' ? 'success' : 'warning'}">${container.status}</span>
      </div>
    `;
    
    item.addEventListener('click', () => showContainerDetails(container));
    containerList.appendChild(item);
  });
}

// Show container details
function showContainerDetails(container) {
  selectedContainer = container;
  const ship = mockShips.find(s => s.id === container.shipId);
  
  // Update UI elements
  document.getElementById('container-id').textContent = container.id;
  document.getElementById('container-type').textContent = container.type;
  document.getElementById('container-type').className = `fw-bold ${container.type === 'reefer' ? 'text-danger' : 'text-primary'}`;
  document.getElementById('container-status').textContent = container.status;
  document.getElementById('container-status').className = `fw-bold ${container.status === 'good' ? 'text-success' : 'text-warning'}`;
  document.getElementById('container-co2').textContent = `${container.co2PerKm} kg/km`;
  
  // Cold chain info
  const coldChainPenalty = container.type === 'reefer' ? container.coldChainPenalty : 0;
  document.getElementById('cold-chain-penalty').textContent = 
    coldChainPenalty ? `+${coldChainPenalty}%` : 'None';
  document.getElementById('cold-chain-penalty').className = `fw-bold ${coldChainPenalty ? 'text-danger' : ''}`;
  
  // Ship info
  if (ship) {
    document.getElementById('ship-name').textContent = ship.name;
  }
  
  // Goods info
  document.getElementById('goods-description').textContent = container.goods.description;
  document.getElementById('goods-condition').textContent = container.goods.condition;
  document.getElementById('goods-condition').className = `badge bg-${container.goods.condition === 'good' ? 'success' : 'warning'}`;
  
  // Perishability
  const perishPercent = container.goods.perishability;
  document.getElementById('perish-progress').style.width = `${perishPercent}%`;
  document.getElementById('perish-progress').className = `progress-bar ${perishPercent > 70 ? 'bg-danger' : perishPercent > 30 ? 'bg-warning' : 'bg-success'}`;
  document.getElementById('perish-status').textContent = 
    perishPercent > 70 ? 'Critical' : perishPercent > 30 ? 'Moderate' : 'Stable';
  
  // Update timestamp
  document.getElementById('container-updated').textContent = new Date().toLocaleTimeString();
  
  // Create emissions chart
  const ctx = document.getElementById('container-chart').getContext('2d');
  if (window.containerChart) window.containerChart.destroy();
  
  const co2Total = container.co2PerKm;
  const co2Base = container.type === 'reefer' ? 
                  co2Total / (1 + container.coldChainPenalty/100) : 
                  co2Total;
  
  window.containerChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Base Emission', 'Cold Chain Penalty', 'Total'],
      datasets: [{
        label: 'kg CO₂/km',
        data: [
          Math.round(co2Base * 100) / 100,
          container.type === 'reefer' ? Math.round((co2Total - co2Base) * 100) / 100 : 0,
          co2Total
        ],
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71']
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true
    }
  });
  
  // Show detail panel
  containerDetail.classList.remove('d-none');
  dashboardContent.classList.add('d-none');
}

// Focus on ship carrying container
focusShipButton.addEventListener('click', () => {
  if (!selectedContainer) return;
  
  const ship = mockShips.find(s => s.id === selectedContainer.shipId);
  if (!ship) return;
  
  const marker = shipMarkers.get(ship.id);
  if (marker) {
    map.setView(marker.getLatLng(), 7);
    marker.openPopup();
    
    // Highlight ship
    marker.setIcon(L.divIcon({
      html: `<div class="ship-marker highlighted" style="background-color:${ship.color}">${ship.icon}</div>`,
      className: 'ship-icon'
    }));
    
    // Remove highlight after delay
    setTimeout(() => {
      marker.setIcon(L.divIcon({
        html: `<div class="ship-marker" style="background-color:${ship.color}">${ship.icon}</div>`,
        className: 'ship-icon'
      }));
    }, 3000);
  }
});

// Initialize emissions chart
const emissionsChart = new Chart(document.getElementById('emissionsChart'), {
  type: 'pie',
  data: {
    labels: ['Dry Containers', 'Reefer Containers'],
    datasets: [{
      data: [
        mockContainers.filter(c => c.type === 'dry').reduce((sum, c) => sum + c.co2PerKm, 0),
        mockContainers.filter(c => c.type === 'reefer').reduce((sum, c) => sum + c.co2PerKm, 0)
      ],
      backgroundColor: ['#3498db', '#e74c3c']
    }]
  }
});

// Initialize container list
renderContainerList();

// Add search/filter listeners
document.getElementById('container-search').addEventListener('input', renderContainerList);
document.getElementById('filter-reefer').addEventListener('change', renderContainerList);
document.getElementById('filter-dry').addEventListener('change', renderContainerList);

// Simulate container status changes
setInterval(() => {
  // Update ship positions
  mockShips.forEach(ship => {
    ship.lat += (Math.random() - 0.5) * 0.1;
    ship.lon += (Math.random() - 0.5) * 0.1;
    
    const marker = shipMarkers.get(ship.id);
    if (marker) marker.setLatLng([ship.lat, ship.lon]);
  });
  
  // Update container perishability
  mockContainers.forEach(container => {
    if (container.type === 'reefer') {
      // Random degradation
      const change = Math.random() > 0.7 ? 5 : 0;
      container.goods.perishability = Math.min(100, container.goods.perishability + change);
      
      // Update condition
      if (container.goods.perishability > 70) {
        container.goods.condition = 'critical';
        container.status = 'warning';
      } else if (container.goods.perishability > 30) {
        container.goods.condition = 'moderate';
      }
    }
  });
  
  // Refresh UI if container detail is open
  if (!containerDetail.classList.contains('d-none') {
    showContainerDetails(selectedContainer);
  }
}, 5000);