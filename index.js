const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initializeDatabase } = require("./db/db.connect");
const InternHouseJobs = require("./models/jobs.model");

// CORS setup
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// auto DB connect for every request (safe for high scale & vercel)
app.use(async (req, res, next) => {
  await initializeDatabase();
  next();
});

// ENDPOINTS
// base route
app.get("/", async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "✅ Intern House backend is operational." });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to run Intern House backend." });
  }
});

// 1. Create a job posting
const createJobPosting = async (jobDetails) => {
  try {
    const job = new InternHouseJobs(jobDetails);
    const savedJob = await job.save();
    return savedJob;
  } catch (error) {
    throw new Error(error.message);
  }
};

app.post("/jobs", async (req, res) => {
  try {
    const job = await createJobPosting(req.body);
    return res
      .status(201)
      .json({ message: "✅ Job created successfully.", job });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to create job posting.",
      error: error.message,
    });
  }
});

// 2. Fetch all job postings
const fetchAllJobPostings = async () => {
  try {
    const jobs = await InternHouseJobs.find();
    return jobs;
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await fetchAllJobPostings();
    return res.status(200).json({
      message: "✅ Successfully fetched all job postings.",
      count: jobs.length,
      jobs: jobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch all job postings.",
      error: error.message,
    });
  }
});

// 3. Fetch a single job posting
const fetchJobById = async (jobId) => {
  try {
    const job = await InternHouseJobs.findById(jobId);
    return job;
  } catch (error) {
    throw new Error(error.message);
  }
};

app.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await fetchJobById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "❌ Job not found." });
    }

    return res.status(200).json({
      message: "✅ Successfully fetched job by Id.",
      job: job,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to fetch job posting by Id.",
      error: error.message,
    });
  }
});

// 3. Delete a job posting
const deleteJobById = async (jobId) => {
  try {
    const deletedJob = await InternHouseJobs.findByIdAndDelete(jobId);
    return deletedJob;
  } catch (error) {
    throw new Error(error.message);
  }
};

app.delete("/jobs/:jobId", async (req, res) => {
  try {
    const deletedJob = await deleteJobById(req.params.jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "❌ Job not found." });
    }

    return res.status(200).json({
      message: "✅ Successfully deleted job by Id.",
      deletedJob: deletedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Failed to delete job posting by Id.",
      error: error.message,
    });
  }
});

// unknown route handler
// prevents requests to wrong route from crashing UI
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found." });
});

// export app for serverless platforms like Vercel (to start the server)
module.exports = app;

// Starting the server for local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
  });
}
