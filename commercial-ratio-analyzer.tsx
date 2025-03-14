import React, { useState, useEffect } from 'react';

const CommercialRatioAnalyzer = () => {
  // Initial financial data
  const [financials] = useState({
    revenue: 426.96,
    revenuePrevYear: 340.38,
    revenueGrowth: 86.58,
    costOfRevenue: 109.38,
    salesAndMarketing: 169.19,
    researchAndDevelopment: 80.79,
    generalAndAdmin: 65.31,
    otherExpenses: 0.00,
    psRatio: 6.31, // Price to Sales ratio
    peRatio: 25.0, // Estimated P/E ratio
    sharesOutstanding: 100, // Millions
    stockPrice: 26.90,
  });

  // State for the Commercial Ratio
  const [commercialRatio, setCommercialRatio] = useState(0.51);
  
  // State for selecting impact type (revenue growth or cost reduction)
  const [impactType, setImpactType] = useState('revenue');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculated values state
  const [calculatedValues, setCalculatedValues] = useState({
    totalExpenses: 0,
    ebitda: 0,
    marketCap: 0,
    newRevenueGrowth: 0,
    additionalRevenue: 0,
    newSalesAndMarketing: 0,
    costReduction: 0,
    marketCapImpact: 0,
    newMarketCap: 0,
    percentageGrowth: 0,
    epsImpact: 0
  });

  // Calculate total expenses, EBITDA, and market cap on initial load
  useEffect(() => {
    const totalExpenses = financials.salesAndMarketing + 
                        financials.researchAndDevelopment + 
                        financials.generalAndAdmin + 
                        financials.otherExpenses;
    
    const ebitda = financials.revenue - financials.costOfRevenue - totalExpenses;
    const marketCap = financials.stockPrice * financials.sharesOutstanding;
    
    setCalculatedValues(prev => ({
      ...prev,
      totalExpenses,
      ebitda,
      marketCap
    }));
  }, [financials]);

  // Calculate impact when Commercial Ratio changes
  useEffect(() => {
    if (impactType === 'revenue') {
      // Revenue growth scenario
      const newRevenueGrowth = commercialRatio * financials.salesAndMarketing;
      const additionalRevenue = newRevenueGrowth - financials.revenueGrowth;
      const marketCapImpact = additionalRevenue * financials.psRatio;
      const newMarketCap = calculatedValues.marketCap + marketCapImpact;
      const percentageGrowth = (marketCapImpact / calculatedValues.marketCap) * 100;
      const epsImpact = additionalRevenue / financials.sharesOutstanding;
      
      setCalculatedValues(prev => ({
        ...prev,
        newRevenueGrowth,
        additionalRevenue,
        marketCapImpact,
        newMarketCap,
        percentageGrowth,
        epsImpact
      }));
    } else {
      // Cost reduction scenario
      const newSalesAndMarketing = financials.revenueGrowth / commercialRatio;
      const costReduction = financials.salesAndMarketing - newSalesAndMarketing;
      const marketCapImpact = costReduction * financials.peRatio;
      const newMarketCap = calculatedValues.marketCap + marketCapImpact;
      const percentageGrowth = (marketCapImpact / calculatedValues.marketCap) * 100;
      const epsImpact = costReduction / financials.sharesOutstanding;
      
      setCalculatedValues(prev => ({
        ...prev,
        newSalesAndMarketing,
        costReduction,
        marketCapImpact,
        newMarketCap,
        percentageGrowth,
        epsImpact
      }));
    }
  }, [commercialRatio, impactType, financials, calculatedValues.marketCap]);

  // CR zone helper function
  const getCRZone = (ratio) => {
    if (ratio < 0.75) return "unsustainable";
    if (ratio > 1.25) return "underinvesting";
    return "balanced";
  };

  // Zone style classes
  const zoneClasses = {
    unsustainable: "bg-red-100 border-red-500 text-red-700",
    balanced: "bg-green-100 border-green-500 text-green-700",
    underinvesting: "bg-yellow-100 border-yellow-500 text-yellow-700"
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Commercial Ratio Analyzer</h1>
        <div className="text-sm">
          <span className="text-gray-500">Current CR:</span> 
          <span className="font-bold ml-1 text-blue-700">0.51</span>
          <span className="text-gray-500 ml-4">Target CR:</span> 
          <span className="font-bold ml-1 text-blue-700">{commercialRatio.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Definition Card */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center">
        <div className="flex-grow">
          <div className="text-sm font-medium text-gray-500 mb-1">The Commercial Ratio is a Performance Measure</div>
          <div className="text-lg flex items-center">
            <span className="font-medium mr-2">CR =</span>
            <div className="flex flex-col items-center">
              <span className="border-b border-black px-4">Revenue Growth</span>
              <span>Sales & Marketing Expense</span>
            </div>
          </div>
        </div>
        <div className="bg-blue-700 text-white p-3 rounded-lg text-sm max-w-xs">
          <p>The purpose of Sales & Marketing is to drive revenue growth. The CR measures how efficiently you're converting investments into growth.</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button 
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'irImpact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('irImpact')}
          >
            Investor Relations Impact
          </button>
          <button 
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'functionalImpact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('functionalImpact')}
          >
            Functional Impact
          </button>
          <button 
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'financials' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setActiveTab('financials')}
          >
            Detailed Financials
          </button>
        </nav>
      </div>
      
      {/* Tab Content Area */}
      {activeTab === 'overview' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Investor Impact at Target CR: {commercialRatio.toFixed(2)}</h2>
          
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="flex flex-col border rounded-lg p-4 bg-blue-50">
              <span className="text-xs text-gray-600">Market Cap Impact</span>
              <span className="text-2xl font-bold">${Math.abs(calculatedValues.marketCapImpact).toFixed(2)}M</span>
              <span className={`text-sm ${calculatedValues.marketCapImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedValues.marketCapImpact >= 0 ? '+' : ''}{calculatedValues.percentageGrowth.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex flex-col border rounded-lg p-4 bg-blue-50">
              <span className="text-xs text-gray-600">EPS Impact</span>
              <span className="text-2xl font-bold">${Math.abs(calculatedValues.epsImpact).toFixed(2)}</span>
              <span className={`text-sm ${calculatedValues.epsImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedValues.epsImpact >= 0 ? '+' : ''}{((calculatedValues.epsImpact / (calculatedValues.ebitda/financials.sharesOutstanding)) * 100).toFixed(2)}%
              </span>
            </div>
            
            <div className="flex flex-col border rounded-lg p-4 bg-blue-50">
              <span className="text-xs text-gray-600">EBITDA Impact</span>
              <span className="text-2xl font-bold">
                ${impactType === 'revenue' 
                  ? (calculatedValues.additionalRevenue).toFixed(2)
                  : (calculatedValues.costReduction).toFixed(2)}M
              </span>
              <span className="text-sm text-green-600">
                +{((impactType === 'revenue' 
                  ? calculatedValues.additionalRevenue 
                  : calculatedValues.costReduction) / calculatedValues.ebitda * 100).toFixed(2)}%
              </span>
            </div>
            
            <div className="flex flex-col border rounded-lg p-4 bg-blue-50">
              <span className="text-xs text-gray-600">Stock Price Projection</span>
              <span className="text-2xl font-bold">
                ${(financials.stockPrice * (1 + calculatedValues.percentageGrowth/100)).toFixed(2)}
              </span>
              <span className={`text-sm ${calculatedValues.percentageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {calculatedValues.percentageGrowth >= 0 ? '+' : ''}{calculatedValues.percentageGrowth.toFixed(2)}%
              </span>
            </div>
          </div>
          
          {/* Controls Section */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-bold mb-4">Commercial Ratio</h2>
              <div className="flex flex-col items-center mb-6">
                <div className="text-xs text-gray-500 mb-1">Revenue Growth / Sales & Marketing Expense</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {commercialRatio.toFixed(2)}
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500">Current: </span>
                  <span className="font-medium ml-1">0.51</span>
                  <span className="text-gray-500 ml-3">Target: </span>
                  <span className="font-medium ml-1">{commercialRatio.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Target Commercial Ratio
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="0.01" 
                  value={commercialRatio}
                  onChange={(e) => setCommercialRatio(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0.0</span>
                  <span>0.5</span>
                  <span>1.0</span>
                  <span>1.5</span>
                  <span>2.0</span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Impact Scenario:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className={`py-2 px-4 rounded-lg text-sm font-medium ${impactType === 'revenue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setImpactType('revenue')}
                  >
                    Revenue Growth
                  </button>
                  <button 
                    className={`py-2 px-4 rounded-lg text-sm font-medium ${impactType === 'cost' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    onClick={() => setImpactType('cost')}
                  >
                    Cost Reduction
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-bold mb-4">Performance Zone</h2>
              
              {/* Gauge visualization */}
              <div className="relative h-24 mb-4">
                {/* Gauge background */}
                <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-8 flex">
                  <div className="w-1/3 h-full bg-red-500 rounded-l-full"></div>
                  <div className="w-1/3 h-full bg-green-500"></div>
                  <div className="w-1/3 h-full bg-yellow-500 rounded-r-full"></div>
                </div>
                
                {/* Gauge labels */}
                <div className="absolute inset-x-0 top-0 flex justify-between text-xs font-semibold">
                  <span className="text-red-700">Unsustainable</span>
                  <span className="text-green-700">Balanced</span>
                  <span className="text-yellow-700">Underinvesting</span>
                </div>
                
                {/* Gauge markers */}
                <div className="absolute inset-x-0 top-16 flex justify-between px-4 text-xs font-medium">
                  <span>0.0</span>
                  <span>0.75</span>
                  <span>1.0</span>
                  <span>1.25</span>
                  <span>2.0</span>
                </div>
                
                {/* Gauge needle */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-1 h-12 bg-black"
                  style={{ 
                    left: `${Math.min(Math.max(commercialRatio / 2, 0), 1) * 100}%`,
                    transform: 'translateX(-50%) translateY(-50%)'
                  }}
                ></div>
              </div>
              
              {/* Current zone info */}
              <div className={`border rounded-lg p-4 ${zoneClasses[getCRZone(commercialRatio)]}`}>
                <div className="text-sm font-semibold mb-2">
                  {getCRZone(commercialRatio) === 'unsustainable' ? 'UNSUSTAINABLE ZONE' :
                   getCRZone(commercialRatio) === 'balanced' ? 'BALANCED ZONE' :
                   'UNDERINVESTING ZONE'}
                </div>
                <div className="text-xs">
                  {getCRZone(commercialRatio) === 'unsustainable' ? 
                    'High waste, inefficiency, reactive approach, and internal conflict. Long-term viability at risk.' :
                   getCRZone(commercialRatio) === 'balanced' ? 
                    'Optimized performance with proactive approach and minimal internal conflict. Sustainable growth.' :
                    'Missing market opportunities due to underinvestment. Growth potential not being fully realized.'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Commercial System Impact */}
          <div className="bg-white p-6 rounded-lg shadow border mb-6">
            <h2 className="text-xl font-bold mb-4">Commercial System Impact</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col border rounded p-3">
                <span className="text-xs text-gray-500 mb-1">Current S&M Investment</span>
                <span className="font-bold">${financials.salesAndMarketing.toFixed(2)}M</span>
              </div>
              <div className="flex flex-col border rounded p-3">
                <span className="text-xs text-gray-500 mb-1">Current Revenue Growth</span>
                <span className="font-bold">${financials.revenueGrowth.toFixed(2)}M</span>
              </div>
              <div className="flex flex-col border rounded p-3">
                <span className="text-xs text-gray-500 mb-1">{impactType === 'cost' ? 'New S&M Investment' : 'S&M Investment'}</span>
                <span className="font-bold">
                  ${impactType === 'cost' ? calculatedValues.newSalesAndMarketing.toFixed(2) : financials.salesAndMarketing.toFixed(2)}M
                </span>
                {impactType === 'cost' && (
                  <span className="text-xs text-red-600">
                    -${calculatedValues.costReduction.toFixed(2)}M ({(calculatedValues.costReduction/financials.salesAndMarketing*100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <div className="flex flex-col border rounded p-3">
                <span className="text-xs text-gray-500 mb-1">{impactType === 'revenue' ? 'New Revenue Growth' : 'Revenue Growth'}</span>
                <span className="font-bold">
                  ${impactType === 'revenue' ? calculatedValues.newRevenueGrowth.toFixed(2) : financials.revenueGrowth.toFixed(2)}M
                </span>
                {impactType === 'revenue' && (
                  <span className="text-xs text-green-600">
                    +${calculatedValues.additionalRevenue.toFixed(2)}M ({(calculatedValues.additionalRevenue/financials.revenueGrowth*100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer Summary */}
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              The Commercial Ratio (CR) analysis provides a quantitative framework to understand the efficiency 
              of your sales and marketing investments. Adjusting your CR to {commercialRatio.toFixed(2)} would result in
              {impactType === 'revenue' 
                ? ` ${calculatedValues.additionalRevenue.toFixed(2)}M additional revenue growth.` 
                : ` ${calculatedValues.costReduction.toFixed(2)}M cost reduction while maintaining revenue.`}
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'irImpact' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Investor Relations Impact</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Market Value Creation</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Metric</th>
                    <th className="text-right p-2 border-b">Current</th>
                    <th className="text-right p-2 border-b">Projected</th>
                    <th className="text-right p-2 border-b">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Market Capitalization ($M)</td>
                    <td className="text-right p-2">{calculatedValues.marketCap.toFixed(2)}</td>
                    <td className="text-right p-2">{calculatedValues.newMarketCap.toFixed(2)}</td>
                    <td className="text-right p-2 text-green-600">+{calculatedValues.percentageGrowth.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Stock Price ($)</td>
                    <td className="text-right p-2">{financials.stockPrice.toFixed(2)}</td>
                    <td className="text-right p-2">{(financials.stockPrice * (1 + calculatedValues.percentageGrowth/100)).toFixed(2)}</td>
                    <td className="text-right p-2 text-green-600">+{calculatedValues.percentageGrowth.toFixed(2)}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">EPS Impact ($)</td>
                    <td className="text-right p-2">-</td>
                    <td className="text-right p-2">{calculatedValues.epsImpact.toFixed(2)}</td>
                    <td className="text-right p-2 text-green-600">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">P/E Ratio</td>
                    <td className="text-right p-2">{financials.peRatio.toFixed(2)}</td>
                    <td className="text-right p-2">{financials.peRatio.toFixed(2)}</td>
                    <td className="text-right p-2">0.00%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">P/S Ratio</td>
                    <td className="text-right p-2">{financials.psRatio.toFixed(2)}</td>
                    <td className="text-right p-2">{financials.psRatio.toFixed(2)}</td>
                    <td className="text-right p-2">0.00%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Investor Messaging Implications</h3>
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">Key Investor Narratives</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="text-green-600 mt-1 mr-2">✓</div>
                    <div><strong>Operational Efficiency:</strong> Demonstrating improved returns on sales & marketing investments</div>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-600 mt-1 mr-2">✓</div>
                    <div><strong>Growth Trajectory:</strong> {impactType === 'revenue' ? 'Accelerating revenue growth through strategic investments' : 'Maintaining growth while optimizing cost structure'}</div>
                  </li>
                  <li className="flex items-start">
                    <div className="text-green-600 mt-1 mr-2">✓</div>
                    <div><strong>Market Expansion:</strong> {getCRZone(commercialRatio) === 'balanced' ? 'Balanced approach to market expansion and profitability' : getCRZone(commercialRatio) === 'underinvesting' ? 'Aggressive investment in market capture' : 'Focus on efficiency and ROI'}</div>
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Analyst Relations Focus</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">Quarterly Guidance</div>
                    <div className="text-gray-600">
                      Incorporate CR improvement in {impactType === 'revenue' ? 'revenue growth forecasts' : 'expense projections'} for coming quarters
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Long-term Outlook</div>
                    <div className="text-gray-600">
                      Position Commercial Ratio as a strategic KPI for sustainable growth and market expansion
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Value Creation Narrative</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm mb-3">
                The Commercial Ratio analysis demonstrates a clear path to {impactType === 'revenue' ? 'accelerated revenue growth' : 'improved operational efficiency'} by optimizing our sales and marketing investments. By reaching a target CR of {commercialRatio.toFixed(2)}, we project:
              </p>
              <ul className="list-disc pl-5 text-sm mb-3">
                <li className="mb-1">
                  {impactType === 'revenue' 
                    ? `Additional revenue growth of ${calculatedValues.additionalRevenue.toFixed(2)}M without increasing sales and marketing expenses`
                    : `Reduction in sales and marketing expenses of ${calculatedValues.costReduction.toFixed(2)}M while maintaining current revenue growth`}
                </li>
                <li className="mb-1">
                  Market capitalization increase of approximately ${calculatedValues.marketCapImpact.toFixed(2)}M ({calculatedValues.percentageGrowth.toFixed(2)}%)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'functionalImpact' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Functional Impact Analysis</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Sales Function Impact</h3>
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Current State:</div>
                <div className="text-sm">
                  Sales team is operating at a Commercial Ratio of 0.51, indicating significant inefficiency in converting sales investments to revenue growth.
                </div>
              </div>
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Target State (CR: {commercialRatio.toFixed(2)}):</div>
                <div className="text-sm">
                  {commercialRatio < 0.75 ? 
                    `Still operating in the unsustainable zone. Requires fundamental changes to sales approach and structure.` :
                   commercialRatio >= 0.75 && commercialRatio <= 1.25 ? 
                    `Moving to the balanced zone. Optimizing sales resources and focusing on high-ROI activities.` :
                    `Shifting to underinvestment zone. Expanding sales capacity to capture additional market opportunities.`}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Key Actions:</div>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  {impactType === 'cost' ? (
                    <>
                      <li>Evaluate sales team structure and territory allocation</li>
                      <li>Optimize sales process and eliminate low-value activities</li>
                      <li>Implement performance-based incentives tied to Commercial Ratio</li>
                    </>
                  ) : (
                    <>
                      <li>Focus on higher-value market segments and opportunities</li>
                      <li>Improve sales conversion rates through better qualification</li>
                      <li>Enhance cross-selling and upselling strategies</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Marketing Function Impact</h3>
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Current State:</div>
                <div className="text-sm">
                  Marketing investments are not generating sufficient pipeline and qualified leads to support revenue growth targets.
                </div>
              </div>
              <div className="mb-3">
                <div className="text-sm font-medium mb-1">Target State (CR: {commercialRatio.toFixed(2)}):</div>
                <div className="text-sm">
                  {commercialRatio < 0.75 ? 
                    `Continued inefficiency in marketing spend. Need to reallocate budget to higher-performing channels.` :
                   commercialRatio >= 0.75 && commercialRatio <= 1.25 ? 
                    `Improved marketing ROI with balanced investment across awareness and conversion activities.` :
                    `Aggressive expansion of marketing programs to capture market share and drive growth.`}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Key Actions:</div>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  {impactType === 'cost' ? (
                    <>
                      <li>Eliminate low-performing marketing channels and campaigns</li>
                      <li>Shift focus to conversion optimization over awareness</li>
                      <li>Implement attribution models to track marketing ROI</li>
                    </>
                  ) : (
                    <>
                      <li>Expand targeted demand generation activities</li>
                      <li>Increase investment in content marketing and thought leadership</li>
                      <li>Enhance digital marketing capabilities and automation</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-yellow-50 mb-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">Cross-Functional Alignment</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1">Executive Alignment</div>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  <li>Establish Commercial Ratio as a key corporate KPI</li>
                  <li>Include CR targets in executive scorecards</li>
                  <li>Regular CR reviews in executive meetings</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Planning & Budgeting</div>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  <li>Incorporate CR targets in annual planning</li>
                  <li>Budget allocations based on CR impact</li>
                  <li>Quarterly reviews and adjustments</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Cultural Impact</div>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  <li>Shift from activity to outcome focus</li>
                  <li>Cross-functional collaboration incentives</li>
                  <li>Celebrate CR improvement milestones</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 text-sm text-gray-600">
            <p>
              Improving the Commercial Ratio from 0.51 to {commercialRatio.toFixed(2)} will require significant cross-functional coordination. The changes will impact organizational structure, processes, metrics, and culture across sales, marketing, product, and finance teams.
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'financials' && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6">Detailed Financial Analysis</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Commercial Ratio Breakdown</h3>
            <div className="p-4 border rounded-lg bg-blue-50 mb-6">
              <div className="text-center text-xl mb-3">
                Commercial Ratio = <span className="font-bold">Revenue Growth / Sales & Marketing Expense</span>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Revenue Growth</div>
                  <div className="text-xl font-bold">${financials.revenueGrowth.toFixed(2)}M</div>
                  <div className="text-xs text-gray-500">YoY: +{((financials.revenueGrowth / financials.revenuePrevYear) * 100).toFixed(2)}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">S&M Expense</div>
                  <div className="text-xl font-bold">${financials.salesAndMarketing.toFixed(2)}M</div>
                  <div className="text-xs text-gray-500">{((financials.salesAndMarketing / financials.revenue) * 100).toFixed(2)}% of Revenue</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current CR</div>
                  <div className="text-xl font-bold">{(financials.revenueGrowth / financials.salesAndMarketing).toFixed(2)}</div>
                  <div className="text-xs text-gray-500 text-red-600">Below balanced zone (0.75-1.25)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Income Statement Implications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Line Item</th>
                    <th className="text-right p-2 border-b">Current ($M)</th>
                    <th className="text-right p-2 border-b">Projected ($M)</th>
                    <th className="text-right p-2 border-b">Change ($M)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium text-gray-800">Revenue</td>
                    <td className="text-right p-2">{financials.revenue.toFixed(2)}</td>
                    <td className="text-right p-2">
                      {impactType === 'revenue' 
                        ? (financials.revenue + calculatedValues.additionalRevenue).toFixed(2)
                        : financials.revenue.toFixed(2)}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {impactType === 'revenue' 
                        ? `+${calculatedValues.additionalRevenue.toFixed(2)}`
                        : '0.00'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium text-gray-800">Cost of Revenue</td>
                    <td className="text-right p-2">{financials.costOfRevenue.toFixed(2)}</td>
                    <td className="text-right p-2">{financials.costOfRevenue.toFixed(2)}</td>
                    <td className="text-right p-2">0.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium text-gray-800">Gross Margin</td>
                    <td className="text-right p-2">{(financials.revenue - financials.costOfRevenue).toFixed(2)}</td>
                    <td className="text-right p-2">
                      {impactType === 'revenue' 
                        ? (financials.revenue + calculatedValues.additionalRevenue - financials.costOfRevenue).toFixed(2)
                        : (financials.revenue - financials.costOfRevenue).toFixed(2)}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {impactType === 'revenue' 
                        ? `+${calculatedValues.additionalRevenue.toFixed(2)}`
                        : '0.00'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium text-blue-800">Sales & Marketing</td>
                    <td className="text-right p-2 font-medium text-blue-800">{financials.salesAndMarketing.toFixed(2)}</td>
                    <td className="text-right p-2 font-medium text-blue-800">
                      {impactType === 'cost' 
                        ? calculatedValues.newSalesAndMarketing.toFixed(2)
                        : financials.salesAndMarketing.toFixed(2)}
                    </td>
                    <td className="text-right p-2 font-medium text-green-600">
                      {impactType === 'cost' 
                        ? `-${calculatedValues.costReduction.toFixed(2)}`
                        : '0.00'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium text-gray-800">R&D + G&A + Other</td>
                    <td className="text-right p-2">{(financials.researchAndDevelopment + financials.generalAndAdmin + financials.otherExpenses).toFixed(2)}</td>
                    <td className="text-right p-2">{(financials.researchAndDevelopment + financials.generalAndAdmin + financials.otherExpenses).toFixed(2)}</td>
                    <td className="text-right p-2">0.00</td>
                  </tr>
                  <tr className="border-b font-bold">
                    <td className="p-2 text-gray-800">EBITDA</td>
                    <td className="text-right p-2">{calculatedValues.ebitda.toFixed(2)}</td>
                    <td className="text-right p-2">
                      {impactType === 'revenue' 
                        ? (calculatedValues.ebitda + calculatedValues.additionalRevenue).toFixed(2)
                        : (calculatedValues.ebitda + calculatedValues.costReduction).toFixed(2)}
                    </td>
                    <td className="text-right p-2 text-green-600">
                      {impactType === 'revenue' 
                        ? `+${calculatedValues.additionalRevenue.toFixed(2)}`
                        : `+${calculatedValues.costReduction.toFixed(2)}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Benchmark Comparison</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm mb-4">
                Commercial Ratio benchmark data across similar companies in the industry:
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                <div className="border rounded p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Industry Bottom Quartile</div>
                  <div className="text-xl font-bold">0.40</div>
                </div>
                <div className="border rounded p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Industry Median</div>
                  <div className="text-xl font-bold">0.85</div>
                </div>
                <div className="border rounded p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">Industry Top Quartile</div>
                  <div className="text-xl font-bold">1.20</div>
                </div>
                <div className="border rounded p-3 text-center bg-blue-50">
                  <div className="text-xs text-gray-500 mb-1">Your Target</div>
                  <div className="text-xl font-bold text-blue-700">{commercialRatio.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="mb-2">
                  <strong>Current Position:</strong> With a Commercial Ratio of 0.51, the company currently performs in the <span className="text-red-600 font-medium">bottom quartile</span> of industry benchmarks.
                </p>
                <p>
                  <strong>Target Position:</strong> The target Commercial Ratio of {commercialRatio.toFixed(2)} would position the company in the 
                  {commercialRatio < 0.40 ? ' bottom quartile' : 
                   commercialRatio >= 0.40 && commercialRatio < 0.85 ? ' second quartile' :
                   commercialRatio >= 0.85 && commercialRatio < 1.20 ? ' third quartile' :
                   ' top quartile'} of industry performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommercialRatioAnalyzer;
