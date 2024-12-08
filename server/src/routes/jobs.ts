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
  getDoc,
} from "firebase/firestore";
import multer from "multer";
import { docxToMarkdown, pdfToMarkdown } from "../utils/documentConverter.js";
import { analyze } from "../lib/jobAnalyzer.js";

const router = Router();
const JOBS_COLLECTION = "saved_jobs";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept pdf and docx files only
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Please upload PDF or DOCX files."));
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
    console.log("Saving job - Request params:", req.params);
    console.log("Saving job - Request body:", req.body);

    const jobId = req.params.id;
    const { userId, isSaved } = req.body;
    const jobRef = doc(db, JOBS_COLLECTION, jobId);

    const updateData = {
      userId: userId,
      isSaved: isSaved,
      savedAt: isSaved ? serverTimestamp() : null,
    };
    console.log("Saving job - Update data:", updateData);

    await updateDoc(jobRef, updateData);
    const updatedDoc = await getDoc(jobRef);
    const updatedData = updatedDoc.data();

    if (!updatedData) {
      throw new Error("Failed to fetch updated job data");
    }

    const response = {
      id: jobId,
      title: updatedData.title ?? "",
      company: updatedData.company ?? "",
      url: updatedData.url ?? "",
      matchScore: updatedData.matchScore ?? 0,
      keySkillMatches: updatedData.keySkillMatches ?? [],
      aiAnalysis: updatedData.aiAnalysis ?? "",
      createdAt:
        updatedData.createdAt?.toDate().toISOString() ??
        new Date().toISOString(),
      userId: updatedData.userId ?? null,
      isApplied: updatedData.isApplied ?? false,
      appliedAt: updatedData.appliedAt?.toDate()?.toISOString() ?? null,
      isSaved: updatedData.isSaved ?? false,
      savedAt: updatedData.savedAt?.toDate()?.toISOString() ?? null,
    };
    console.log("Sending response:", response);

    res.json(response);
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ message: "Error updating job saved status", error });
  }
});

// Analyze jobs and save them to database
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("Starting /analyze endpoint");
    console.log("File details:", {
      originalname: req?.file?.originalname,
      mimetype: req?.file?.mimetype,
      size: req?.file?.size,
    });
    console.log("Job URLs:", req.body.jobUrls);

    if (!req.file || !req.body.jobUrls) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ message: "Resume file and job URLs are required" });
    }

    // Convert resume to markdown based on file type
    let resumeMarkdown;
    try {
      console.log("Starting document conversion...");
      if (req.file.mimetype === "application/pdf") {
        console.log("Converting PDF to markdown");
        resumeMarkdown = await pdfToMarkdown(req.file.buffer);
      } else {
        console.log("Converting DOCX to markdown");
        resumeMarkdown = await docxToMarkdown(req.file.buffer);
      }
      console.log("Document conversion successful");
      console.log("Markdown length:", resumeMarkdown.length);
      console.log(
        "First 200 characters of markdown:",
        resumeMarkdown.substring(0, 200)
      );
    } catch (error) {
      console.error("Error converting resume:", error);
      return res.status(500).json({ message: "Error processing resume file" });
    }

    // Handle multiple jobUrls form fields
    const jobUrls = Array.isArray(req.body.jobUrls)
      ? req.body.jobUrls
      : [req.body.jobUrls];

    // Clean up URLs
    const cleanedUrls = jobUrls
      .map((url: string) => url.trim())
      .filter((url: string) => url.length > 0);

    console.log("Processed URLs:", cleanedUrls);
    console.log(`Processing ${cleanedUrls.length} job URLs`);

    const analyzedJobs = await analyze(cleanedUrls, resumeMarkdown);
    const savedJobs = [];

    for (const analyzedJob of analyzedJobs) {
      // Create a complete job document by adding the required fields
      const jobDoc = {
        ...analyzedJob,
        createdAt: serverTimestamp(),
        userId: null,
        isApplied: false,
        appliedAt: null,
        isSaved: false,
        savedAt: null,
      };

      const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobDoc);

      // Format the response with ISO string dates
      savedJobs.push({
        id: docRef.id,
        ...analyzedJob,
        createdAt: new Date().toISOString(),
        userId: null,
        isApplied: false,
        appliedAt: null,
        isSaved: false,
        savedAt: null,
      });
    }

    return res.json({ jobs: savedJobs });
  } catch (error) {
    console.error("Error in /analyze:", error);
    res.status(500).json({ message: "Error analyzing jobs", error });
  }
});

export default router;
