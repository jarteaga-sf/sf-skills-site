---
name: sf-se-demo-scripts
description: >
  Demo scripting and PoC accelerator for Salesforce Solution Engineers. Covers demo flow
  design with talk tracks, mock/sample data generation, industry-specific templates
  (Financial Services, Health Cloud, Manufacturing, Retail), wow-moment choreography,
  demo reset/cleanup patterns, and rapid scaffolding. Use when building demos, PoCs,
  creating sample data, planning demo flows, or when the user mentions demo, PoC,
  proof of concept, talk track, demo script, sample data, or mock data.
license: MIT
metadata:
  version: "1.0.0"
  author: "Jorge Arteaga"
  scoring: "100 points across 6 categories"
---

# sf-se-demo-scripts: Demo Scripting & PoC Accelerator

Build compelling Salesforce demos and PoCs fast. This skill provides patterns for demo flow design, realistic sample data, industry templates, and the choreography that makes demos memorable.

## Core Principles

1. **Story over features** — every demo tells a customer story, not a feature list
2. **Realistic data** — fake data kills credibility; use industry-appropriate names, numbers, dates
3. **Wow moments** — choreograph 2-3 moments where the audience reacts
4. **Reset-ready** — every demo can be reset to a clean state in under 2 minutes
5. **Fail-safe** — always have a backup path if something breaks live

---

## Demo Flow Design

### Structure: Setup / Build / Climax / Close

```
┌─────────────────────────────────────────────────┐
│  1. SETUP (2 min)                               │
│     Set the scene: who is the user, what's the  │
│     business problem, why does it matter?        │
├─────────────────────────────────────────────────┤
│  2. BUILD (5-8 min)                             │
│     Walk through the workflow. Show how the     │
│     platform solves each pain point.            │
├─────────────────────────────────────────────────┤
│  3. CLIMAX (2-3 min)                            │
│     The "wow moment" — AI insight, automation   │
│     firing, dashboard updating in real-time.    │
├─────────────────────────────────────────────────┤
│  4. CLOSE (1-2 min)                             │
│     Recap value delivered. Connect to customer  │
│     pain points from discovery.                 │
└─────────────────────────────────────────────────┘
```

### Demo Script Template

For each screen/click in the demo, document:

```
SCREEN: [Page or component name]
CLICK PATH: [Exact clicks to get here]
TALK TRACK: [What to say while showing this screen]
BACKUP: [What to do if this screen fails]
TRANSITION: [How to move to the next screen]
```

### Example Demo Script

```
SCREEN: Account 360 Dashboard
CLICK PATH: App Launcher > Sales Console > Accounts > "Acme Industries"
TALK TRACK:
  "Imagine you're a sales rep starting your day. You open your key account
   and immediately see everything that matters — health score, open pipeline,
   recent activity, and AI-generated next best actions. No clicking around,
   no switching tabs."
BACKUP: If record page is slow, use the pre-loaded browser tab
TRANSITION: "Now let's see what happens when a new opportunity comes in..."
```

---

## Mock Data Generation

### Apex Data Factory Pattern

Create a reusable data factory for demo setup:

