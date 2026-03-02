export function DashboardRightSidebar() {
  return (
    <aside className="space-y-4 rounded-xl border border-border/70 bg-card/90 p-4 shadow-sm">
      <section className="space-y-3 rounded-lg border border-border/70 bg-background/80 p-3">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">Filters</h3>
          <p className="text-xs text-muted-foreground">Refine the dashboard view by date and priority.</p>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Start Date
          <input
            type="date"
            className="w-full rounded-md border border-border/70 bg-background px-2.5 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          End Date
          <input
            type="date"
            className="w-full rounded-md border border-border/70 bg-background px-2.5 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Performance
          <select className="w-full rounded-md border border-border/70 bg-background px-2.5 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
            <option>High</option>
            <option>Mid</option>
            <option>Low</option>
          </select>
        </label>
      </section>

      <section className="space-y-1 rounded-lg border border-dashed border-border/70 bg-background/80 p-3">
        <h3 className="text-sm font-semibold">Insights Placeholder</h3>
        <p className="text-xs text-muted-foreground">
          Add insight cards, assistant widgets, or alert summaries here.
        </p>
      </section>
    </aside>
  )
}
