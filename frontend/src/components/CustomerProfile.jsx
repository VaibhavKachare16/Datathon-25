import { useState } from 'react';
import './CustomerProfile.css';

const CustomerProfile = () => {
    const [customerProfile, setCustomerProfile] = useState({
        age: '',
        income: '',
        preferredCategory: '',
        frequency: ''
    });

    const [predictions, setPredictions] = useState(null);

    const [outletPerformance] = useState([
        {   
            name: "Nerul East",
            location: "Downtown",
            currentSales: 45000,
            discount: "15%",
            predicted: 52000
        },
        {
            name: "Nerul West",
            location: "Suburb Mall",
            currentSales: 38000,
            discount: "20%",
            predicted: 42000
        },
        {
            name: "Sector 19 Nerul",
            location: "Business District",
            currentSales: 52000,
            discount: "10%",
            predicted: 58000
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePrediction = () => {
        // Validate inputs
        if (!customerProfile.age || !customerProfile.income || 
            !customerProfile.preferredCategory || !customerProfile.frequency) {
            alert('Please fill in all fields');
            return;
        }

        // Mock prediction logic
        const mockPrediction = {
            recommendedOutlet: "Business District",
            expectedPurchase: 250,
            categories: [
                { name: "Electronics", match: 85 },
                { name: "Accessories", match: 72 }
            ]
        };

        setPredictions(mockPrediction);
    };

    const categoryOptions = ["Electronics", "Clothing", "Groceries", "Furniture", "Accessories"];
    const frequencyOptions = ["Daily", "Weekly", "Monthly", "Quarterly"];

    return (
        <div className="analytics-container">
            <div className="profile-section">
                <h2>Customer Profile & Product Search</h2>
                <div className="profile-grid">
                    <div className="input-group">
                        <input 
                            type="number" 
                            name="age"
                            value={customerProfile.age}
                            onChange={handleInputChange}
                            placeholder="Age"
                            min="0"
                            max="120"
                        />
                        <input 
                            type="number"
                            name="income"
                            value={customerProfile.income}
                            onChange={handleInputChange}
                            placeholder="Income"
                            min="0"
                        />
                        <select 
                            name="preferredCategory"
                            value={customerProfile.preferredCategory}
                            onChange={handleInputChange}
                            className="select-input"
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <select 
                            name="frequency"
                            value={customerProfile.frequency}
                            onChange={handleInputChange}
                            className="select-input"
                        >
                            <option value="">Select Frequency</option>
                            {frequencyOptions.map(freq => (
                                <option key={freq} value={freq}>{freq}</option>
                            ))}
                        </select>
                        <button className="prediction-btn" onClick={handlePrediction}>
                            <span className="search-icon">🔍</span>
                            Get Predictions
                        </button>
                    </div>
                    <div className="predictions-card">
                        <h3>Personalized Predictions</h3>
                        {predictions ? (
                            <>
                                <p>Recommended Outlet: {predictions.recommendedOutlet}</p>
                                <p>Expected Purchase Amount: ${predictions.expectedPurchase}</p>
                                <h4>Product Categories:</h4>
                                <ul>
                                    {predictions.categories.map((cat, index) => (
                                        <li key={index}>{cat.name} ({cat.match}% match)</li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="no-predictions">Enter your details and click "Get Predictions" to see personalized recommendations</p>
                        )}
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
    );
};

export default CustomerProfile;