import { useState, useEffect } from 'react';
import './LandingPage.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Map from './Map';

const LandingPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesPredictions = async () => {
      try {
        setIsLoading(true);
        const categories = ['Clothing', 'Electronics', 'Furniture', 'Groceries', 'Toys'];
        const predictions = {};
        
        // Fetch data for each category
        for (const category of categories) {
          const response = await fetch(
            `http://127.0.0.1:5000/predict-sales?product_category=${category}&discount_applied=0.2`
          );
          const data = await response.json();
          predictions[category] = data.sales_predictions_2022;
        }

        // Transform data for the chart
        const months = Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`);
        const formattedData = months.map(month => ({
          month: month.replace('Month ', ''),
          Clothing: parseFloat(predictions['Clothing'][month] || 0).toFixed(2),
          Electronics: parseFloat(predictions['Electronics'][month] || 0).toFixed(2),
          Furniture: parseFloat(predictions['Furniture'][month] || 0).toFixed(2),
          Groceries: parseFloat(predictions['Groceries'][month] || 0).toFixed(2),
          Toys: parseFloat(predictions['Toys'][month] || 0).toFixed(2),
        }));

        setSalesData(formattedData);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load predictions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesPredictions();
  }, []);

  return (
    <div className="landing-page">
      {/* Map Section */}
      <div className="map-section">
        <Map />
      </div>

      {/* Sales Trend Chart */}
      <div className="chart-section">
        <h3>Monthly Sales Trends</h3>
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={salesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              style={{ filter: 'drop-shadow(0px 20px 30px rgba(0, 0, 0, 0.15))' }}
            >
              <defs>
                <filter id="line-shadow" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
                <linearGradient id="colorClothing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF5350" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF5350" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorElectronics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#42A5F5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFurniture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA726" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFA726" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGroceries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorToys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#AB47BC" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#AB47BC" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false}
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis 
                dataKey="month" 
                stroke="#1a237e"
                tick={{ fill: '#1a237e' }}
                axisLine={{ stroke: '#1a237e', strokeWidth: 2 }}
              />
              <YAxis 
                stroke="#1a237e"
                tick={{ fill: '#1a237e' }}
                axisLine={{ stroke: '#1a237e', strokeWidth: 2 }}
                domain={[20, 30]}
                ticks={[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]}
                interval={0}
                tickFormatter={(value) => value.toFixed(0)}
                allowDataOverflow={true}
              />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="Clothing" 
                stroke="#EF5350" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                filter="url(#line-shadow)"
              />
              <Line 
                type="monotone" 
                dataKey="Electronics" 
                stroke="#42A5F5" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                filter="url(#line-shadow)"
              />
              <Line 
                type="monotone" 
                dataKey="Furniture" 
                stroke="#FFA726" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                filter="url(#line-shadow)"
              />
              <Line 
                type="monotone" 
                dataKey="Groceries" 
                stroke="#66BB6A" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                filter="url(#line-shadow)"
              />
              <Line 
                type="monotone" 
                dataKey="Toys" 
                stroke="#AB47BC" 
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                filter="url(#line-shadow)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default LandingPage; 