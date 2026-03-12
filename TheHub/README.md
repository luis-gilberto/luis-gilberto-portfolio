## Drawer Logomark Sizing (Mobile/Tablet)

Standardize the Hub drawer logomark across StrategyIQ and ScopeIQ:

- Base: `.mobile-drawer-logo { height: 32px; width: auto; object-fit: contain; }`
- Tablet (768px–1024px): `.mobile-drawer-logo { height: 28px; }`
- Mobile small (≤480px): `.mobile-drawer-logo { height: 24px; }`

Primary nav mobile logo:

- At ≤1024px: `.nav-logo .mobile-logo { height: 48px; width: auto; }`
- At ≤480px: `.nav-logo .mobile-logo { height: 40px; }`

Applies in:

- `TheHub/strategyiq/index.html`
- `TheHub/scopeiq/index.html`

Rationale: Preserves brand proportions and visual harmony in drawer headers, prevents oversized display at tablet breakpoints, and keeps consistent scaling across Hub sections.
