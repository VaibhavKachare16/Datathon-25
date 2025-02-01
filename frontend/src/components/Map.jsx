import React from 'react';

import { useState } from 'react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';

import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import CustomerProfile from './CustomerProfile';



// Fix for default marker icon

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconUrl: markerIcon,

    shadowUrl: markerShadow,

    iconSize: [25, 41],

    iconAnchor: [12, 41],

    popupAnchor: [1, -34],

    shadowSize: [41, 41]

});



function Map() {

    const stores = [

        {

            name: "Croma",

            category: "Electronics",

            location: [19.0259, 73.017],

            discount: "25% off",

            avgValue: "$450",

            description: "Premium electronics store with latest gadgets"

        },

        {

            name: "D-Mart",

            category: "Groceries",

            location: [19.0447, 73.0199],

            discount: "10% off",

            avgValue: "$100",

            description: "One-stop shop for daily essentials"

        },

        {

            name: "Westside",

            category: "Clothing",

            location: [19.0228, 73.0177],

            discount: "30% off",

            avgValue: "$200",

            description: "Trendy fashion destination"

        },

        {

            name: "Hamleys",

            category: "Toys",

            location: [19.0259, 73.017],

            discount: "20% off",

            avgValue: "$150",

            description: "World of toys and games"

        },

        {

            name: "Reliance Digital",

            category: "Electronics",

            location: [19.0412, 73.0293],

            discount: "15% off",

            avgValue: "$500",

            description: "Complete electronics solution"

        },

        {

            name: "Nature's Basket",

            category: "Groceries",

            location: [19.0234, 73.0328],

            discount: "12% off",

            avgValue: "$180",

            description: "Premium grocery and gourmet store"

        },

        {

            name: "Toys R Us",

            category: "Toys",

            location: [19.0456, 73.0215],

            discount: "35% off",

            avgValue: "$130",

            description: "Largest toy store collection"

        },

        {

            name: "Max Fashion",

            category: "Clothing",

            location: [19.0189, 73.0282],

            discount: "40% off",

            avgValue: "$150",

            description: "Family fashion destination"

        },

        {

            name: "Vijay Sales",

            category: "Electronics",

            location: [19.0475, 73.0207],

            discount: "20% off",

            avgValue: "$600",

            description: "Electronic appliances store"

        },

        {

            name: "Spencer's",

            category: "Groceries",

            location: [19.0245, 73.0165],

            discount: "15% off",

            avgValue: "$140",

            description: "Quality grocery store"

        },

        {

            name: "Crossword",

            category: "Toys",

            location: [19.0445, 73.0276],

            discount: "25% off",

            avgValue: "$120",

            description: "Books and toys store"

        },

        {

            name: "Lifestyle",

            category: "Clothing",

            location: [19.0259, 73.0370],

            discount: "35% off",

            avgValue: "$250",

            description: "Premium fashion outlet"

        },

        {

            name: "Girias",

            category: "Electronics",

            location: [19.0167, 73.019],

            discount: "18% off",

            avgValue: "$550",

            description: "Electronics and home appliances"

        },

        {

            name: "Big Bazaar",

            category: "Groceries",

            location: [19.0467, 73.0262],

            discount: "20% off",

            avgValue: "$120",

            description: "Retail supermarket chain"

        },

        {

            name: "Funcity",

            category: "Toys",

            location: [19.0182, 73.0203],

            discount: "30% off",

            avgValue: "$140",

            description: "Fun and games store"

        },

        {

            name: "Pantaloons",

            category: "Clothing",

            location: [19.042, 73.0185],

            discount: "25% off",

            avgValue: "$180",

            description: "Fashion and lifestyle store"

        },

        {

            name: "Mobile Care",

            category: "Electronics",

            location: [19.0395, 73.0188],

            discount: "15% off",

            avgValue: "$300",

            description: "Mobile and accessories store"

        },

        {

            name: "More Supermarket",

            category: "Groceries",

            location: [19.0355, 73.0175],

            discount: "10% off",

            avgValue: "$90",

            description: "Neighborhood grocery store"

        },

        {

            name: "Toy Kingdom",

            category: "Toys",

            location: [19.0405, 73.0196],

            discount: "25% off",

            avgValue: "$135",

            description: "Extensive toy collection"

        },

        {

            name: "FBB",

            category: "Clothing",

            location: [19.036, 73.018],

            discount: "35% off",

            avgValue: "$160",

            description: "Fashion at budget prices"

        },

        {

            name: "Easy Electronics",

            category: "Electronics",

            location: [19.034, 73.016],

            discount: "22% off",

            avgValue: "$400",

            description: "Electronic gadgets store"

        },

        {

            name: "Fresh Mart",

            category: "Groceries",

            location: [19.041, 73.0183],

            discount: "12% off",

            avgValue: "$110",

            description: "Fresh groceries daily"

        },

        {

            name: "Kids World",

            category: "Toys",

            location: [19.0375, 73.0185],

            discount: "30% off",

            avgValue: "$125",

            description: "Kids' entertainment zone"

        },

        {

            name: "Brand Factory",

            category: "Clothing",

            location: [19.035, 73.017],

            discount: "45% off",

            avgValue: "$175",

            description: "Multi-brand fashion outlet"

        },

        {

            name: "Digital World",

            category: "Electronics",

            location: [19.0365, 73.021],

            discount: "20% off",

            avgValue: "$550",

            description: "Digital lifestyle store"

        },

        {

            name: "Smart Supermarket",

            category: "Groceries",

            location: [19.0335, 73.0155],

            discount: "15% off",

            avgValue: "$95",

            description: "Smart shopping experience"

        },

        {

            name: "Toy Box",

            category: "Toys",

            location: [19.0348, 73.022],

            discount: "28% off",

            avgValue: "$145",

            description: "Toy wonderland"

        },

        {

            name: "Fashion Hub",

            category: "Clothing",

            location: [19.0342, 73.0225],

            discount: "32% off",

            avgValue: "$190",

            description: "Latest fashion trends"

        },

        {

            name: "Tech Point",

            category: "Electronics",

            location: [19.0338, 73.023],

            discount: "23% off",

            avgValue: "$480",

            description: "Technology solutions center"

        },

        {

            name: "Daily Needs",

            category: "Groceries",

            location: [19.0332, 73.0235],

            discount: "10% off",

            avgValue: "$85",

            description: "Daily essentials store"

        },

        {

            name: "Play World",

            category: "Toys",

            location: [19.0328, 73.024],

            discount: "33% off",

            avgValue: "$155",

            description: "Play and learn store"

        },

        {

            name: "HomeTown",

            category: "Furniture",

            location: [19.0445, 73.0196],

            discount: "40% off",

            avgValue: "$800",

            description: "Complete home furniture solutions"

        },

        {

            name: "Godrej Interio",

            category: "Furniture",

            location: [19.0234, 73.0288],

            discount: "25% off",

            avgValue: "$950",

            description: "Premium furniture and interior solutions"

        },

        {

            name: "Urban Ladder",

            category: "Furniture",

            location: [19.0367, 73.0315],

            discount: "30% off",

            avgValue: "$750",

            description: "Modern furniture designs"

        },

        {

            name: "Durian",

            category: "Furniture",

            location: [19.0428, 73.0245],

            discount: "35% off",

            avgValue: "$1200",

            description: "Luxury furniture showroom"

        },

        {

            name: "Pepperfry",

            category: "Furniture",

            location: [19.0189, 73.0192],

            discount: "45% off",

            avgValue: "$650",

            description: "Online furniture store studio"

        },

        {

            name: "Nilkamal",

            category: "Furniture",

            location: [19.0356, 73.0282],

            discount: "20% off",

            avgValue: "$500",

            description: "Home and office furniture"

        },

        {

            name: "Woodcraft",

            category: "Furniture",

            location: [19.0412, 73.0168],

            discount: "15% off",

            avgValue: "$850",

            description: "Custom wooden furniture"

        },

        {

            name: "Royal Oak",

            category: "Furniture",

            location: [19.0289, 73.0225],

            discount: "30% off",

            avgValue: "$700",

            description: "Designer furniture collection"

        }

    ];



    const [location] = useState({ 

        lat: 19.0354, 

        lng: 73.0233,

    });

    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Electronics', 'Clothing', 'Groceries', 'Toys', 'Furniture'];

    const filteredStores = selectedCategory === 'All' 
        ? stores 
        : stores.filter(store => store.category === selectedCategory);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const customPopupStyle = {

        className: 'custom-popup',

    };

    const [customerProfile] = useState({
        age: 30,
        income: 50000,
        preferredCategory: 'Electronics',
        frequency: 'Weekly'
    });

    const outletPerformance = [
        {
            name: "Downtown",
            location: "Nerul East",
            currentSales: 45000,
            discount: "15%",
            predicted: 52000
        },
        {
            name: "Suburb Mall",
            location: "Nerul West",
            currentSales: 38000,
            discount: "20%",
            predicted: 42000
        },
        {
            name: "Business District",
            location: "Sector 19 Nerul",
            currentSales: 52000,
            discount: "10%",
            predicted: 58000
        }
    ];



    return (

        <div className="dashboard-container">

            <div className="map-container">

                <div className="map-controls">

                    <select 

                        value={selectedCategory}

                        onChange={handleCategoryChange}

                        className="category-dropdown"

                    >

                        {categories.map(category => (

                            <option key={category} value={category}>

                                {category}

                            </option>

                        ))}

                    </select>

                </div>

                <div style={{ height: "500px", width: "100%", border: '1px solid #ccc', borderRadius: '12px', overflow: 'hidden' }}>

                    <MapContainer 

                        center={[location.lat, location.lng]} 

                        zoom={14}

                        style={{ height: "100%", width: "100%" }}

                        scrollWheelZoom={true}

                    >

                        <TileLayer

                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"

                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'

                        />

                        {filteredStores.map((store, index) => (

                            <Marker 

                                key={index} 

                                position={store.location}

                            >

                                <Popup {...customPopupStyle}>

                                    <div className="store-popup">

                                        <h3>{store.name}</h3>

                                        <p><strong>Category:</strong> {store.category}</p>

                                        <p><strong>Current Discount:</strong> {store.discount}</p>

                                        <p><strong>Avg. Purchase Value:</strong> {store.avgValue}</p>

                                        <p><strong>Description:</strong> {store.description}</p>

                                    </div>

                                </Popup>

                            </Marker>

                        ))}

                    </MapContainer>

                </div>

                <style>

                    {`

                        .store-popup {

                            padding: 10px;

                            min-width: 200px;

                        }

                        .store-popup h3 {

                            margin: 0 0 10px 0;

                            color: #1a237e;

                            font-size: 16px;

                        }

                        .store-popup p {

                            margin: 5px 0;

                            color: #333;

                            font-size: 14px;

                        }

                        .store-popup strong {

                            color: #1a237e;

                        }

                        .leaflet-popup-content-wrapper {

                            border-radius: 10px;

                            background: rgba(255, 255, 255, 0.95);

                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

                        }

                        .leaflet-popup-tip {

                            background: rgba(255, 255, 255, 0.95);

                        }

                        .map-container {

                            padding: 20px;

                            background: rgba(255, 255, 255, 0.1);

                            border-radius: 15px;

                        }

                        .map-controls {

                            margin-bottom: 1rem;

                            display: flex;

                            justify-content: flex-end;

                        }

                        .category-dropdown {

                            padding: 0.5rem 1rem;

                            border: 1px solid #e2e8f0;

                            border-radius: 8px;

                            background: white;

                            font-size: 1rem;

                            color: #1a237e;

                            cursor: pointer;

                            min-width: 150px;

                            appearance: none;

                            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");

                            background-repeat: no-repeat;

                            background-position: right 0.5rem center;

                            background-size: 1em;

                            padding-right: 2.5rem;

                        }

                        .category-dropdown:focus {

                            outline: none;

                            border-color: #3b82f6;

                            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);

                        }

                        .category-dropdown:hover {

                            border-color: #3b82f6;

                        }

                    `}

                </style>

            </div>

            <div className="analytics-section">
                <div className="profile-section">
                    <h2>Customer Profile & Product Search</h2>
                    <div className="profile-grid">
                        <div className="input-group">
                            <input type="text" value={customerProfile.age} readOnly />
                            <input type="text" value={customerProfile.income} readOnly />
                            <input type="text" value={customerProfile.preferredCategory} readOnly />
                            <input type="text" value={customerProfile.frequency} readOnly />
                            <button className="prediction-btn">Get Predictions</button>
                        </div>
                        <div className="predictions-card">
                            <h3>Personalized Predictions</h3>
                            <p>Recommended Outlet: Business District</p>
                            <p>Expected Purchase Amount: $250</p>
                            <h4>Product Categories:</h4>
                            <ul>
                                <li>Electronics (85% match)</li>
                                <li>Accessories (72% match)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="performance-section">
                    <h2>Outlet Performance Comparison</h2>
                    <div className="outlet-grid">
                        {outletPerformance.map((outlet, index) => (
                            <div key={index} className="outlet-card">
                                <div className="outlet-header">
                                    <i className="location-icon">📍</i>
                                    <h3>{outlet.name}</h3>
                                </div>
                                <div className="outlet-stats">
                                    <p>Current Sales: <span>${outlet.currentSales.toLocaleString()}</span></p>
                                    <p>Discount: <span className="discount">{outlet.discount}</span></p>
                                    <p>Predicted: <span className="predicted">${outlet.predicted.toLocaleString()}</span></p>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress" 
                                            style={{ width: `${(outlet.currentSales/outlet.predicted)*100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>

                {`

                    .dashboard-container {

                        display: flex;

                        flex-direction: column;

                        gap: 2rem;

                    }

                    .analytics-section {
                        padding: 0 20px;
                    }

                    .profile-section, .performance-section {
                        background: rgba(255, 255, 255, 0.9);
                        border-radius: 15px;
                        padding: 2rem;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .profile-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 2rem;
                        margin-top: 1.5rem;
                    }

                    .input-group {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .input-group input {
                        padding: 0.8rem;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: 1rem;
                    }

                    .prediction-btn {
                        background: #1a237e;
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        margin-top: 1rem;
                    }

                    .predictions-card {
                        background: #f8f9fa;
                        padding: 1.5rem;
                        border-radius: 8px;
                    }

                    .outlet-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1.5rem;
                        margin-top: 1.5rem;
                    }

                    .outlet-card {
                        background: white;
                        border-radius: 8px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                    }

                    .outlet-header {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 1rem;
                    }

                    .outlet-stats p {
                        display: flex;
                        justify-content: space-between;
                        margin: 0.5rem 0;
                    }

                    .discount {
                        color: #00c853;
                    }

                    .predicted {
                        color: #2196f3;
                    }

                    .progress-bar {
                        height: 6px;
                        background: #eee;
                        border-radius: 3px;
                        margin-top: 1rem;
                    }

                    .progress {
                        height: 100%;
                        background: #2196f3;
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    }

                `}

            </style>

        </div>

    );

}



export default Map;