```apex
public class DemoDataFactory {

    public static void createFullDemo() {
        List<Account> accounts = createAccounts();
        List<Contact> contacts = createContacts(accounts);
        List<Opportunity> opps = createOpportunities(accounts);
        createCases(accounts, contacts);
        createTasks(contacts, opps);
    }

    public static List<Account> createAccounts() {
        List<Account> accounts = new List<Account>();
        Map<String, Map<String, Object>> acctData = new Map<String, Map<String, Object>>{
            'Acme Industries' => new Map<String, Object>{
                'Industry' => 'Manufacturing', 'AnnualRevenue' => 4500000,
                'NumberOfEmployees' => 250, 'Rating' => 'Hot',
                'BillingCity' => 'San Francisco', 'BillingState' => 'CA'
            },
            'Globex Corporation' => new Map<String, Object>{
                'Industry' => 'Technology', 'AnnualRevenue' => 12000000,
                'NumberOfEmployees' => 800, 'Rating' => 'Hot',
                'BillingCity' => 'Austin', 'BillingState' => 'TX'
            },
            'Initech Solutions' => new Map<String, Object>{
                'Industry' => 'Financial Services', 'AnnualRevenue' => 8500000,
                'NumberOfEmployees' => 400, 'Rating' => 'Warm',
                'BillingCity' => 'New York', 'BillingState' => 'NY'
            },
            'Stark Enterprises' => new Map<String, Object>{
                'Industry' => 'Energy', 'AnnualRevenue' => 25000000,
                'NumberOfEmployees' => 2000, 'Rating' => 'Hot',
                'BillingCity' => 'Chicago', 'BillingState' => 'IL'
            },
            'Wayne Industries' => new Map<String, Object>{
                'Industry' => 'Healthcare', 'AnnualRevenue' => 15000000,
                'NumberOfEmployees' => 1200, 'Rating' => 'Warm',
                'BillingCity' => 'Boston', 'BillingState' => 'MA'
            }
        };

        for (String name : acctData.keySet()) {
            Map<String, Object> fields = acctData.get(name);
            Account a = new Account(Name = name);
            a.Industry = (String)fields.get('Industry');
            a.AnnualRevenue = (Decimal)fields.get('AnnualRevenue');
            a.NumberOfEmployees = (Integer)fields.get('NumberOfEmployees');
            a.Rating = (String)fields.get('Rating');
            a.BillingCity = (String)fields.get('BillingCity');
            a.BillingState = (String)fields.get('BillingState');
            accounts.add(a);
        }
        insert accounts;
        return accounts;
    }

    public static void resetDemo() {
        // Delete in reverse dependency order
        delete [SELECT Id FROM Task WHERE Subject LIKE 'Demo:%'];
        delete [SELECT Id FROM Case WHERE Subject LIKE 'Demo:%'];
        delete [SELECT Id FROM Opportunity WHERE Name LIKE 'Demo:%'];
        delete [SELECT Id FROM Contact WHERE LastName LIKE 'Demo_%'];
        delete [SELECT Id FROM Account WHERE Name IN (
            'Acme Industries','Globex Corporation','Initech Solutions',
            'Stark Enterprises','Wayne Industries'
        )];
    }
}
```

### Realistic Data Rules

| Field Type | Rule | Example |
|-----------|------|---------|
| **Company names** | Use recognizable fictional names, not "Test Account 1" | Acme Industries, Globex Corp |
| **Person names** | Use diverse, realistic names | Sarah Chen, Marcus Johnson, Priya Patel |
| **Revenue** | Use round but believable numbers | $4.5M not $4,567,891.23 |
| **Dates** | Always relative to today, never hardcoded | `Date.today().addDays(-30)` |
| **Stages** | Spread across the pipeline, not all "Closed Won" | 2 Prospecting, 3 Negotiation, 1 Closed Won |
| **Phone/Email** | Use plausible formats | sarah.chen@acme.com, (415) 555-0142 |

### Quick Data via Anonymous Apex

For fast demo setup without deploying a class:

```apex
// Run in Developer Console > Execute Anonymous
// Creates a complete demo dataset in ~5 seconds

Account a = new Account(
    Name = 'Acme Industries',
    Industry = 'Manufacturing',
    AnnualRevenue = 4500000,
    Rating = 'Hot'
);
insert a;

Contact c = new Contact(
    FirstName = 'Sarah', LastName = 'Chen',
    Title = 'VP of Operations', AccountId = a.Id,
    Email = 'sarah.chen@acme.com'
);
insert c;

Opportunity o = new Opportunity(
    Name = 'Acme - Platform Upgrade',
    AccountId = a.Id, Amount = 450000,
    StageName = 'Negotiation/Review',
    CloseDate = Date.today().addDays(30)
);
insert o;
```

---

## Industry Templates

### Financial Services

