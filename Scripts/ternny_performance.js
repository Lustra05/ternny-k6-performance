import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { ENDPOINTS } from '../config/endpoints.js';

const BASE_URL = __ENV.BASE_URL || 'https://httpbin.org'; // Default to httpbin for testing

const TRAFFIC_SPLIT = {
  auth: 0.15,
  plan: 0.35,
  addTrip: 0.20,
  persona: 0.15,
  profile: 0.15
};

export const options = {

  stages: [

    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '1m', target: 0 }

  ],

  thresholds: {

    http_req_duration: ['p(95)<500'],

    http_req_failed: ['rate<0.01'],

    checks: ['rate>0.99']
  }
};

export default function () {

  const random = Math.random();

  if (random < TRAFFIC_SPLIT.auth) {

    group('Auth Endpoint', function () {

      const res = http.get(`${BASE_URL}${ENDPOINTS.auth}`);

      console.log(`Auth: ${res.status}, duration: ${res.timings.duration}ms`);

      check(res, {
        'auth status 200': (r) => r.status === 200,
        'auth body not empty': (r) => r.body && r.body.length > 0,
        'auth response < 500ms': (r) => r.timings.duration < 500
      });

    });

  } else if (random < TRAFFIC_SPLIT.auth + TRAFFIC_SPLIT.plan) {

    group('Plan Endpoint', function () {

      const res = http.get(`${BASE_URL}${ENDPOINTS.plan}`);

      console.log(`Plan: ${res.status}, duration: ${res.timings.duration}ms`);

      check(res, {
        'plan status 200': (r) => r.status === 200,
        'plan body not empty': (r) => r.body && r.body.length > 0,
        'plan response < 600ms': (r) => r.timings.duration < 600
      });

    });

  } else if (random < TRAFFIC_SPLIT.auth + TRAFFIC_SPLIT.plan + TRAFFIC_SPLIT.addTrip) {

    group('Add Trip Endpoint', function () {

      const res = http.get(`${BASE_URL}${ENDPOINTS.addTrip}`);

      console.log(`Add Trip: ${res.status}, duration: ${res.timings.duration}ms`);

      check(res, {
        'add trip status 200': (r) => r.status === 200,
        'add trip body not empty': (r) => r.body && r.body.length > 0,
        'add trip response < 700ms': (r) => r.timings.duration < 700
      });

    });

  } else if (random < TRAFFIC_SPLIT.auth + TRAFFIC_SPLIT.plan + TRAFFIC_SPLIT.addTrip + TRAFFIC_SPLIT.persona) {

    group('Persona Endpoint', function () {

      const res = http.get(`${BASE_URL}${ENDPOINTS.persona}`);

      console.log(`Persona: ${res.status}, duration: ${res.timings.duration}ms`);

      check(res, {
        'persona status 200': (r) => r.status === 200,
        'persona body not empty': (r) => r.body && r.body.length > 0,
        'persona response < 500ms': (r) => r.timings.duration < 500
      });

    });

  } else {

    group('Profile Endpoint', function () {

      const res = http.get(`${BASE_URL}${ENDPOINTS.profile}`);

      console.log(`Profile: ${res.status}, duration: ${res.timings.duration}ms`);

      check(res, {
        'profile status 200': (r) => r.status === 200,
        'profile body not empty': (r) => r.body && r.body.length > 0,
        'profile response < 450ms': (r) => r.timings.duration < 450
      });

    });

  }

  sleep(1);
}

export function handleSummary(data) {

  return {
    'results/HTMLReport1.html': `
      <html>
      <body>
      <h1>Ternny K6 Performance Report</h1>
      <pre>${JSON.stringify(data, null, 2)}</pre>
      </body>
      </html>
    `
  };
}