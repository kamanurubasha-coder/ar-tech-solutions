const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/artechsolutions';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Basha@123';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const Contact = require('./models/Contact');

const sendEmail = async ({ name, email, phone, service, message }) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || 'noreply@artechsolutions.com';
  const toEmail = process.env.TO_EMAIL || 'kamanurubasha@gmail.com';

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('Email not sent: SMTP credentials not configured.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: `New enquiry from ${name} - AR TECH SOLUTIONS`,
    html: `
      <h2>New Client Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Service:</strong> ${service || 'Not specified'}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Basic ', '');
  const decoded = Buffer.from(token || '', 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  if (username === 'admin' && password === ADMIN_PASSWORD) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).json({ success: false, message: 'Unauthorized' });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/api/enquiries', authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load enquiries' });
  }
});

app.delete('/api/enquiries/:id', authenticateAdmin, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email and message are required.',
    });
  }

  try {
    const contact = new Contact({
      name,
      email,
      phone,
      service,
      message,
    });

    await contact.save();
    await sendEmail({ name, email, phone, service, message });

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received. We will contact you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending your message. Please try again later.',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'AR TECH SOLUTIONS' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.log('Server starting without MongoDB connection.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