```
PERSONA: Wealth Advisor / Relationship Manager
KEY OBJECTS: Account (Household), Financial Account, Financial Goal, Opportunity
KPIs: Assets Under Management, Client Satisfaction Score, Financial Goal Progress
DEMO STORY:
  "A wealth advisor opens their morning dashboard and sees a client's
   portfolio has dropped below their risk threshold. The system automatically
   flagged it, created a task, and suggested a rebalancing strategy."
WOW MOMENT: AI-generated next best action suggests specific products based on life events
```

### Health Cloud

```
PERSONA: Care Coordinator / Patient Services Rep
KEY OBJECTS: Account (Patient), Care Plan, Care Program, Clinical Encounter
KPIs: Patient Satisfaction, Care Plan Adherence, Time to Treatment
DEMO STORY:
  "A care coordinator reviews their patient panel. They see a patient
   missed their last appointment and their care plan is falling behind.
   The system proactively identifies at-risk patients and suggests outreach."
WOW MOMENT: Timeline view showing patient journey across all touchpoints
```

### Manufacturing Cloud

```
PERSONA: Account Manager / Sales Operations
KEY OBJECTS: Account, Sales Agreement, Account Forecast, Opportunity
KPIs: Forecast Accuracy, Run Rate Revenue, Account Growth
DEMO STORY:
  "An account manager reviews their sales agreements dashboard. They
   notice a key account's actual orders are trending below forecast.
   They drill in to see which product lines are underperforming."
WOW MOMENT: Forecast vs Actuals chart with AI-predicted gap analysis
```

### Retail / Commerce

```
PERSONA: Store Manager / E-Commerce Merchandiser
KEY OBJECTS: Account, Order, Case, Product
KPIs: Revenue per Customer, Return Rate, Customer Lifetime Value
DEMO STORY:
  "A customer reaches out about a delayed order. The service agent
   sees the full purchase history, loyalty status, and can offer a
   personalized resolution — all without switching screens."
WOW MOMENT: Unified customer profile showing online + in-store activity
```

---

## Wow Moment Choreography

### Types of Wow Moments

| Type | Description | Example |
|------|-------------|---------|
| **Automation** | Something happens automatically | Record saved → flow triggers → related records created → toast confirms |
| **AI/Intelligence** | System provides smart recommendation | Einstein Next Best Action surfaces on record page |
| **Real-time** | Data updates live without refresh | Dashboard metrics animate to new values after record save |
| **Before/After** | Show the old way vs the new way | "Currently this takes 15 clicks. Watch this..." (2 clicks) |
| **Cross-cloud** | Data flows between clouds seamlessly | Service case → Sales notified → Marketing journey triggered |

### Choreographing a Wow Moment

```
SETUP: Prepare the audience for what's about to happen
  "Watch what happens when I save this record..."

ACTION: Perform the trigger action (keep it simple — 1-2 clicks)
  [Click Save]

PAUSE: Let the automation/AI do its work (don't narrate over it)
  [Wait 2-3 seconds]

REVEAL: Draw attention to what just happened
  "Notice how the system automatically created a follow-up task,
   updated the account health score, and notified the account team."

CONNECT: Tie it back to the customer's pain point
  "Today your team does this manually — that's 20 minutes per record.
   This happens in seconds."
```

### Animation Coordination for Demos

Use `sf-lwc-motion` patterns to choreograph visual transitions:

```javascript
// Stagger dashboard cards loading for visual impact
async loadDashboard() {
    this.isLoading = true;

    // Load data
    const data = await getDashboardData();

    // Reveal cards one by one (50ms stagger)
    this.metrics = data.metrics.map((metric, index) => ({
        ...metric,
        animationDelay: `${index * 50}ms`
    }));

    this.isLoading = false;
}
```

---

## Demo Reset Patterns

### Quick Reset Script

```apex
// Anonymous Apex — run before each demo
DemoDataFactory.resetDemo();
DemoDataFactory.createFullDemo();
System.debug('Demo reset complete');
```

### Reset Checklist

Before every demo:

