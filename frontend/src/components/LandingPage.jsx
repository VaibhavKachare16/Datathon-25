import { useState } from 'react';
import './LandingPage.css';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Area, AreaChart } from 'recharts';
import Map from './Map';

const LandingPage = () => {
  const monthlyData = [
    { month: 'Jan', Clothing: 10, Groceries: 5, Furniture: 8 },
    { month: 'Feb', Clothing: 20, Groceries: 15, Furniture: 12 },
    { month: 'Mar', Clothing: 25, Groceries: 15, Furniture: 10 },
    { month: 'Apr', Clothing: 40, Groceries: 25, Furniture: 18 },
    { month: 'May', Clothing: 35, Groceries: 30, Furniture: 18 },
  ];

  const pieData = [
    { name: 'Furniture', value: 35, color: '#FFA726' },
    { name: 'Clothing', value: 35, color: '#EF5350' },
    { name: 'Groceries', value: 20, color: '#66BB6A' },
    { name: 'Others', value: 10, color: '#42A5F5' }
  ];

  const [dashboardData] = useState({
    totalRevenue: 50000,
    outlets: 69,
    purchaseFrequency: 82,
    avgPurchaseValue: 100
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-brand">Dashboard</div>
        <div className="nav-links">
          <span>Overview</span>
          <span>Analytics</span>
          <span>Reports</span>
          <span>Settings</span>
        </div>
      </nav>

      {/* Dashboard Section */}
      <div className="dashboard-section">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <h2>${dashboardData.totalRevenue.toLocaleString()}</h2>
            <p className="trend-up">↑ 12% from last month</p>
          </div>
          
          <div className="stat-card">
            <h3>No of Outlets</h3>
            <h2>{dashboardData.outlets}</h2>
            <p className="trend-up">↑ 12% from last month</p>
          </div>

          <div className="stat-card">
            <h3>Purchase Frequency</h3>
            <h2>{dashboardData.purchaseFrequency}%</h2>
            <p className="trend-up">↑ 12% from last month</p>
          </div>

          <div className="stat-card">
            <h3>avg Purchase value</h3>
            <h2>${dashboardData.avgPurchaseValue}</h2>
            <p className="trend-up">↑ 12% from last month</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Monthly Sales Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                data={monthlyData}
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
                  <linearGradient id="colorGroceries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFurniture" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFA726" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFA726" stopOpacity={0}/>
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
                  fill="url(#colorClothing)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Groceries" 
                  stroke="#66BB6A" 
                  strokeWidth={3}
                  dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                  filter="url(#line-shadow)"
                  fill="url(#colorGroceries)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Furniture" 
                  stroke="#FFA726" 
                  strokeWidth={3}
                  dot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                  filter="url(#line-shadow)"
                  fill="url(#colorFurniture)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card pie-chart-container">
            <h3>Product Demand Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <defs>
                  <filter id="shadow" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                  <filter id="innerShadow" height="200%">
                    <feOffset dx="0" dy="4"/>
                    <feGaussianBlur stdDeviation="4" result="offset-blur"/>
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                    <feFlood floodColor="black" floodOpacity="0.4" result="color"/>
                    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                  </filter>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={150}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  filter="url(#innerShadow)"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))',
                      }}
                    />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  wrapperStyle={{
                    paddingLeft: '20px',
                    fontSize: '14px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <Map />
      </div>
    </div>
  );
};

export default LandingPage; 