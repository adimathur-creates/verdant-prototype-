// ---------- Data ----------
const exceptions = [
  { id: "ACC-00021", priority: "p0", name: "Maya Iyer", company: "Independent contractor", amount: 24800, stage: "Auto-retry failed ×2", aging: "14d", owner: "Unassigned", status: "critical", recommendation: "Move to soft outreach", dpd: 14, contact: "2 days ago", balance: "$24,800" },
  { id: "ACC-00044", priority: "p0", name: "Northwind LLC", company: "SMB · Logistics", amount: 86200, stage: "Negotiation stalled", aging: "21d", owner: "R. Patel", status: "critical", recommendation: "Offer 6-month plan at 4.2% APR", dpd: 21, contact: "5 days ago", balance: "$86,200" },
  { id: "ACC-00078", priority: "p0", name: "Daniel Ortiz", company: "Personal · Tier 1", amount: 12150, stage: "No response 7d", aging: "9d", owner: "K. Liu", status: "critical", recommendation: "Try evening SMS window (7–9pm local)", dpd: 9, contact: "7 days ago", balance: "$12,150" },
  { id: "ACC-00102", priority: "p1", name: "Harper & Sons", company: "SMB · Retail", aging: "5d", amount: 41600, stage: "Awaiting bank confirmation", owner: "R. Patel", status: "warning", recommendation: "Nudge bank ops. ETA confirmation within 24h.", dpd: 5, contact: "Yesterday", balance: "$41,600" },
  { id: "ACC-00133", priority: "p1", name: "Priya Shah", company: "Personal · Tier 2", aging: "6d", amount: 9800, stage: "Plan offered, no accept", owner: "Unassigned", status: "warning", recommendation: "Send simplified plan summary by SMS", dpd: 11, contact: "3 days ago", balance: "$9,800" },
  { id: "ACC-00150", priority: "p1", name: "Brightline Studio", company: "SMB · Media", aging: "4d", amount: 33400, stage: "Partial payment received", owner: "K. Liu", status: "warning", recommendation: "Acknowledge partial. Reschedule remainder.", dpd: 4, contact: "Today", balance: "$33,400" },
  { id: "ACC-00166", priority: "p1", name: "Alex Chen", company: "Personal · Tier 1", aging: "8d", amount: 6700, stage: "Auto-retry failed ×1", owner: "Unassigned", status: "warning", recommendation: "Allow second auto-retry on Friday", dpd: 8, contact: "4 days ago", balance: "$6,700" },
  { id: "ACC-00181", priority: "p1", name: "Lina Park", company: "Personal · Tier 2", aging: "7d", amount: 14200, stage: "Disputed amount", owner: "M. Singh", status: "warning", recommendation: "Route to disputes desk", dpd: 7, contact: "2 days ago", balance: "$14,200" },
  { id: "ACC-00194", priority: "p1", name: "Sun Valley Co-op", company: "SMB · Agriculture", aging: "3d", amount: 52000, stage: "Seasonal hardship flagged", owner: "R. Patel", status: "warning", recommendation: "Offer 90-day hardship deferral", dpd: 3, contact: "Today", balance: "$52,000" },
  { id: "ACC-00207", priority: "p2", name: "Tomás Reyes", company: "Personal · Tier 3", aging: "2d", amount: 3200, stage: "Email bounced", owner: "Unassigned", status: "info", recommendation: "Verify email. Try SMS fallback.", dpd: 2, contact: "—", balance: "$3,200" },
  { id: "ACC-00219", priority: "p2", name: "Olive & Bean", company: "SMB · F&B", aging: "1d", amount: 7800, stage: "First missed retry", owner: "K. Liu", status: "info", recommendation: "Auto-retry scheduled for tomorrow", dpd: 1, contact: "Today", balance: "$7,800" },
  { id: "ACC-00224", priority: "p2", name: "J. Whitman", company: "Personal · Tier 1", aging: "1d", amount: 1850, stage: "First missed retry", owner: "Unassigned", status: "info", recommendation: "Auto-retry scheduled for tomorrow", dpd: 1, contact: "Today", balance: "$1,850" },
];

