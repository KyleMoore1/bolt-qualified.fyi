import { OpenAPIV3 } from "openapi-types";

const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Job Application API",
    version: "1.0.0",
    description: "API for managing job applications and analysis",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development server",
    },
  ],
  paths: {
    "/api/jobs/": {
      post: {
        tags: ["Jobs"],
        summary: "Save a new job",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userId", "title", "company", "url"],
                properties: {
                  userId: { type: "string" },
                  title: { type: "string" },
                  company: { type: "string" },
                  url: { type: "string" },
                  aiAnalysis: { type: "string" },
                  matchScore: { type: "number" },
                  keySkillMatches: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Job saved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Job",
                },
              },
            },
          },
        },
      },
    },
    "/api/jobs/{id}": {
      delete: {
        tags: ["Jobs"],
        summary: "Delete a job by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Job deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/jobs/user/{userId}": {
      get: {
        tags: ["Jobs"],
        summary: "Get all jobs for a user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "List of jobs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Job",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/jobs/{id}/applied": {
      put: {
        tags: ["Jobs"],
        summary: "Update job application status",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  applied: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Application status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    appliedAt: {
                      type: "string",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/jobs/analyze": {
      post: {
        tags: ["Jobs"],
        summary: "Analyze jobs based on resume and job URLs",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["resume", "jobUrls"],
                properties: {
                  resume: {
                    type: "string",
                    format: "binary",
                    description: "Candidate's resume file",
                  },
                  jobUrls: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of job posting URLs to analyze",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Jobs analyzed and saved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Job",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Job: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string", nullable: true },
          title: { type: "string" },
          company: { type: "string" },
          url: { type: "string" },
          aiAnalysis: { type: "string" },
          matchScore: { type: "number" },
          keySkillMatches: {
            type: "array",
            items: { type: "string" },
          },
          createdAt: { type: "string", format: "date-time" },
          isApplied: { type: "boolean" },
          appliedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          isSaved: { type: "boolean" },
          savedAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
        required: ["url"],
      },
    },
  },
};

export default swaggerDocument;