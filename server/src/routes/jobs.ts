import { Router } from "express";
import { db } from "../models/Job.js";
import type { Job } from "../models/Job.js";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import multer from "multer";

const router = Router();
const JOBS_COLLECTION = "saved_jobs";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept pdf, doc, docx files
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Please upload PDF, DOC, or DOCX files.")
      );
    }
  },
});

// Mark job as applied/not applied
router.put("/:id/applied", async (req, res) => {
  try {
    const { applied } = req.body;
    const jobRef = doc(db, JOBS_COLLECTION, req.params.id);

    await updateDoc(jobRef, {
      isApplied: applied,
      appliedAt: applied ? serverTimestamp() : null,
    });

    res.json({
      id: req.params.id,
      isApplied: applied,
      appliedAt: applied ? new Date().toISOString() : null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
});

// Get jobs for user
router.get("/user/:userId", async (req, res) => {
  try {
    const jobsQuery = query(
      collection(db, JOBS_COLLECTION),
      where("userId", "==", req.params.userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      appliedAt: doc.data().appliedAt?.toDate()?.toISOString() || null,
    }));

    res.json(jobs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Delete a job
router.delete("/:id", async (req, res) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, req.params.id);
    await deleteDoc(jobRef);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
});

// Mark job as saved and assign user
router.put("/:id/saved", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { userId, saved } = req.body;
    const jobRef = doc(db, JOBS_COLLECTION, jobId);

    const updateData = {
      userId: userId,
      isSaved: saved,
      savedAt: saved ? serverTimestamp() : null,
    };

    await updateDoc(jobRef, updateData);

    res.json({
      id: jobId,
      isSaved: saved,
      savedAt: saved ? new Date().toISOString() : null,
      userId: userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating job saved status", error });
  }
});

// Analyze jobs and save them to database
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file || !req.body.jobUrls) {
      return res
        .status(400)
        .json({ message: "Resume file and job URLs are required" });
    }

    // Split comma-separated URLs into array
    const jobUrls = req.body.jobUrls.split(",");

    const savedJobs = [];

    for (const url of jobUrls) {
      const jobData = {
        userId: null,
        title: "Software Engineer", // mock value
        company: "Tech Company", // mock value
        url: url.trim(), // trim whitespace
        aiAnalysis: "This job appears to be a good match for your skills.", // mock value
        matchScore: 85, // mock value
        keySkillMatches: ["JavaScript", "React", "Node.js"], // mock values
        createdAt: serverTimestamp(),
        isApplied: false,
        appliedAt: null,
        isSaved: false,
        savedAt: null,
      };

      const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);

      savedJobs.push({
        id: docRef.id,
        ...jobData,
        createdAt: new Date().toISOString(), // for client response
      });
    }

    res.json({ jobs: savedJobs });
  } catch (error) {
    console.error("Error in /analyze:", error);
    res.status(500).json({ message: "Error analyzing jobs", error });
  }
});

export default router;
