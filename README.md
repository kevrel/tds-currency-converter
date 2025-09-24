# TDS Currency Converter

## Prerequisites
- Node.js 18+ (tested on 22.16.0)
- NPM 8+

## Tech Stack
- Angular 17 (Standalone Components, Control Flow Syntax)
- RxJS for API handling
- SCSS for styling
- CurrencyBeacon API for live currency data

## Setup
```bash
git clone https://github.com/kevrel/tds-currency-converter.git
cd tds-currency-converter
npm install
npm start
```

Then open `http://localhost:4200`.

## Configure API Key
Edit `src/environments/environment.ts` and set:
```ts
export const environment = {
  CURRENCYBEACON_API_KEY: 'your_api_key_here'
};
```

## Usage
- Select currencies, enter amount, click Convert.

## Assumptions & Decisions
- Default currencies are set to GBP → EUR for usability.
- API errors are surfaced to the user with accessible alerts.
- Accessibility features like `aria-live` and `role="alert"` are used for screen reader support.
- Angular 17 control flow syntax (`@if`, `@for`) is used for cleaner templates.
- Signals were considered but not used to maintain team familiarity and avoid over-engineering.
- Endpoints used: `https://api.currencybeacon.com/v1/currencies` and `/convert`.
- Per-component SCSS styling.
- Standalone Angular components; no routing.

## Optional Features
- Swap button to reverse selected currencies.
- Loading indicators for currency fetch and conversion.
- Responsive layout for mobile devices.
