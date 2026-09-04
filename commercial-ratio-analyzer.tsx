import React, { useMemo, useState } from 'react';

type Scenario = 'productivity' | 'resource';

type Financials = {
  revenue: number;
  revenuePrevYear: number;
  costOfRevenue: number;
  salesAndMarketing: number;
  researchAndDevelopment: number;
  generalAndAdmin: number;
  otherOperatingExpenses: number;
  depreciationAndAmortization: number;
  interestExpense: number;
  cash: number;
  debt: number;
  dilutedShares: number;
  stockPrice: number;
};

type Assumptions = {
  targetCR: number;
  taxRate: number;
  incrementalGrossMargin: number;
  incrementalVariableOpexPct: number;
  incrementalCapexPct: number;
  incrementalNwcPct: number;
  evSalesMultiple: number;
  evEbitdaMultiple: number;
  peMultiple: number;
};

const initialFinancials: Financials = {
  revenue: 426.96,
  revenuePrevYear: 340.38,
  costOfRevenue: 109.38,
  salesAndMarketing: 169.19,
  researchAndDevelopment: 80.79,
  generalAndAdmin: 65.31,
  otherOperatingExpenses: 0,
  depreciationAndAmortization: 0,
  interestExpense: 0,
  cash: 0,
  debt: 0,
  dilutedShares: 100,
  stockPrice: 26.90,
};

const initialAssumptions: Assumptions = {
  targetCR: 0.75,
  taxRate: 0.21,
  incrementalGrossMargin: 0.744,
  incrementalVariableOpexPct: 0.05,
  incrementalCapexPct: 0.02,
  incrementalNwcPct: 0.03,
  evSalesMultiple: 6.31,
  evEbitdaMultiple: 20,
  peMultiple: 25,
};

const money = (v: number) => Number.isFinite(v) ? `$${v.toFixed(2)}M` : 'N/M';
const num = (v: number) => Number.isFinite(v) ? v.toFixed(2) : 'N/M';
const pct = (v: number) => Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : 'N/M';

