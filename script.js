// import http from 'k6/http';
// import { sleep } from 'k6';
//
// export const options = {
//   vus: 1000,
//   duration: '30s',
// };
//
// export default function () {
//   http.get('http://127.0.0.1:6565/rooms/14');
//   sleep(1);
// };

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    {
      duration: '1m',
      target: 1000,
    },
    {
      duration: '1m',
      target: 1500,
    },
    {
      duration: '1m',
      target: 2500,
    },
  ],
};

export default function () {
  let id = Math.floor(Math.random() * (14000000 - 2000000)) + 2000000;
  let res = http.get(`http://127.0.0.1:6565/rooms/${id}`);
  check(res, {
    'status was 200': r => r.status === 200,
  });
  sleep(0.1);
}


// import http from 'k6/http';
// import { check, sleep } from 'k6';
//
// export const options = {
//   vus: 100,
//   duration: '5m',
//   rps: 1000,
// };
//
// export default function () {
//   const low = 100;
//   const high = 10000000;
//   const num = Math.floor(Math.random() * (high - low + 1)) + low;
//   const res = http.get(`http://127.0.0.1:6565/rooms/${num}`);
//   check(res, {
//     'status was 200': r => r.status === 200,
//     'transaction time OK': r => r.timings.duration < 200,
//   });
//   sleep(1);
// };
