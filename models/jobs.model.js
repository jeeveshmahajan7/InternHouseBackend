const mongoose = require("mongoose");

const jobListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required."],
    },
    location: {
      type: String,
      required: [true, "Location is required."],
    },
    salary: {
      type: Number,
    },
    jobType: {
      type: String,
      enum: [
        "Full-time (On-site)",
        "Part-time (On-site)",
        "Full-time (Remote)",
        "Part-time (Remote)",
      ],
      required: [true, "Select from dropdown options."],
    },
    jobDescription: {
      type: String,
      required: [true, "Enter the Job Description."],
    },
    qualifications: {
      type: [String],
      required: [true, "Enter the required qualifications."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternHouseJobs", jobListingSchema);
