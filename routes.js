const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const LoadReportSchema = new mongoose.Schema({
  name: String,
  wasteType: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RecycleSchema = new mongoose.Schema({
  type: String,
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const LoadReport = mongoose.model('LoadReport', LoadReportSchema);
const Recycle = mongoose.model('Recycle', RecycleSchema);


router.post('/register', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  console.log('Registered user:', name, email);
  return res.status(200).json({ message: 'User registered successfully' });
});


router.post('/report', async (req, res) => {
  const { name, wasteType, description } = req.body;

  if (!name || !wasteType) {
    return res.status(400).json({ message: 'Name and waste type are required' });
  }

  try {
    const newReport = new LoadReport({ name, wasteType, description });
    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully!', report: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not save report.' });
  }
});


router.get('/load-reports', async (req, res) => {
  try {
    const reports = await LoadReport.find().sort({ createdAt: -1 });
    console.log('Fetched reports:', reports);
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not fetch reports.' });
  }
});


router.post('/recycle', async (req, res) => {
  const { type, quantity } = req.body;

  if (!type || !quantity) {
    return res.status(400).json({ message: 'Type and quantity are required' });
  }

  try {
    const recycle = new Recycle({ type, quantity });
    await recycle.save();
    res.status(201).json({ message: 'Recycling data submitted successfully', recycle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not save recycling data.' });
  }
});


router.get('/recycle-list', async (req, res) => {
  try {
    const recycleItems = await Recycle.find().sort({ createdAt: -1 });
    res.json(recycleItems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not fetch recycle list.' });
  }
});

module.exports = router;
