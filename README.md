# Commercial Ratio Analyzer

A sophisticated interactive tool for analyzing sales and marketing efficiency through the Commercial Ratio (CR) framework. This component provides real-time calculations of how CR adjustments impact business metrics and financial performance.

## Overview

The Commercial Ratio Analyzer is a React-based financial analysis tool designed to help business leaders optimize their sales and marketing investments. By visualizing the relationship between revenue growth and sales & marketing expenses, this tool enables data-driven decisions about resource allocation and efficiency improvements.

![Commercial Ratio Analyzer Screenshot](https://placeholder-for-screenshot.png)

## Features

- **Interactive Commercial Ratio Controls**: Adjust target CR values using an intuitive slider interface
- **Dual Impact Analysis**: Toggle between revenue growth and cost reduction scenarios
- **Multi-dimensional Reporting**: Access comprehensive analysis across four key domains:
  - Overview metrics and performance indicators
  - Investor relations and market valuation impact
  - Functional impact across sales and marketing teams
  - Detailed financial analysis with income statement projections
- **Performance Zone Visualization**: Intuitive gauge display showing sustainable, balanced, and underinvesting zones
- **Real-time Calculations**: All financial projections update instantly as parameters change

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- React (v16.8.0 or higher)
- Tailwind CSS (v2.0.0 or higher)

### NPM Installation

```bash
npm install commercial-ratio-analyzer
```

### Yarn Installation

```bash
yarn add commercial-ratio-analyzer
```

## Basic Usage

```jsx
import React from 'react';
import CommercialRatioAnalyzer from 'commercial-ratio-analyzer';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Analysis Dashboard</h1>
      <CommercialRatioAnalyzer />
    </div>
  );
}

export default App;
```

## Advanced Configuration

The analyzer accepts several configuration props to customize its behavior:

```jsx
<CommercialRatioAnalyzer 
  initialFinancials={{
    revenue: 426.96,
    revenuePrevYear: 340.38,
    revenueGrowth: 86.58,
    costOfRevenue: 109.38,
    salesAndMarketing: 169.19,
    researchAndDevelopment: 80.79,
    generalAndAdmin: 65.31,
    otherExpenses: 0.00,
    psRatio: 6.31,
    peRatio: 25.0,
    sharesOutstanding: 100,
    stockPrice: 26.90,
  }}
  initialRatio={0.75}
  defaultImpactType="revenue"
  activeTab="overview"
  onMetricsChange={(metrics) => console.log('Updated metrics:', metrics)}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialFinancials` | Object | *See code sample above* | Initial financial metrics used for calculations |
| `initialRatio` | Number | 0.51 | Starting commercial ratio value |
| `defaultImpactType` | String | 'revenue' | Initial impact scenario type ('revenue' or 'cost') |
| `activeTab` | String | 'overview' | Initial active tab |
| `onMetricsChange` | Function | null | Callback function triggered when calculated metrics change |
| `enableAllTabs` | Boolean | true | When false, only shows the overview tab |
| `theme` | Object | *Default theme* | Custom theme configuration |

### Events

The component supports the following callback events:

- `onRatioChange`: Triggered when the commercial ratio is adjusted
- `onTabChange`: Triggered when the active tab changes
- `onImpactTypeChange`: Triggered when the impact scenario changes
- `onCalculationsComplete`: Triggered when all calculations are completed

## Integration Examples

### Connecting to External Data Services

```jsx
import React, { useState, useEffect } from 'react';
import CommercialRatioAnalyzer from 'commercial-ratio-analyzer';
import { fetchFinancialData } from './api';

function FinancialDashboard() {
  const [financials, setFinancials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchFinancialData();
        setFinancials(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div>Loading financial data...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Analysis Dashboard</h1>
      {financials && <CommercialRatioAnalyzer initialFinancials={financials} />}
    </div>
  );
}
```

### Saving Analysis Results

```jsx
function AnalysisDashboard() {
  const handleMetricsChange = (metrics) => {
    // Store metrics in state, database, or analytics service
    saveMetricsToDatabase(metrics);
  };

  return (
    <CommercialRatioAnalyzer 
      onMetricsChange={handleMetricsChange}
    />
  );
}
```

## Performance Optimization

The Commercial Ratio Analyzer is optimized for performance in several ways:

1. **Tab-Based Rendering**: Only the active tab's content is rendered, reducing DOM complexity
2. **Efficient State Updates**: Uses functional state updates to prevent unnecessary re-renders
3. **Memoized Calculations**: Complex calculations use appropriate dependency arrays

For applications with very large datasets or complex financial models, consider these additional optimizations:

```jsx
import React, { useMemo } from 'react';
import CommercialRatioAnalyzer from 'commercial-ratio-analyzer';

function OptimizedDashboard({ complexData }) {
  // Preprocess data to simplify downstream calculations
  const processedData = useMemo(() => {
    // Heavy preprocessing here
    return transformedData;
  }, [complexData]);

  return <CommercialRatioAnalyzer initialFinancials={processedData} />;
}
```

## Browser Compatibility

The Commercial Ratio Analyzer is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Developed with financial analysis best practices from leading industry experts
- Tailwind CSS for the responsive UI components
- React for the component architecture

---

## Additional Documentation

- [Implementation Guide](./commercial-ratio-analyzer-documentation.md)
- [Agile Program Management Guide](./agile-program-management.md)
