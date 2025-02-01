import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CLUSTER_COLORS = [
  '#FF4B4B', // Bright Red
  '#4CAF50', // Material Green
  '#2196F3', // Material Blue
  '#9C27B0', // Material Purple
  '#FF9800', // Material Orange
  '#00BCD4'  // Material Cyan
];

const DEFAULT_CENTER = [19.035, 73.02];
const DEFAULT_ZOOM = 14;
const API_BASE_URL = 'http://localhost:5000';

const CATEGORIES = [
  'all',
  'Electronics',
  'Clothing',
  'Toys',
  'Furniture',
  'Groceries'
];

const createCustomIcon = (color, size = 30) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          background-color: #FFFFFF;
          width: ${size/3}px;
          height: ${size/3}px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
        "></div>
      </div>
    `,
    className: 'custom-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  });
};

const createStoreIcon = (size = 40, clusterNum) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #000000;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #FFFFFF;
        box-shadow: 0 0 8px rgba(0,0,0,0.4);
        position: relative;
      ">
        <div style="
          background-color: #FFFFFF;
          width: ${size/2}px;
          height: ${size/2}px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            color: #000000;
            font-weight: bold;
            font-size: ${size/2}px;
            font-family: Arial;
            transform: rotate(0deg);
          ">${clusterNum}</div>
        </div>
      </div>
    `,
    className: 'store-marker-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  });
};

const Map = ({ selectedCategory = 'all' }) => {
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchMapData();
  }, [selectedCategory]);

  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const url = selectedCategory === 'all' 
        ? `${API_BASE_URL}/api/demand-analysis`
        : `${API_BASE_URL}/api/demand-analysis?category=${selectedCategory}`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || 
          `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();
      setMapData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching map data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataByCategory = (data) => {
    if (!data || activeCategory === 'all') return data;

    const filteredClusters = data.clusters.filter(cluster => 
      cluster.top_product.includes(activeCategory)
    );

    const relevantClusterIds = new Set(filteredClusters.map(c => c.cluster));

    return {
      clusters: filteredClusters,
      customers: data.customers.filter(c => relevantClusterIds.has(c.cluster)),
      optimal_locations: data.optimal_locations.filter(l => relevantClusterIds.has(l.cluster))
    };
  };

  const renderCluster = (cluster) => (
    <React.Fragment key={`cluster-${cluster.cluster}`}>
      <Polygon
        positions={cluster.boundary_points}
        pathOptions={{
          color: CLUSTER_COLORS[cluster.cluster % CLUSTER_COLORS.length],
          fillColor: CLUSTER_COLORS[cluster.cluster % CLUSTER_COLORS.length],
          fillOpacity: 0.2,
          weight: 3,
          dashArray: '5, 10'
        }}
      >
        <Popup>
          <ClusterPopupContent cluster={cluster} />
        </Popup>
      </Polygon>
    </React.Fragment>
  );

  const renderCustomer = (customer) => (
    <Marker
      key={`customer-${customer.id}`}
      position={[customer.lat, customer.lon]}
      icon={createCustomIcon(CLUSTER_COLORS[customer.cluster % CLUSTER_COLORS.length], 20)}
    >
      <Popup>
        <CustomerPopupContent customer={customer} />
      </Popup>
      <Tooltip>Customer {customer.id}</Tooltip>
    </Marker>
  );

  const renderOptimalLocation = (location) => (
    <Marker
      key={`store-${location.cluster}`}
      position={[location.lat, location.lon]}
      icon={createStoreIcon(
        Math.max(30, Math.min(50, Math.sqrt(location.total_demand / 1000) * 5)),
        location.cluster
      )}
    >
      <Popup>
        <OptimalLocationPopupContent location={location} />
      </Popup>
      <Tooltip>Optimal Store Location {location.cluster}</Tooltip>
    </Marker>
  );

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setIsMenuOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!mapData) return <NoDataMessage />;

  const filteredData = filterDataByCategory(mapData);

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 right-4 z-[1000]">
        <select 
          className="px-6 py-3 text-base font-medium
          bg-white text-gray-700
          border-2 border-gray-200 
          rounded-lg shadow-lg
          cursor-pointer
          min-w-[200px]
          hover:border-blue-500 hover:bg-gray-50
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          {CATEGORIES.map(category => (
            <option 
              key={category} 
              value={category}
              className="py-2"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        style={{ height: '50vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredData.clusters.map(renderCluster)}
        {filteredData.customers.map(renderCustomer)}
        {filteredData.optimal_locations.map(renderOptimalLocation)}
      </MapContainer>
    </div>
  );
};

const ClusterPopupContent = ({ cluster }) => (
  <div className="min-w-[200px]">
    <h4 className="font-bold">Demand Cluster {cluster.cluster}</h4>
    <div className="mt-2">
      <strong>Top Product:</strong> {cluster.top_product}<br />
      <strong>Top Product Demand:</strong> ₹{cluster.top_product_demand.toLocaleString()}
    </div>
    <div className="mt-2">
      <strong>Total Customers:</strong> {cluster.customer_count}
    </div>
 
  </div>
);

const CustomerPopupContent = ({ customer }) => (
  <div className="min-w-[150px]">
    <strong>Customer {customer.id}</strong>
    <div>Cluster: {customer.cluster}</div>
    <div>Purchase Value: ₹{customer.avg_purchase_value.toLocaleString()}</div>
  </div>
);

const OptimalLocationPopupContent = ({ location }) => (
  <div className="min-w-[250px]">
    <h4 className="font-bold">Optimal Store Location - Cluster {location.cluster}</h4>
    <div className="mt-2">
      <strong>Product Demand Analysis:</strong>
      {location.product_demands.map((demand, idx) => (
        <div key={idx}>{demand}</div>
      ))}
    </div>
    <div className="mt-2">
      <strong>Total Demand:</strong> ₹{location.total_demand.toLocaleString()}
    </div>
    <div>
      <strong>Customer Count:</strong> {location.customer_count}
    </div>
    <div>
      <strong>Coordinates:</strong> ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="h-screen w-full flex items-center justify-center text-red-500">
    Error: {message}
  </div>
);

const NoDataMessage = () => (
  <div className="h-screen w-full flex items-center justify-center">
    No data available
  </div>
);

export default Map;