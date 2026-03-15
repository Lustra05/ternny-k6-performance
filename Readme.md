# k6 load test scripts for the Ternny API (performance validation + endpoint stability)



This repository contains k6 load test scripts for the Ternny API.

## What’s included

- **Scripts/** – k6 JS scripts that define load test scenarios and thresholds.
  - `ternny_load.js` – simple load test hitting a single endpoint.
  - `ternny_performance.js` – weighted traffic test across multiple endpoints.
- **Config/** – configuration for endpoints used by the scripts.
  - `endpoints.js` – maps logical endpoint names to paths.
- **Results/** – generated test reports (HTML output).

## Requirements

- [k6](https://k6.io/) (tested with v1.5.0)
- Internet access to the target BASE_URL (or use `https://httpbin.org` for local validation)

## Running the tests

### 1) Set the base URL for the API under test

The scripts use the `BASE_URL` environment variable:

```powershell
$env:BASE_URL="https://your-api.example.com"
```

If `BASE_URL` is not set, `ternny_performance.js` defaults to `https://httpbin.org`.

### 2) Run the script

```powershell
k6 run Scripts/ternny_performance.js
```

### 3) View the report

When the test finishes, `ternny_performance.js` writes a simple HTML report to:

- `Results/HTMLReport1.html`

## Customizing the endpoints

Edit `Config/endpoints.js` to point to real API paths.

Example:

```js
export const ENDPOINTS = {
  auth: "/auth",
  plan: "/plan",
  addTrip: "/add-trip",
  persona: "/travel-persona",
  profile: "/profile"
};
```

## Notes

- The thresholds in the scripts are strict (e.g., 99% checks pass, 95th percentile < 500ms). Adjust these values based on your SLA.
- If you see connection errors (timeouts, EOF, connection reset), validate that the base URL is reachable and that the endpoints exist.
