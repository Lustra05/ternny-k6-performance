import http from 'k6/http';
import { check, sleep } from 'k6';
import { ENDPOINTS } from '../config/endpoints.js';

const BASE_URL = __ENV.BASE_URL;

export const options = {
  vus: 1,
  duration: '30s'
};

export default function () {

  const auth = http.get(`${BASE_URL}${ENDPOINTS.auth}`);
  check(auth, {
    'auth status is 200': (r) => r.status === 200,
    'auth body not empty': (r) => r.body && r.body.length > 0
  });

  const addTrip = http.get(`${BASE_URL}${ENDPOINTS.addTrip}`);
  check(addTrip, {
    'add-trip status is 200': (r) => r.status === 200,
    'add-trip body not empty': (r) => r.body && r.body.length > 0
  });

  const persona = http.get(`${BASE_URL}${ENDPOINTS.persona}`);
  check(persona, {
    'persona status is 200': (r) => r.status === 200,
    'persona body not empty': (r) => r.body && r.body.length > 0
  });

  const plan = http.get(`${BASE_URL}${ENDPOINTS.plan}`);
  check(plan, {
    'plan status is 200': (r) => r.status === 200,
    'plan body not empty': (r) => r.body && r.body.length > 0
  });

  const profile = http.get(`${BASE_URL}${ENDPOINTS.profile}`);
  check(profile, {
    'profile status is 200': (r) => r.status === 200,
    'profile body not empty': (r) => r.body && r.body.length > 0
  });

  sleep(1);
}