- [ ] Run reset script (Anonymous Apex or SFDX)
- [ ] Clear browser cache and cookies
- [ ] Close all other Salesforce tabs
- [ ] Pre-load key pages in separate tabs (backup)
- [ ] Verify sample data looks correct
- [ ] Test the critical click path once
- [ ] Check internet connectivity
- [ ] Set display to appropriate resolution (1920x1080 recommended)
- [ ] Hide bookmarks bar and unnecessary browser extensions
- [ ] Open Developer Console (minimized) for emergency Apex

### SFDX Reset Command

```bash
# Reset and reload demo data
sf apex run --file scripts/demo-reset.apex --target-org demo-org

# Verify
sf data query --query "SELECT Name, Industry, Rating FROM Account ORDER BY Name" --target-org demo-org
```

---

## Rapid Scaffolding

### Fastest Path: Nothing to Impressive Demo

```
Step 1: Create SFDX project (2 min)
  sf project generate --name my-demo --template standard

Step 2: Create LWC component (1 min)
  sf lightning generate component --name accountDashboard --type lwc

Step 3: Build with skills (10-15 min)
  Use sf-lwc-design + sf-lwc-dataviz + sf-lwc-ux + sf-lwc-motion
  to create a polished dashboard component

Step 4: Deploy and configure (3 min)
  sf project deploy start --target-org demo-org
  → Add to Lightning page in App Builder

Step 5: Load sample data (2 min)
  sf apex run --file scripts/demo-data.apex

Total: ~20 minutes from zero to demo-ready
```

### Component Templates for Common Demo Scenarios

| Scenario | Components Needed | Estimated Build Time |
|----------|------------------|---------------------|
| **Account 360** | Metric cards, activity timeline, related list | 20-30 min |
| **Sales Dashboard** | KPI row, pipeline chart, leaderboard | 25-35 min |
| **Service Console** | Case list, customer card, knowledge sidebar | 30-40 min |
| **Customer Portal** | Hero banner, case submission, FAQ accordion | 30-40 min |
| **AI Assistant** | Chat-like interface, recommendation cards | 20-30 min |

---

## Demo Environment Tips

### Browser Setup

```
- Use Chrome with a clean profile (no personal bookmarks/extensions)
- Set zoom to 100% (Cmd+0 / Ctrl+0)
- Use 1920x1080 resolution if projecting
- Enable "Do Not Disturb" to block notifications
- Pre-load tabs in order of demo flow
```

### Org Preparation

```
- Use a dedicated demo org (never demo in a customer's sandbox)
- Set the org's My Domain to something professional
- Upload customer-appropriate logos if personalizing
- Configure compact layouts for clean record headers
- Set up quick actions for demo-specific workflows
```

### Emergency Recovery

| Problem | Recovery |
|---------|----------|
| Page won't load | Switch to pre-loaded backup tab |
| Data looks wrong | Run reset script, refresh page |
| Flow/automation fails | Show the configuration, explain what should happen |
| Component error | Use browser DevTools console to debug, or skip to next section |
| Internet drops | Have screenshots/recording of the critical demo flow |

---

## Scoring Rubric (100 Points)

| Category | Points | Pass Criteria |
|----------|--------|---------------|
| **Story Clarity** | 25 | Clear persona, business problem, and value narrative |
| **Data Realism** | 20 | Industry-appropriate names, numbers, and relationships |
| **Wow Moments** | 20 | At least 2 choreographed wow moments with setup/reveal |
| **Reset-Ready** | 15 | Can reset to clean state in under 2 minutes |
| **Fail-Safe** | 10 | Backup paths documented for every critical screen |
| **Polish** | 10 | Animations, transitions, consistent branding throughout |

---

## Cross-Skill Integration

| Skill | Relationship |
|-------|-------------|
| **sf-lwc-dataviz** | KPI cards and dashboards are the centerpiece of most demos |
| **sf-lwc-motion** | Animations choreograph wow moments and visual polish |
| **sf-lwc-content** | Industry-specific copy makes demos feel real |
| **sf-lwc-experience** | Portal demos use Experience Cloud patterns |
| **sf-lwc-theming** | Quick customer branding for personalized demos |
| **sf-lwc-ux** | Loading/empty/error states make demos feel production-ready |