const CommercialRatioAnalyzer = () => {
  const [scenario, setScenario] = useState<Scenario>('productivity');
  const [financials, setFinancials] = useState<Financials>(initialFinancials);
  const [assumptions, setAssumptions] = useState<Assumptions>(initialAssumptions);
  const [tab, setTab] = useState<'model' | 'bridge' | 'valuation' | 'audit'>('model');

  const model = useMemo(() => {
    const revenueGrowth = financials.revenue - financials.revenuePrevYear;
    const currentCR = financials.salesAndMarketing > 0 ? revenueGrowth / financials.salesAndMarketing : NaN;
    const grossProfit = financials.revenue - financials.costOfRevenue;
    const grossMargin = financials.revenue > 0 ? grossProfit / financials.revenue : NaN;

    const ebit = financials.revenue - financials.costOfRevenue - financials.salesAndMarketing -
      financials.researchAndDevelopment - financials.generalAndAdmin - financials.otherOperatingExpenses;
    const ebitda = ebit + financials.depreciationAndAmortization;
    const ebt = ebit - financials.interestExpense;
    const netIncomeProxy = ebt * (1 - assumptions.taxRate);
    const eps = financials.dilutedShares > 0 ? netIncomeProxy / financials.dilutedShares : NaN;

    const marketCap = financials.stockPrice * financials.dilutedShares;
    const enterpriseValue = marketCap + financials.debt - financials.cash;

    const validTarget = assumptions.targetCR > 0;
    let projectedRevenue = financials.revenue;
    let projectedCOGS = financials.costOfRevenue;
    let projectedSM = financials.salesAndMarketing;
    let deltaRevenue = 0;
    let deltaGrossProfit = 0;
    let deltaVariableOpex = 0;
    let deltaEBIT = 0;
    let smChange = 0;

    if (validTarget && scenario === 'productivity') {
      const targetGrowth = assumptions.targetCR * financials.salesAndMarketing;
      deltaRevenue = targetGrowth - revenueGrowth;
      deltaGrossProfit = deltaRevenue * assumptions.incrementalGrossMargin;
      deltaVariableOpex = deltaRevenue * assumptions.incrementalVariableOpexPct;
      deltaEBIT = deltaGrossProfit - deltaVariableOpex;
      projectedRevenue = financials.revenue + deltaRevenue;
      projectedCOGS = financials.costOfRevenue + deltaRevenue * (1 - assumptions.incrementalGrossMargin);
    }

    if (validTarget && scenario === 'resource') {
      projectedSM = revenueGrowth / assumptions.targetCR;
      smChange = projectedSM - financials.salesAndMarketing;
      deltaEBIT = -smChange;
    }

    const projectedGrossProfit = projectedRevenue - projectedCOGS;
    const projectedEBIT = ebit + deltaEBIT;
    const projectedEBITDA = projectedEBIT + financials.depreciationAndAmortization;
    const projectedEBT = projectedEBIT - financials.interestExpense;
    const projectedNetIncome = projectedEBT * (1 - assumptions.taxRate);
    const projectedEPS = financials.dilutedShares > 0 ? projectedNetIncome / financials.dilutedShares : NaN;

    const deltaNOPAT = deltaEBIT * (1 - assumptions.taxRate);
    const incrementalCapex = scenario === 'productivity' ? deltaRevenue * assumptions.incrementalCapexPct : 0;
    const incrementalNwc = scenario === 'productivity' ? deltaRevenue * assumptions.incrementalNwcPct : 0;
    const incrementalFCF = deltaNOPAT - incrementalCapex - incrementalNwc;

    const equityEVSales = projectedRevenue * assumptions.evSalesMultiple - financials.debt + financials.cash;
    const equityEVEbitda = projectedEBITDA > 0
      ? projectedEBITDA * assumptions.evEbitdaMultiple - financials.debt + financials.cash
      : NaN;
    const equityPE = projectedNetIncome > 0 ? projectedNetIncome * assumptions.peMultiple : NaN;

    const price = (equity: number) => financials.dilutedShares > 0 && Number.isFinite(equity)
      ? equity / financials.dilutedShares
      : NaN;

    return {
      revenueGrowth, currentCR, grossProfit, grossMargin, ebit, ebitda, netIncomeProxy, eps,
      marketCap, enterpriseValue, validTarget, projectedRevenue, projectedCOGS, projectedSM,
      projectedGrossProfit, projectedEBIT, projectedEBITDA, projectedNetIncome, projectedEPS,
      deltaRevenue, deltaGrossProfit, deltaVariableOpex, deltaEBIT, smChange, deltaNOPAT,
      incrementalCapex, incrementalNwc, incrementalFCF,
      equityEVSales, equityEVEbitda, equityPE,
      priceEVSales: price(equityEVSales), priceEVEbitda: price(equityEVEbitda), pricePE: price(equityPE),
      currentEVSales: financials.revenue > 0 ? enterpriseValue / financials.revenue : NaN,
      currentEVEbitda: ebitda > 0 ? enterpriseValue / ebitda : NaN,
      currentPE: netIncomeProxy > 0 ? marketCap / netIncomeProxy : NaN,
    };
  }, [financials, assumptions, scenario]);

  const setF = (key: keyof Financials, value: number) => setFinancials(p => ({ ...p, [key]: value }));
  const setA = (key: keyof Assumptions, value: number) => setAssumptions(p => ({ ...p, [key]: value }));

  const Input = ({ label, value, onChange, suffix = '' }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) => (
    <label className="block">
      <span className="block text-xs font-medium text-gray-600 mb-1">{label}</span>
      <div className="flex items-center">
        <input type="number" step="0.01" value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-full border rounded px-2 py-1.5 text-sm bg-white" />
        {suffix && <span className="ml-2 text-xs text-gray-500">{suffix}</span>}
      </div>
    </label>
  );

  const Metric = ({ label, value, note }: { label: string; value: string; note?: string }) => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
    </div>
  );

  const valuationRows = [
    ['EV / Revenue', model.currentEVSales, assumptions.evSalesMultiple, model.equityEVSales, model.priceEVSales],
    ['EV / EBITDA', model.currentEVEbitda, assumptions.evEbitdaMultiple, model.equityEVEbitda, model.priceEVEbitda],
    ['P / E', model.currentPE, assumptions.peMultiple, model.equityPE, model.pricePE],
  ] as const;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 text-gray-900">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
        <div>
          <div className="text-xs tracking-widest uppercase text-gray-500">Financial Model v2</div>
          <h1 className="text-3xl font-bold">Commercial Ratio Analyzer</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl">
            CR is an operating productivity signal. Accounting consequences and valuation are modeled as separate, auditable layers.
          </p>
        </div>
        <Metric label="Current Commercial Ratio" value={num(model.currentCR)} note={`${money(model.revenueGrowth)} growth / ${money(financials.salesAndMarketing)} S&M`} />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm">
        <strong>Interpretation rule:</strong> CR alone does not prove that a company is efficient, inefficient, underinvesting, or unsustainable. It is a signal that must be interpreted with margins, growth quality, market opportunity, retention, mix, and investment timing.
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {([['model','Model'],['bridge','Accounting Bridge'],['valuation','Valuation Sensitivity'],['audit','Assumptions & Audit']] as const).map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded text-sm font-medium ${tab === k ? 'bg-gray-900 text-white' : 'bg-white border'}`}>{l}</button>
        ))}
      </div>

      {tab === 'model' && <>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border rounded-lg p-5">
            <h2 className="font-bold text-lg mb-3">Scenario</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setScenario('productivity')} className={`p-3 rounded border text-left ${scenario === 'productivity' ? 'bg-blue-50 border-blue-500' : ''}`}>
                <div className="font-semibold text-sm">Productivity</div><div className="text-xs text-gray-500 mt-1">Hold S&M fixed; solve for growth output at target CR.</div>
              </button>
              <button onClick={() => setScenario('resource')} className={`p-3 rounded border text-left ${scenario === 'resource' ? 'bg-blue-50 border-blue-500' : ''}`}>
                <div className="font-semibold text-sm">Resource</div><div className="text-xs text-gray-500 mt-1">Hold growth fixed; solve for S&M required at target CR.</div>
              </button>
            </div>
            <Input label="Target Commercial Ratio" value={assumptions.targetCR} onChange={v => setA('targetCR', v)} />
            {!model.validTarget && <div className="text-xs text-red-600 mt-2">Target CR must be greater than zero.</div>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Current revenue growth" value={money(model.revenueGrowth)} />
            <Metric label={scenario === 'productivity' ? 'Incremental revenue' : 'S&M change'} value={scenario === 'productivity' ? money(model.deltaRevenue) : money(model.smChange)} note={scenario === 'resource' ? 'Negative = savings; positive = added investment' : undefined} />
            <Metric label="Δ EBIT" value={money(model.deltaEBIT)} />
            <Metric label="Incremental FCF" value={money(model.incrementalFCF)} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-5 overflow-x-auto">
          <h2 className="font-bold text-lg mb-4">Operating Model</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100"><tr><th className="text-left p-2">Line item</th><th className="text-right p-2">Current</th><th className="text-right p-2">Projected</th><th className="text-right p-2">Change</th></tr></thead>
            <tbody>
              {([
                ['Revenue', financials.revenue, model.projectedRevenue],
                ['Cost of revenue', financials.costOfRevenue, model.projectedCOGS],
                ['Gross profit', model.grossProfit, model.projectedGrossProfit],
                ['Sales & marketing', financials.salesAndMarketing, model.projectedSM],
                ['EBIT', model.ebit, model.projectedEBIT],
                ['EBITDA', model.ebitda, model.projectedEBITDA],
                ['Net income proxy', model.netIncomeProxy, model.projectedNetIncome],
              ] as [string,number,number][]).map(([label,current,projected]) => <tr className="border-t" key={label}><td className="p-2 font-medium">{label}</td><td className="p-2 text-right">{money(current)}</td><td className="p-2 text-right">{money(projected)}</td><td className="p-2 text-right">{money(projected-current)}</td></tr>)}
              <tr className="border-t"><td className="p-2 font-medium">EPS proxy</td><td className="p-2 text-right">${num(model.eps)}</td><td className="p-2 text-right">${num(model.projectedEPS)}</td><td className="p-2 text-right">${num(model.projectedEPS-model.eps)}</td></tr>
            </tbody>
          </table>
        </div>
      </>}

      {tab === 'bridge' && <div className="space-y-6">
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-bold text-lg mb-4">Accounting Bridge</h2>
          {scenario === 'productivity' ? <div className="grid md:grid-cols-5 gap-3">
            <Metric label="Δ Revenue" value={money(model.deltaRevenue)} />
            <Metric label="Δ Gross profit" value={money(model.deltaGrossProfit)} note={`Incremental GM ${pct(assumptions.incrementalGrossMargin)}`} />
            <Metric label="Δ Variable opex" value={money(model.deltaVariableOpex)} />
            <Metric label="Δ EBIT" value={money(model.deltaEBIT)} />
            <Metric label="Δ NOPAT" value={money(model.deltaNOPAT)} />
          </div> : <div className="grid md:grid-cols-4 gap-3">
            <Metric label="Current S&M" value={money(financials.salesAndMarketing)} />
            <Metric label="Required S&M" value={money(model.projectedSM)} />
            <Metric label="S&M change" value={money(model.smChange)} />
            <Metric label="Δ EBIT" value={money(model.deltaEBIT)} />
          </div>}
        </div>
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-bold text-lg mb-4">Free Cash Flow Bridge</h2>
          <div className="grid md:grid-cols-4 gap-3"><Metric label="Δ NOPAT" value={money(model.deltaNOPAT)} /><Metric label="Incremental capex" value={money(model.incrementalCapex)} /><Metric label="Incremental NWC" value={money(model.incrementalNwc)} /><Metric label="Incremental FCF" value={money(model.incrementalFCF)} /></div>
          <p className="text-xs text-gray-500 mt-4">Incremental FCF is a scenario output, not a forecast. Company-specific restructuring, financing, SBC, acquisitions, and other items require separate modeling.</p>
        </div>
      </div>}

      {tab === 'valuation' && <div className="space-y-6">
        <div className="bg-white border rounded-lg p-5 overflow-x-auto">
          <h2 className="font-bold text-lg mb-2">Valuation Sensitivity</h2>
          <p className="text-sm text-gray-600 mb-4">Implied values under selected multiples; not predictions of market reaction.</p>
          <table className="w-full text-sm"><thead className="bg-gray-100"><tr><th className="text-left p-2">Method</th><th className="text-right p-2">Current implied multiple</th><th className="text-right p-2">Scenario multiple</th><th className="text-right p-2">Implied equity value</th><th className="text-right p-2">Implied price/share</th><th className="text-right p-2">Vs current market cap</th></tr></thead><tbody>
            {valuationRows.map(([name,currentMult,scenarioMult,equity,price]) => <tr className="border-t" key={name}><td className="p-2 font-medium">{name}</td><td className="p-2 text-right">{num(currentMult)}x</td><td className="p-2 text-right">{num(scenarioMult)}x</td><td className="p-2 text-right">{money(equity)}</td><td className="p-2 text-right">{Number.isFinite(price) ? `$${num(price)}` : 'N/M'}</td><td className="p-2 text-right">{money(equity-model.marketCap)}</td></tr>)}
          </tbody></table>
        </div>
        <div className="grid md:grid-cols-3 gap-3"><Metric label="Current equity market cap" value={money(model.marketCap)} /><Metric label="Current enterprise value" value={money(model.enterpriseValue)} /><Metric label="Current gross margin" value={pct(model.grossMargin)} /></div>
      </div>}

      {tab === 'audit' && <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-bold text-lg mb-4">Base Financial Inputs ($M except price)</h2>
          <div className="grid sm:grid-cols-2 gap-3">{(Object.keys(financials) as (keyof Financials)[]).map(key => <Input key={key} label={key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())} value={financials[key]} onChange={v => setF(key,v)} />)}</div>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <h2 className="font-bold text-lg mb-4">Scenario Assumptions</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Target CR" value={assumptions.targetCR} onChange={v => setA('targetCR',v)} />
            <Input label="Tax rate" value={assumptions.taxRate} onChange={v => setA('taxRate',v)} suffix="decimal" />
            <Input label="Incremental gross margin" value={assumptions.incrementalGrossMargin} onChange={v => setA('incrementalGrossMargin',v)} suffix="decimal" />
            <Input label="Incremental variable opex / revenue" value={assumptions.incrementalVariableOpexPct} onChange={v => setA('incrementalVariableOpexPct',v)} suffix="decimal" />
            <Input label="Incremental capex / revenue" value={assumptions.incrementalCapexPct} onChange={v => setA('incrementalCapexPct',v)} suffix="decimal" />
            <Input label="Incremental NWC / revenue" value={assumptions.incrementalNwcPct} onChange={v => setA('incrementalNwcPct',v)} suffix="decimal" />
            <Input label="EV / Revenue multiple" value={assumptions.evSalesMultiple} onChange={v => setA('evSalesMultiple',v)} suffix="x" />
            <Input label="EV / EBITDA multiple" value={assumptions.evEbitdaMultiple} onChange={v => setA('evEbitdaMultiple',v)} suffix="x" />
            <Input label="P / E multiple" value={assumptions.peMultiple} onChange={v => setA('peMultiple',v)} suffix="x" />
          </div>
          <div className="mt-5 border-t pt-4 text-xs text-gray-600 space-y-2">
            <p><strong>Audit 1:</strong> Revenue growth is calculated from current and prior-year revenue; it is not independently entered.</p>
            <p><strong>Audit 2:</strong> CR uses consistently defined S&M expense for the same measurement period.</p>
            <p><strong>Audit 3:</strong> Incremental revenue passes through incremental gross margin and variable opex before EBIT.</p>
            <p><strong>Audit 4:</strong> EPS derives from after-tax earnings, never revenue per share.</p>
            <p><strong>Audit 5:</strong> EV methods bridge to equity by subtracting debt and adding cash.</p>
            <p><strong>Audit 6:</strong> Valuation multiples are explicit assumptions and outputs are sensitivities, not forecasts.</p>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default CommercialRatioAnalyzer;
