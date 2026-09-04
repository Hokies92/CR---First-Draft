# Commercial Ratio Financial Model — Methodology & Audit Standard

## Purpose

The Commercial Ratio (CR) is an operating productivity signal:

**CR = Revenue Growth / Sales & Marketing Expense**

The model does not treat CR as a valuation formula, causal proof, or standalone diagnosis. It separates four layers:

1. **Observation** — reported revenue growth and consistently defined Sales & Marketing expense.
2. **Scenario** — a target CR used to solve either for growth output or required commercial investment.
3. **Accounting bridge** — revenue or expense changes translated through margin, operating profit, after-tax profit, and free cash flow.
4. **Valuation sensitivity** — explicit valuation multiples applied to projected financial outputs.

This separation is mandatory. A CR change does not directly create market capitalization.

---

## 1. Base observation

Revenue growth is calculated, not independently entered:

**Revenue Growth = Current Revenue − Prior-Year Revenue**

**Current CR = Revenue Growth / Sales & Marketing Expense**

The numerator and denominator must cover the same economic period and use a consistent accounting definition.

CR is descriptive. A high or low CR does not by itself establish that the company is efficient, inefficient, underinvesting, overinvesting, sustainable, or unsustainable.

---

## 2. Scenario A — Productivity

Question:

> If Sales & Marketing investment remains fixed, what revenue growth would be implied by a target CR?

**Target Revenue Growth = Target CR × Current Sales & Marketing Expense**

**Incremental Revenue = Target Revenue Growth − Current Revenue Growth**

Incremental revenue is not treated as 100% profit.

**Incremental Gross Profit = Incremental Revenue × Incremental Gross Margin**

**Incremental Variable Opex = Incremental Revenue × Incremental Variable Opex %**

**Δ EBIT = Incremental Gross Profit − Incremental Variable Opex**

**Δ NOPAT = Δ EBIT × (1 − Tax Rate)**

**Incremental FCF = Δ NOPAT − Incremental Capex − Incremental Net Working Capital**

where:

**Incremental Capex = Incremental Revenue × Incremental Capex %**

**Incremental NWC = Incremental Revenue × Incremental NWC %**

---

## 3. Scenario B — Resource

Question:

> If revenue growth remains fixed, what Sales & Marketing expense would be implied by a target CR?

**Required S&M = Current Revenue Growth / Target CR**

**S&M Change = Required S&M − Current S&M**

Negative S&M Change indicates an expense reduction. Positive S&M Change indicates additional investment.

Under the simplified model:

**Δ EBIT = −S&M Change**

**Δ NOPAT = Δ EBIT × (1 − Tax Rate)**

This scenario assumes no revenue degradation from the expense change. That is a scenario assumption, not a forecast. Any production use should include retention, pipeline, lag, capacity, and demand-response effects.

---

## 4. Earnings and EPS

The model never calculates EPS from revenue per share.

Base earnings proxy:

**EBIT = Revenue − Cost of Revenue − S&M − R&D − G&A − Other Operating Expense**

**EBT = EBIT − Interest Expense**

**Net Income Proxy = EBT × (1 − Tax Rate)**

**EPS Proxy = Net Income Proxy / Diluted Shares**

The term **proxy** is intentional. A GAAP EPS forecast requires company-specific treatment of taxes, interest, non-operating items, stock compensation, restructuring, acquisition effects, discontinued operations, dilution, and other applicable adjustments.

---

## 5. EBITDA

**EBITDA = EBIT + Depreciation & Amortization**

The model requires D&A as a separate input. If D&A is zero because the data is unavailable, the output should not be represented externally as audited EBITDA.

---

## 6. Enterprise value and equity value

**Equity Market Capitalization = Stock Price × Diluted Shares**

**Enterprise Value = Equity Market Capitalization + Debt − Cash**

Valuation methods are deliberately separated from operating calculations.

### EV / Revenue sensitivity

**Implied EV = Projected Revenue × Selected EV/Revenue Multiple**

**Implied Equity Value = Implied EV − Debt + Cash**

### EV / EBITDA sensitivity

**Implied EV = Projected EBITDA × Selected EV/EBITDA Multiple**

**Implied Equity Value = Implied EV − Debt + Cash**

This method is not meaningful when projected EBITDA is non-positive.

### P/E sensitivity

**Implied Equity Value = Projected Net Income × Selected P/E Multiple**

This method is not meaningful when projected net income is non-positive.

### Implied price per share

**Implied Price = Implied Equity Value / Diluted Shares**

All valuation outputs are sensitivities under explicit multiples. They are not predicted market reactions.

---

## 7. Required assumption disclosure

Any output presented outside the model should disclose at minimum:

- Measurement period
- Revenue definition
- Sales & Marketing expense definition
- Target CR
- Incremental gross margin
- Incremental variable operating cost ratio
- Tax rate
- Incremental capex ratio
- Incremental working-capital ratio
- Cash
- Debt
- Diluted shares
- Valuation method and selected multiple

A user should be able to distinguish reported facts from assumptions immediately.

---

## 8. What the model can say

The model can answer:

- What is the observed Commercial Ratio?
- At a target CR, what growth output is implied if commercial investment is held constant?
- At a target CR, what commercial investment is implied if growth is held constant?
- Under explicit margin and cost assumptions, what are the resulting EBIT, NOPAT, EPS-proxy, and FCF sensitivities?
- Under explicit valuation multiples, what equity values and share prices are implied?

---

## 9. What the model cannot say by itself

The model cannot prove:

- that Sales & Marketing caused all observed revenue growth;
- that a particular CR is optimal;
- that a low CR means the company is unsustainable;
- that a high CR means the company is underinvesting;
- that expense reductions can occur without revenue consequences;
- that incremental revenue will occur immediately;
- that valuation multiples will remain constant;
- that the market will award the implied equity value;
- that a scenario is a forecast.

Those questions require operating evidence beyond the ratio.

---

## 10. Production-grade extensions

To move from a rigorous one-period sensitivity model to a full forecasting model, add:

1. Multi-period revenue and S&M histories.
2. Lag structures between commercial spending and revenue response.
3. Cohort and retention economics.
4. New-logo versus expansion growth decomposition.
5. Price, volume, and mix decomposition.
6. Segment-level gross margins.
7. Sales-capacity and ramp modeling.
8. Marketing pipeline and conversion dynamics.
9. Scenario probability weighting.
10. DCF valuation with WACC and terminal-value assumptions.
11. Sensitivity tables and Monte Carlo simulation where appropriate.
12. Reconciliation to reported GAAP / IFRS disclosures and company-specific definitions.

---

## Audit principle

**The Commercial Ratio is the observation. The accounting bridge is the translation. Valuation is a separate assumption layer.**

No layer may silently substitute for another.
