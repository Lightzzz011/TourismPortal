const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const loadEnvFile = () => {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

loadEnvFile();

const PORT = process.env.PORT || process.env.MOCK_API_PORT || 3000;

let bookingCounter = 1000;
const bookings = [];
const otpStore = new Map();

const json = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(body));
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const createOtp = () => `${Math.floor(100000 + Math.random() * 900000)}`;

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.method) {
    json(res, 400, { message: 'Invalid request' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    if (req.method === 'POST' && path === '/api/auth/request-otp') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();

      if (!isValidEmail(email)) {
        json(res, 400, {
          success: false,
          message: 'Please enter a valid email before requesting OTP.',
        });
        return;
      }

      const otp = createOtp();
      otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      json(res, 200, {
        success: true,
        message: `OTP generated for ${email}. In this local demo it is shown below.`,
        previewOtp: otp,
      });
      return;
    }

    if (req.method === 'POST' && path === '/api/auth/verify-otp') {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const otp = String(body.otp || '').trim();
      const record = otpStore.get(email);

      if (!record) {
        json(res, 400, {
          success: false,
          message: 'No OTP request found for this email. Please request a new OTP.',
        });
        return;
      }

      if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        json(res, 400, {
          success: false,
          message: 'OTP expired. Please request a new one.',
        });
        return;
      }

      if (record.otp !== otp) {
        json(res, 400, {
          success: false,
          message: 'Incorrect OTP. Please try again.',
        });
        return;
      }

      otpStore.delete(email);
      json(res, 200, {
        success: true,
        message: 'Email verified successfully.',
      });
      return;
    }

    if (req.method === 'POST' && path === '/api/flights/search') {
      const body = await parseBody(req);
      const from = (body.from || 'Delhi').toString();
      const to = (body.to || 'Mumbai').toString();

      json(res, 200, [
        {
          airline: 'IndiGo',
          flightNo: '6E-101',
          from,
          to,
          departure: '10:30',
          arrival: '12:45',
          duration: '2h 15m',
          price: 5400,
        },
        {
          airline: 'Air India',
          flightNo: 'AI-202',
          from,
          to,
          departure: '14:10',
          arrival: '16:35',
          duration: '2h 25m',
          price: 6200,
        },
      ]);
      return;
    }

    if (req.method === 'POST' && path === '/api/buses/search') {
      const body = await parseBody(req);
      const from = (body.from || 'Delhi').toString();
      const to = (body.to || 'Hyderabad').toString();

      json(res, 200, [
        {
          operator: 'Orange Travels',
          busType: 'AC Sleeper',
          from,
          to,
          departure: '21:30',
          arrival: '06:15',
          duration: '8h 45m',
          price: 1200,
        },
        {
          operator: 'VRL Travels',
          busType: 'Volvo Multi-Axle',
          from,
          to,
          departure: '22:10',
          arrival: '06:45',
          duration: '8h 35m',
          price: 1450,
        },
      ]);
      return;
    }

    if (req.method === 'POST' && path === '/api/hotels/search') {
      const body = await parseBody(req);
      const city = (body.city || 'Mumbai').toString();
      const roomType = (body.roomType || 'AC').toString();
      const checkIn = body.checkIn || null;
      const checkOut = body.checkOut || null;

      json(res, 200, [
        {
          name: 'Hotel Grand Stay',
          location: city,
          roomType,
          checkIn,
          checkOut,
          price: 3200,
        },
        {
          name: 'City Comfort Inn',
          location: city,
          roomType,
          checkIn,
          checkOut,
          price: 2800,
        },
      ]);
      return;
    }

    if (req.method === 'POST' && path === '/api/bookings') {
      const body = await parseBody(req);
      const { bookingType, travellers, totalAmount } = body;
      const mode = url.searchParams.get('mode');

      if (mode === 'bad-request') {
        json(res, 400, {
          success: false,
          message: 'Forced bad request for UI testing',
        });
        return;
      }

      if (mode === 'not-found') {
        json(res, 404, {
          success: false,
          message: 'Forced not found for UI testing',
        });
        return;
      }

      if (mode === 'conflict') {
        json(res, 409, {
          success: false,
          message: 'Forced conflict for UI testing',
        });
        return;
      }

      if (mode === 'server-error') {
        json(res, 500, {
          success: false,
          message: 'Forced server error for UI testing',
        });
        return;
      }

      if (!bookingType || !travellers || !totalAmount) {
        json(res, 400, {
          success: false,
          message: 'bookingType, travellers and totalAmount are required',
        });
        return;
      }

      const booking = {
        id: `BK-${++bookingCounter}`,
        ...body,
        serverTimestamp: new Date().toISOString(),
      };
      bookings.unshift(booking);
      json(res, 200, {
        success: true,
        bookingId: booking.id,
        message: 'Booking submitted successfully',
        request: booking,
      });
      return;
    }

    if (req.method === 'GET' && path === '/api/bookings') {
      json(res, 200, {
        success: true,
        count: bookings.length,
        data: bookings,
      });
      return;
    }

    if (req.method === 'GET' && path.startsWith('/api/bookings/')) {
      const id = path.split('/').pop();
      const booking = bookings.find((b) => b.id === id);
      if (!booking) {
        json(res, 404, { success: false, message: 'Booking not found' });
        return;
      }
      json(res, 200, { success: true, data: booking });
      return;
    }

    if (req.method === 'PUT' && path.startsWith('/api/bookings/')) {
      const id = path.split('/').pop();
      const index = bookings.findIndex((b) => b.id === id);
      if (index === -1) {
        json(res, 404, { success: false, message: 'Booking not found' });
        return;
      }

      const body = await parseBody(req);
      bookings[index] = {
        ...bookings[index],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      json(res, 200, { success: true, data: bookings[index] });
      return;
    }

    if (req.method === 'DELETE' && path.startsWith('/api/bookings/')) {
      const id = path.split('/').pop();
      const index = bookings.findIndex((b) => b.id === id);
      if (index === -1) {
        json(res, 404, { success: false, message: 'Booking not found' });
        return;
      }
      bookings.splice(index, 1);
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
      });
      res.end();
      return;
    }

    json(res, 404, { message: 'Route not found' });
  } catch (err) {
    json(res, 500, {
      success: false,
      message: 'Internal mock server error',
      error: err instanceof Error ? err.message : 'unknown error',
    });
  }
});

server.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
