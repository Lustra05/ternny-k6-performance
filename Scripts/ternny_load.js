import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS } from '../config/endpoints.js';

const BASE_URL = __ENV.BASE_URL;

export const options = {

  stages: [

    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 10 },    // Steady state
    { duration: '30s', target: 50 },   // Scale up
    { duration: '2m', target: 50 },    // Peak load
    { duration: '1m', target: 0 }      // Ramp down

  ],

  thresholds: {

    http_req_duration: ['p(95)<500'],

    http_req_failed: ['rate<0.01'],

    checks: ['rate>0.99']

  }
};

export default function () {

  const res = http.get(`${BASE_URL}${ENDPOINTS.plan}`);

  check(res, {
    'status 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'body not empty': (r) => r.body && r.body.length > 0
  });

  sleep(1);
}