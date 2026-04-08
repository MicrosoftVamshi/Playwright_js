# Project 1 – Playwright with JavaScript (Demoblaze Automation Framework)

## Application Under Test
**Demoblaze** – https://www.demoblaze.com/

This repository contains a complete **Playwright + JavaScript** automation framework built using **Page Object Model (POM)**.  
It supports **data‑driven testing (Excel / CSV / JSON rotation)**, **Playwright HTML** and **Allure** reports, and a **full End‑to‑End (E2E)** workflow.

---

## Tech Stack
- **Language:** JavaScript (Node.js – CommonJS)
- **Test Framework:** Playwright
- **Design Pattern:** Page Object Model (POM)
- **Data Sources:** Excel (`.xlsx`), CSV (`.csv`), JSON (`.json`)
- **Reports:** Playwright HTML Report, Allure Report
- **Environment:** `.env` supported

---

## Requirements Coverage (A–G)

### A) Page classes for all menu pages
Implemented under `src/pages/`:
- `homePage.js` – navigation, product selection, add‑to‑cart
- `signupPage.js` – signup modal + alert handling
- `loginPage.js` – login modal + invalid login alert handling
- `cartPage.js` – cart operations, delete, total, place order
- `contactPage.js` – contact modal
- `aboutPage.js` – about modal

### B) Common Methods class
- `src/common/commonMethods.js`

### C) Utilities for Excel, CSV, JSON + data-files
- `src/utils/excelUtil.js`
- `src/utils/csvUtil.js`
- `src/utils/jsonUtil.js`
- `src/utils/dataFactory.js`
- `data-files/` stores test data used during execution

### D) Allure Reports
- Allure integrated with Playwright execution using Allure CLI

### E) baseURL from config + credentials from `.env`
- `playwright.config.js` defines baseURL, timeouts, reporters
- `.env` supported for environment‑specific values

### F) Multiple config capability
- Config‑driven execution supported (timeouts/retries/workers)
- **Recommended:** `--workers=1` for Demoblaze stability

### G) Test Scenarios
- Signup: `tests/signup.spec.js`
- Login (valid/invalid): `tests/login.spec.js`
- Users login (Excel/CSV/JSON rotation): `tests/data-driven-login.spec.js`
- Item search (Excel/CSV/JSON rotation): `tests/items-search.spec.js`
- Add items to cart: `tests/cart-add.spec.js`
- Delete items from cart: `tests/cart-delete.spec.js`
- End‑to‑End scenario: `tests/e2e.spec.js`

---

## Project Structure

```text
Playwright_js/
├── playwright.config.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
│
├── data-files/
│   ├── users.json
│   ├── users.xlsx
│   ├── users.csv
│   ├── items.json
│   ├── items.xlsx
│   └── items.csv
│
├── src/
│   ├── common/
│   │   └── commonMethods.js
│   ├── pages/
│   │   ├── homePage.js
│   │   ├── signupPage.js
│   │   ├── loginPage.js
│   │   ├── cartPage.js
│   │   ├── contactPage.js
│   │   └── aboutPage.js
│   ├── utils/
│   │   ├── excelUtil.js
│   │   ├── csvUtil.js
│   │   ├── jsonUtil.js
│   │   └── dataFactory.js
│   └── test-data/
│       └── constants.js
│
└── tests/
    ├── signup.spec.js
    ├── login.spec.js
    ├── data-driven-login.spec.js
    ├── items-search.spec.js
    ├── cart-add.spec.js
    ├── cart-delete.spec.js
    └── e2e.spec.js