const accounts = [
  { id: "ACC-00044", name: "Northwind LLC", balance: 86200, stage: "Negotiation", status: "critical", contact: "5 days ago" },
  { id: "ACC-00021", name: "Maya Iyer", balance: 24800, stage: "Auto-retry", status: "critical", contact: "2 days ago" },
  { id: "ACC-00194", name: "Sun Valley Co-op", balance: 52000, stage: "Soft outreach", status: "warning", contact: "Today" },
  { id: "ACC-00102", name: "Harper & Sons", balance: 41600, stage: "Soft outreach", status: "warning", contact: "Yesterday" },
  { id: "ACC-00150", name: "Brightline Studio", balance: 33400, stage: "Auto-retry", status: "warning", contact: "Today" },
  { id: "ACC-00181", name: "Lina Park", balance: 14200, stage: "Negotiation", status: "warning", contact: "2 days ago" },
  { id: "ACC-00078", name: "Daniel Ortiz", balance: 12150, stage: "Soft outreach", status: "critical", contact: "7 days ago" },
  { id: "ACC-00133", name: "Priya Shah", balance: 9800, stage: "Negotiation", status: "warning", contact: "3 days ago" },
  { id: "ACC-00207", name: "Tomás Reyes", balance: 3200, stage: "Auto-retry", status: "info", contact: "—" },
  { id: "ACC-00219", name: "Olive & Bean", balance: 7800, stage: "Auto-retry", status: "healthy", contact: "Today" },
];

const clientStates = {
  autopay: {
    label: "Auto-retry scheduled",
    amount: "$248.00",
    statusTitle: "Next attempt: Friday, Jun 7",
    statusBody: "We'll try your bank again at 6:00am. No action needed — we'll text you the moment it goes through.",
    steps: [
      { state: "done", label: "First attempt: Jun 1" },
      { state: "current", label: "Second attempt: Jun 7" },
      { state: "", label: "If declined, we'll reach out" },
    ],
    explanation: "When auto-retry is scheduled, the borrower sees the amount, the next attempt date, and a single line of plain English about what happens if the retry fails. No legal jargon, no upsell.",
  },
  soft: {
    label: "Let's get this sorted",
    amount: "$248.00",
    statusTitle: "Two attempts didn't go through",
    statusBody: "Could be a temporary bank issue. Tap below to update your payment method or pick a date that works better.",
    steps: [
      { state: "done", label: "We tried twice" },
      { state: "current", label: "Choose what's next" },
      { state: "", label: "We'll confirm by SMS" },
    ],
    explanation: "Soft outreach never opens with a threat. The borrower sees a calm, factual prompt with two clear choices — update method or pick a new date.",
  },
  plan: {
    label: "A plan we built for you",
    amount: "$248.00 → $62/mo",
    statusTitle: "4-month plan available",
    statusBody: "Based on your activity, here's a plan you can accept in one tap. No fees, no credit impact while the plan is active.",
    steps: [
      { state: "done", label: "Plan generated" },
      { state: "current", label: "Review and accept" },
      { state: "", label: "First payment: Jun 15" },
    ],
    explanation: "Repayment plans are pre-approved and one-tap. The borrower always sees what changes (and what doesn't) before they accept.",
  },
};

// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => "$" + n.toLocaleString("en-US");

function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg || "Done.";
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- Nav ----------
function setView(name) {
  $$(".view").forEach(v => v.classList.toggle("active", v.dataset.view === name));
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$(".nav-item").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));

// ---------- Dashboard exception list ----------
function renderTopExceptions() {
  const top = [...exceptions].sort((a, b) => b.amount - a.amount).slice(0, 4);
  $("#exception-list").innerHTML = top.map(e => `
    <div class="exception-row" data-id="${e.id}">
      <div>
        <h3>${e.name}</h3>
        <p>${e.stage} · ${e.aging} aged · ${e.owner}</p>
      </div>
      <div class="exception-amount">
        ${money(e.amount)}
        <span>Open →</span>
      </div>
    </div>
  `).join("");
  $$("#exception-list .exception-row").forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => openDrawer(row.dataset.id));
  });
}

// ---------- Exceptions table ----------
let activeFilter = "all";
let searchTerm = "";

