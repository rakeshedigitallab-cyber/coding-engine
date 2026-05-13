const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE = isLocalhost
    ? 'http://143.244.141.123:8080'
    : 'https://edigitallab.com';

// 'https://controltower-backend-fta1.onrender.com'
