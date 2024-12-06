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
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";

const router = Router();
const JOBS_COLLECTION = "saved_jobs";

// Save a job
router.post("/save", async (req, res) => {
  try {
    const jobData: Job = {
      ...req.body,
      savedAt: serverTimestamp(),
      appliedAt: null,
    };

    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
    const savedDoc = {
      id: docRef.id,
      ...jobData,
      savedAt: new Date().toISOString(),
    };

    res.status(201).json(savedDoc);
  } catch (error) {
    res.status(500).json({ message: "Error saving job", error });
  }
});

// Mark job as applied/not applied
router.put("/:id/applied", async (req, res) => {
  try {
    const { applied } = req.body;
    const jobRef = doc(db, JOBS_COLLECTION, req.params.id);

    await updateDoc(jobRef, {
      appliedAt: applied ? serverTimestamp() : null,
    });

    res.json({
      id: req.params.id,
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
      orderBy("savedAt", "desc")
    );

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      savedAt: doc.data().savedAt?.toDate().toISOString(),
      appliedAt: doc.data().appliedAt?.toDate()?.toISOString(),
    }));

    res.json(jobs);
  } catch (error) {
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

// Analyze jobs (mock implementation)
router.post("/analyze", async (req, res) => {
  try {
    // Mock response with sample jobs
    const mockJobs = [
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "Tech Corp",
        location: "Remote",
        url: "https://example.com/job1",
        matchScore: 95,
        keySkillMatches: ["React", "Node.js", "TypeScript"],
        aiAnalysis:
          "Your experience with modern React development and TypeScript strongly aligns with this role...",
      },
      // ... other mock jobs
    ];

    res.json({
      jobs: mockJobs,
      analysis: {
        totalMatches: mockJobs.length,
        averageMatchScore: 87,
        topSkillsRequired: ["React", "JavaScript", "TypeScript"],
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error analyzing jobs", error });
  }
});

export default router;
