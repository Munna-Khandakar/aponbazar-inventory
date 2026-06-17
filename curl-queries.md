# Report API — curl Reference

All reports go through a single endpoint:

```
POST /api/reports/execute
Content-Type: application/json
```

- **Host (local):** `http://localhost:8083`
- **Auth:** currently `permitAll` on `/reports/**` (test mode). When auth is restored, add `-H "Authorization: Bearer <JWT>"` to every call.
- **Envelope:** every response is wrapped in `{ "success": true, "data": <PagedResponse> }`. The inner `PagedResponse` carries `reportName`, either `data[]` or `series{}`, plus `totalRows`, `executionTimeMs`, `generatedAt`.

---

## Inventory

### `inventory_summary`
Aggregated inventory by warehouse and item.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "inventory_summary" }'
```

### `transactions_by_date`
Raw transactions within a date window.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "transactions_by_date",
    "parameters": { "startDate": "2026-05-01", "endDate": "2026-05-30" }
  }'
```

### `business_partner_summary`
Transactions aggregated by business partner.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "business_partner_summary" }'
```

### `inventory_big_block`
CTE-based block-level inventory. Cached via `InventoryCacheService` — response shape uses `series{ actual, predicted?, summary? }`.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "inventory_big_block",
    "parameters": { "startDate": "2026-05-01", "endDate": "2026-05-30" }
  }'
```

### `inventory_category_detail`
Subcategory-level rollup, optionally filtered by `bigBlock`.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "inventory_category_detail",
    "parameters": {
      "startDate": "2026-05-01",
      "endDate":   "2026-05-30",
      "bigBlock":  "Food"
    }
  }'
```

### `inventory_item_detail`
Item-level rows, optionally filtered by `subCategory` and `shopName`.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "inventory_item_detail",
    "parameters": {
      "startDate":   "2026-05-01",
      "endDate":     "2026-05-30",
      "subCategory": "Noodles",
      "shopName":    "Saturn Textiles Ltd."
    }
  }'
```

---

## Sales

### `last_month_net_sales`
Single-row SUM of net sales for the previous calendar month.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "last_month_net_sales" }'
```

### `month_wise_sales`
Granular sales time series with `actual` + `base` (last year) series, growth target overlay.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "month_wise_sales",
    "parameters": {
      "startDate":    "2026-01-01",
      "endDate":      "2026-05-30",
      "growthTarget": 10,
      "shopName":     null
    }
  }'
```

### `shop_wise_sales`
Per-shop time series, granularity auto-picked by date range, returns `actual` + `base` series.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_wise_sales",
    "parameters": {
      "startDate":    "2026-01-01",
      "endDate":      "2026-05-30",
      "growthTarget": 10
    }
  }'
```

### `shop_wise_sales_aggregate`
One row per shop with totals + performance %.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_wise_sales_aggregate",
    "parameters": {
      "startDate":    "2026-05-01",
      "endDate":      "2026-05-30",
      "growthTarget": 10
    }
  }'
```

### `shop_wise_sales_performance`
Ranking/scoring view of shop performance.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_wise_sales_performance",
    "parameters": { "startDate": "2026-05-01", "endDate": "2026-05-30" }
  }'
```

### `shop_performance_summary`
Multi-period shop summary (prev / current / next month, target + forecast). All parameters optional.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_performance_summary",
    "parameters": { "shopName": null, "growthTarget": 10 }
  }'
```

### `shop_wise_inventory_snapshot`
Latest inventory snapshot per shop. `shopName` optional.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_wise_inventory_snapshot",
    "parameters": { "shopName": null }
  }'
```

### `shop_top_products_customers`
Per-shop top-3 products (subcategory by sales BDT) **and** top-3 customers (by spend BDT) over the last 30 days. Nested `topProducts[]` + `topCustomers[]` inside each row. `shopName` optional.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "shop_top_products_customers",
    "parameters": { "shopName": null }
  }'
```

---

## Customer Analytics

All current-month aggregates; no parameters required.

### `customer_topline_overview`
Single-row: unique customers, total transactions, total sales, avg basket value.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_topline_overview" }'
```

### `customer_churn_summary`
Single-row: counts of `alreadyChurned` vs `atRisk` customers.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_churn_summary" }'
```

### `customer_churn_detail`
One row per customer silent for 60+ days, with `churnStatus` (`At Risk` / `Churned`).
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_churn_detail" }'
```

### `customer_demography_age_gender`
Per-age-group breakdown of customers by gender.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_demography_age_gender" }'
```

### `customer_transaction_methods`
Payment method totals + percentage share (Cash / Card / MFS / Credit).
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_transaction_methods" }'
```

### `customer_purchase_behaviour_analysis`
Scatter-plot ready: per-customer-per-shop purchase frequency (X) and avg spend (Y) for the current month.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "customer_purchase_behaviour_analysis" }'
```

### `top_customers_by_spend`
Top 3 customers by total spend over the last 30 days (excludes walk-in/counter customers).
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "top_customers_by_spend" }'
```

---

## Inventory Prediction (PostgreSQL forecast)

> **Note:** the predicted fetchers intentionally overwrite supplied `predStartDate`/`predEndDate` with a `now()`-based window inside the service — supplying them in the request has no effect.

### `inventory_big_block_prediction`
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{ "reportName": "inventory_big_block_prediction" }'
```

### `inventory_category_detail_prediction`
Optionally filterable by `bigBlock`.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "inventory_category_detail_prediction",
    "parameters": { "bigBlock": "Food" }
  }'
```

### `inventory_item_detail_prediction`
Optionally filterable by `subCategory` and `shopName`.
```bash
curl -X POST http://localhost:8083/api/reports/execute \
  -H "Content-Type: application/json" \
  -d '{
    "reportName": "inventory_item_detail_prediction",
    "parameters": { "subCategory": "Noodles", "shopName": null }
  }'
```

---

## Discovery

### `GET /api/reports/available`
List all registered report names.
```bash
curl http://localhost:8083/api/reports/available
```
