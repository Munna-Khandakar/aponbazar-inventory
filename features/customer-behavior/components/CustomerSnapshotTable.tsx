import { FullscreenTableCard } from "@/components/dashboard/fullscreen-table-card"
import type {
  CustomerSnapshotRow,
  RankedCustomer,
  RankedProduct,
} from "@/features/customer-behavior/types/CustomerBehaviorDashboard"
import { formatCurrency } from "@/features/customer-behavior/utils/formatCustomerBehaviorValue"

type CustomerSnapshotTableProps = {
  rows: CustomerSnapshotRow[]
}

const RankedProducts = ({ products }: { products: RankedProduct[] }) => (
  <ol className="min-w-52 space-y-1.5">
    {products.map((product, index) => (
      <li key={`${product.subCategory}-${index}`} className="flex items-center justify-between gap-4">
        <span>{index + 1}. {product.subCategory}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatCurrency(product.salesValue)}
        </span>
      </li>
    ))}
  </ol>
)

const RankedCustomers = ({ customers }: { customers: RankedCustomer[] }) => (
  <ol className="min-w-52 space-y-1.5">
    {customers.map((customer, index) => (
      <li key={`${customer.customerName}-${index}`} className="flex items-center justify-between gap-4">
        <span>{index + 1}. {customer.customerName}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatCurrency(customer.spentValue)}
        </span>
      </li>
    ))}
  </ol>
)

function CustomerSnapshotTableBody({ rows }: CustomerSnapshotTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <th className="py-3 pr-6 text-left">Shop Name</th>
          <th className="px-4 py-3 text-right">Credit Sale ROM</th>
          <th className="px-4 py-3 text-left">Top Three Products</th>
          <th className="pl-4 py-3 text-left">Top Three Customers</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.shopName} className="border-b border-border/60 align-top last:border-b-0">
            <td className="py-4 pr-6 font-semibold text-foreground">{row.shopName}</td>
            <td className="px-4 py-4 text-right font-mono whitespace-nowrap">
              {formatCurrency(row.creditSaleRom)}
            </td>
            <td className="px-4 py-4">
              <RankedProducts products={row.topProducts} />
            </td>
            <td className="py-4 pl-4">
              <RankedCustomers customers={row.topCustomers} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function CustomerSnapshotTable({ rows }: CustomerSnapshotTableProps) {
  return (
    <FullscreenTableCard
      className="max-h-[560px] overflow-hidden"
      title="Shop customer snapshot"
      description="Credit sales forecast and leading products and customers by shop"
      fullscreenDescription="Expanded shop-level customer behavior snapshot for the selected period."
      bodyClassName="min-h-0 flex-1 overflow-auto"
    >
      {rows.length ? (
        <CustomerSnapshotTableBody rows={rows} />
      ) : (
        <div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
          No customer snapshot rows available for the current filter.
        </div>
      )}
    </FullscreenTableCard>
  )
}
