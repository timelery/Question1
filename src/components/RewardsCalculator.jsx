import React, { useState, useEffect } from 'react';
import './RewardsCalculator.css';

// Mock transaction data for demonstration
const mockTransactions = [
  // Customer 1 - John Doe
  { id: 1, customerId: 1, customerName: 'John Doe', amount: 120, date: '2024-01-15' },
  { id: 2, customerId: 1, customerName: 'John Doe', amount: 75, date: '2024-01-22' },
  { id: 3, customerId: 1, customerName: 'John Doe', amount: 200, date: '2024-02-05' },
  { id: 4, customerId: 1, customerName: 'John Doe', amount: 45, date: '2024-02-18' },
  { id: 5, customerId: 1, customerName: 'John Doe', amount: 300, date: '2024-03-10' },
  
  // Customer 2 - Jane Smith
  { id: 6, customerId: 2, customerName: 'Jane Smith', amount: 89, date: '2024-01-08' },
  { id: 7, customerId: 2, customerName: 'Jane Smith', amount: 156, date: '2024-01-25' },
  { id: 8, customerId: 2, customerName: 'Jane Smith', amount: 67, date: '2024-02-12' },
  { id: 9, customerId: 2, customerName: 'Jane Smith', amount: 234, date: '2024-02-28' },
  { id: 10, customerId: 2, customerName: 'Jane Smith', amount: 98, date: '2024-03-15' },
  
  // Customer 3 - Mike Johnson
  { id: 11, customerId: 3, customerName: 'Mike Johnson', amount: 35, date: '2024-01-12' },
  { id: 12, customerId: 3, customerName: 'Mike Johnson', amount: 145, date: '2024-01-20' },
  { id: 13, customerId: 3, customerName: 'Mike Johnson', amount: 78, date: '2024-02-03' },
  { id: 14, customerId: 3, customerName: 'Mike Johnson', amount: 189, date: '2024-02-20' },
  { id: 15, customerId: 3, customerName: 'Mike Johnson', amount: 456, date: '2024-03-05' },
  { id: 16, customerId: 3, customerName: 'Mike Johnson', amount: 67, date: '2024-03-25' },
  
  // Customer 4 - Sarah Wilson
  { id: 17, customerId: 4, customerName: 'Sarah Wilson', amount: 223, date: '2024-01-18' },
  { id: 18, customerId: 4, customerName: 'Sarah Wilson', amount: 54, date: '2024-02-08' },
  { id: 19, customerId: 4, customerName: 'Sarah Wilson', amount: 167, date: '2024-02-22' },
  { id: 20, customerId: 4, customerName: 'Sarah Wilson', amount: 89, date: '2024-03-12' },
  { id: 21, customerId: 4, customerName: 'Sarah Wilson', amount: 345, date: '2024-03-28' }
];

// Simulate API call with delay
const fetchTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, 1500);
  });
};

// Calculate reward points for a single transaction
const calculatePoints = (amount) => {
  let points = 0;
  
  if (amount > 100) {
    // 2 points for every dollar over $100
    points += (amount - 100) * 2;
    // 1 point for every dollar between $50-$100
    points += 50 * 1;
  } else if (amount > 50) {
    // 1 point for every dollar between $50-$100
    points += (amount - 50) * 1;
  }
  // No points for amounts $50 and under
  
  return points;
};

// Group transactions by customer and month
const processTransactions = (transactions) => {
  const customerData = {};
  
  transactions.forEach(transaction => {
    const { customerId, customerName, amount, date } = transaction;
    const month = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const points = calculatePoints(amount);
    
    if (!customerData[customerId]) {
      customerData[customerId] = {
        name: customerName,
        months: {},
        total: 0,
        totalTransactions: 0,
        totalSpent: 0
      };
    }
    
    if (!customerData[customerId].months[month]) {
      customerData[customerId].months[month] = {
        points: 0,
        transactions: 0,
        spent: 0
      };
    }
    
    customerData[customerId].months[month].points += points;
    customerData[customerId].months[month].transactions += 1;
    customerData[customerId].months[month].spent += amount;
    customerData[customerId].total += points;
    customerData[customerId].totalTransactions += 1;
    customerData[customerId].totalSpent += amount;
  });
  
  return customerData;
};

const RewardsCalculator = () => {
  const [transactions, setTransactions] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
        setCustomerData(processTransactions(data));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  const customers = Object.values(customerData);
  const totalCustomers = customers.length;
  const totalPoints = customers.reduce((sum, customer) => sum + customer.total, 0);
  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="header">
          <h1 className="main-title">Customer Rewards Program</h1>
          <p className="subtitle">Track reward points earned by customers over three months</p>
        </div>

        {/* Summary Stats */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-content">
              <div className="stat-icon">👤</div>
              <div>
                <p className="stat-label">Total Customers</p>
                <p className="stat-value">{totalCustomers}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card green">
            <div className="stat-content">
              <div className="stat-icon">⭐</div>
              <div>
                <p className="stat-label">Total Points</p>
                <p className="stat-value">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card purple">
            <div className="stat-content">
              <div className="stat-icon">📈</div>
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-value">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card orange">
            <div className="stat-content">
              <div className="stat-icon">📅</div>
              <div>
                <p className="stat-label">Avg Points/Customer</p>
                <p className="stat-value">{Math.round(totalPoints / totalCustomers)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Grid */}
        <div className="customer-grid">
          {customers.map((customer, index) => (
            <div key={index} className="customer-card">
              <div className="customer-header">
                <h3 className="customer-name">{customer.name}</h3>
                <p className="customer-total">Total Points: {customer.total.toLocaleString()}</p>
              </div>
              
              <div className="customer-body">
                <div className="summary-stats">
                  <div className="summary-stat">
                    <p className="summary-label">Total Spent</p>
                    <p className="summary-value">${customer.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="summary-stat">
                    <p className="summary-label">Transactions</p>
                    <p className="summary-value">{customer.totalTransactions}</p>
                  </div>
                </div>
                
                <h4 className="monthly-title">Monthly Breakdown:</h4>
                <div className="monthly-list">
                  {Object.entries(customer.months).map(([month, data]) => (
                    <div key={month} className="month-item">
                      <div className="month-header">
                        <span className="month-name">{month}</span>
                        <span className="month-points">{data.points} pts</span>
                      </div>
                      <div className="month-details">
                        <span>${data.spent.toLocaleString()} spent</span>
                        <span>{data.transactions} transactions</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(data.points / customer.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Point Calculation Explanation */}
        <div className="explanation-card">
          <h3 className="explanation-title">Point Calculation Rules</h3>
          <div className="rules-grid">
            <div className="rule-card red">
              <div className="rule-points">0 pts</div>
              <p className="rule-range">$0 - $50</p>
              <p className="rule-description">No points earned</p>
            </div>
            <div className="rule-card yellow">
              <div className="rule-points">1x pts</div>
              <p className="rule-range">$51 - $100</p>
              <p className="rule-description">1 point per dollar</p>
            </div>
            <div className="rule-card green">
              <div className="rule-points">2x pts</div>
              <p className="rule-range">Over $100</p>
              <p className="rule-description">2 points per dollar above $100</p>
            </div>
          </div>
          <div className="example-box">
            <p className="example-text">
              <strong>Example:</strong> A $120 purchase earns: 2×($120-$100) + 1×$50 = 2×$20 + $50 = 90 points
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsCalculator;
