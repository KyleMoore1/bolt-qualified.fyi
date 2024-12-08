import type { Job } from "../models/Job.js";
import OpenAI from "openai";
import FirecrawlApp from "@mendable/firecrawl-js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI();

const firecrawlApp = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

interface AnalyzedJob {
  title: string;
  company: string;
  url: string;
  aiAnalysis: string;
  matchScore: number;
  keySkillMatches: string[];
}

/**
 * Analyzes job URLs against a resume to generate job matches and insights
 * @param jobUrls Array of job posting URLs to analyze
 * @param resumeMarkdown Resume content in markdown format
 * @returns Array of analyzed jobs with match scores and insights
 */
export async function analyze(
  jobUrls: string[],
  resumeMarkdown: string
): Promise<AnalyzedJob[]> {
  try {
    // Parallel scraping of all URLs using Firecrawl
    const batchScrapeResponse = await firecrawlApp.batchScrapeUrls(jobUrls, {
      formats: ["markdown"],
    });

    if (!batchScrapeResponse.success) {
      throw new Error(`Failed to scrape: ${batchScrapeResponse.error}`);
    }

    // Create jobs array with URLs and descriptions
    const jobs = batchScrapeResponse.data.map((doc) => ({
      url: doc.metadata?.sourceURL || "",
      description: doc.markdown || "",
    }));

    // Parallel AI analysis of all jobs
    const rankings = await Promise.all(
      jobs.map(async (job) => {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Please read the following job description and candidate resume and determine how well the candidate matches the role.

Focus on the following criteria, in order of importance:

(1) Job Title, Role Level, and Experience Alignment: The candidate's current title and years of experience should closely match the seniority level required by the role. For example, a role requiring significant leadership or 10+ years of experience should not be matched with a candidate who has only 2 years of experience or no management background. Keeping in mind that the titles are not standardized, use your best judgement on if a candidate is a good fit based on their current experience and requirements of the role
(2) Relevant Technical Discipline/Domain Fit: The candidate's core domain (e.g., front-end, back-end, embedded, iOS) must match the job's domain focus.
(3) Minimum Mandatory Requirements: The candidate must meet all must-have technical requirements stated in the job description.
(4) Technology Stack Overlap: The candidate should have demonstrated experience with the specific or equivalent languages, frameworks, or technologies mentioned in the job title and description. If a technology is highlighted in the job title (e.g., "Software Engineer, Go"), that experience should be explicitly present in the candidate's background. 
(5) Preferred (Non-Mandatory) Requirements: Consider these after the mandatory requirements have been evaluated.
(6) Non-Technical Factors: After confirming technical and seniority alignment, consider relevant non-technical aspects. These should not outweigh the technical and experience match.

Return a JSON object with:
{
  "title": "Exact job title from the posting",
  "company": "Company name from the posting",
  "aiAnalysis": "2-3 sentences explaining the match quality, focusing on the most important matching or mismatching criteria",
  "matchScore": numerical value between 0-100,
  "keySkillMatches": Array of specific technical skills, frameworks, and technologies mentioned in the job posting. Note that the keywords must come from the job posting and not the resume. Mention only the most important 3-4 keywords. If there are no relevant keywords, return an empty array. DO NOT include any keywords that are not mentioned in the job posting especially if they are mentioned only in the candidate's resume!!!!!!!
}`,
            },
            {
              role: "user",
              content: `Analyze this resume-job match and provide the assessment in the specified JSON format.

------- Resume -------
${resumeMarkdown}

------- Job Description -------
${job.description}`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const result = JSON.parse(
          completion.choices[0].message.content || "{}"
        ) as Omit<AnalyzedJob, "url">;

        return {
          url: job.url,
          ...result,
        };
      })
    );

    // Sort rankings by score (highest first)
    const sortedRankings = rankings.sort((a, b) => b.matchScore - a.matchScore);

    // Convert rankings to AnalyzedJob format
    return sortedRankings.map((ranking) => ({
      title: ranking.title,
      company: ranking.company,
      url: ranking.url,
      aiAnalysis: ranking.aiAnalysis,
      matchScore: ranking.matchScore,
      keySkillMatches: ranking.keySkillMatches,
    }));
  } catch (error) {
    console.error("Error in analyze function:", error);
    throw error;
  }
}
