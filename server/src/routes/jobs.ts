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
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        url: "https://example.com/job1",
        matchScore: 95,
        keySkillMatches: ["React", "TypeScript", "Tailwind CSS"],
        aiAnalysis:
          "Your experience with modern React development and TypeScript strongly aligns with this role. The emphasis on UI/UX in your portfolio projects particularly matches their focus on creating polished user experiences. Consider highlighting your experience with performance optimization and state management.",
      },
      {
        id: "2",
        title: "Full Stack Engineer",
        company: "Innovation Labs",
        url: "https://example.com/job2",
        matchScore: 85,
        keySkillMatches: ["React", "Node.js", "REST APIs"],
        aiAnalysis:
          "While your frontend skills are a perfect match, you might want to emphasize your backend experience more in your application. Your GitHub projects show good understanding of full-stack architecture, but highlighting any experience with microservices would strengthen your application.",
      },
      {
        id: "3",
        title: "UI/UX Developer",
        company: "Design Studio",
        url: "https://example.com/job3",
        matchScore: 75,
        keySkillMatches: ["React", "CSS", "UI Design"],
        aiAnalysis:
          "Your strong CSS and React skills are relevant, but this role has a heavier focus on design thinking and user research than your current experience shows. Consider showcasing any A/B testing or user feedback implementation experience you have.",
      },
      {
        id: "4",
        title: "DevOps Engineer",
        company: "Cloud Systems Inc.",
        url: "https://example.com/job4",
        matchScore: 45,
        keySkillMatches: ["Git", "CI/CD"],
        aiAnalysis:
          "While you have some relevant experience with Git and deployment workflows, this role requires deep expertise in AWS, Kubernetes, and infrastructure automation that isn't evident in your background. Significant additional DevOps experience would be needed to be competitive for this position.",
      },
      {
        id: "5",
        title: "Machine Learning Engineer",
        company: "AI Solutions Ltd.",
        url: "https://example.com/job5",
        matchScore: 35,
        keySkillMatches: ["Python", "Data Analysis"],
        aiAnalysis:
          "This role requires specialized machine learning expertise and experience with ML frameworks that isn't present in your background. While you have some Python experience, the core ML engineering skills needed for this position don't align with your current skill set.",
      },
      {
        id: "6",
        title: "Embedded Systems Developer",
        company: "IoT Devices Corp",
        url: "https://example.com/job6",
        matchScore: 25,
        keySkillMatches: ["C++"],
        aiAnalysis:
          "This position focuses on low-level embedded systems programming and hardware interfaces, which is quite different from your web development background. The required expertise in embedded C++ and real-time operating systems represents a significant skill gap.",
      },
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