function renderExceptions() {
  const rows = exceptions.filter(e => {
    if (activeFilter !== "all" && e.priority !== activeFilter) return false;
    if (searchTerm) {
      const hay = `${e.id} ${e.name} ${e.company} ${e.owner}`.toLowerCase();
      if (!hay.includes(searchTerm)) return false;
    }
    return true;
  });

  $("#exception-table").innerHTML = rows.map(e => `
    <tr data-id="${e.id}">
      <td><span class="priority ${e.priority}">${e.priority.toUpperCase()}</span></td>
      <td>
        <div class="cell-primary">${e.name}</div>
        <div class="cell-secondary">${e.id} · ${e.company}</div>
      </td>
      <td class="money">${money(e.amount)}</td>
      <td><span class="status ${e.status}">${e.stage}</span></td>
      <td>${e.aging}</td>
      <td>${e.owner}</td>
      <td><button class="row-action">Open</button></td>
    </tr>
  `).join("") || `<tr><td colspan="7" style="padding:28px;text-align:center;color:var(--muted)">No exceptions match.</td></tr>`;

  $$("#exception-table tr[data-id]").forEach(tr => {
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => openDrawer(tr.dataset.id));
  });
}

$$("#filter-group .filter-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    $$("#filter-group .filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderExceptions();
  });
});

$("#exception-search").addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase().trim();
  renderExceptions();
});

// ---------- Accounts table ----------
function renderAccounts() {
  $("#accounts-table").innerHTML = accounts.map(a => `
    <tr data-id="${a.id}">
      <td>
        <div class="cell-primary">${a.name}</div>
        <div class="cell-secondary">${a.id}</div>
      </td>
      <td class="money">${money(a.balance)}</td>
      <td>${a.stage}</td>
      <td><span class="status ${a.status}">${a.status}</span></td>
      <td>${a.contact}</td>
      <td><button class="row-action">View</button></td>
    </tr>
  `).join("");
  $$("#accounts-table tr[data-id]").forEach(tr => {
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => openDrawer(tr.dataset.id));
  });
}

// ---------- Drawer ----------
function openDrawer(id) {
  const e = exceptions.find(x => x.id === id) || accounts.find(x => x.id === id);
  if (!e) return;
  $("#drawer-title").textContent = `Account #${e.id}`;
  $("#drawer-subtitle").textContent = `${e.name} · ${e.company || e.stage}`;
  $("#drawer-recommendation").textContent = e.recommendation || "Continue current strategy. No action needed today.";
  $("#drawer-balance").textContent = e.balance || money(e.amount || e.balance || 0);
  $("#drawer-stage").textContent = e.stage || "—";
  $("#drawer-dpd").textContent = e.dpd != null ? `${e.dpd} days` : "—";
  $("#drawer-contact").textContent = e.contact || "—";
  $("#order-drawer").classList.add("open");
  $("#drawer-backdrop").classList.add("open");
}
function closeDrawer() {
  $("#order-drawer").classList.remove("open");
  $("#drawer-backdrop").classList.remove("open");
}
$("#drawer-close").addEventListener("click", closeDrawer);
$("#drawer-backdrop").addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

// ---------- Client view phone ----------
function renderPhone(stateKey) {
  const s = clientStates[stateKey];
  $("#phone-content").innerHTML = `
    <div class="mobile-brand">Verdant</div>
    <div class="mobile-label">YOUR PAYMENT</div>
    <h3>${s.label}</h3>
    <div class="phone-amount">${s.amount}</div>
    <div class="phone-status-card">
      <div class="phone-status-dot"></div>
      <div>
        <strong>${s.statusTitle}</strong>
        <p>${s.statusBody}</p>
      </div>
    </div>
    <div class="phone-steps">
      ${s.steps.map(st => `
        <div class="phone-step ${st.state}">
          <div class="phone-step-dot">${st.state === "done" ? "✓" : ""}</div>
          <div>${st.label}</div>
        </div>
      `).join("")}
    </div>
    <div class="phone-help">Need help? Reply STOP or call us.</div>
  `;
  $("#state-explanation").textContent = s.explanation;
}
$("#state-select").addEventListener("change", (e) => renderPhone(e.target.value));

// ---------- Generic data-toast + data-nav ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-toast]");
  if (t) {
    e.preventDefault();
    showToast(t.dataset.toast);
  }
  const n = e.target.closest("[data-nav]");
  if (n) {
    e.preventDefault();
    setView(n.dataset.nav);
  }
});

// ---------- Init ----------
renderTopExceptions();
renderExceptions();
renderAccounts();
renderPhone("autopay");
