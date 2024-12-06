import type { MatchResult } from '../types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeJobMatches(
  jobUrls: string[],
  resumeFile: File
): Promise<MatchResult> {
  // Simulate API call delay
  await delay(1500);

  // Mock response data
  return {
    jobs: [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        url: 'https://example.com/job1',
        matchScore: 95,
        keySkillMatches: ['React', 'TypeScript', 'Tailwind CSS'],
        aiAnalysis: 'Your experience with modern React development and TypeScript strongly aligns with this role. The emphasis on UI/UX in your portfolio projects particularly matches their focus on creating polished user experiences. Consider highlighting your experience with performance optimization and state management.',
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'Innovation Labs',
        url: 'https://example.com/job2',
        matchScore: 85,
        keySkillMatches: ['React', 'Node.js', 'REST APIs'],
        aiAnalysis: 'While your frontend skills are a perfect match, you might want to emphasize your backend experience more in your application. Your GitHub projects show good understanding of full-stack architecture, but highlighting any experience with microservices would strengthen your application.',
      },
      {
        id: '3',
        title: 'UI/UX Developer',
        company: 'Design Studio',
        url: 'https://example.com/job3',
        matchScore: 75,
        keySkillMatches: ['React', 'CSS', 'UI Design'],
        aiAnalysis: 'Your strong CSS and React skills are relevant, but this role has a heavier focus on design thinking and user research than your current experience shows. Consider showcasing any A/B testing or user feedback implementation experience you have.',
      },
      {
        id: '4',
        title: 'DevOps Engineer',
        company: 'Cloud Systems Inc.',
        url: 'https://example.com/job4',
        matchScore: 45,
        keySkillMatches: ['Git', 'CI/CD'],
        aiAnalysis: 'While you have some relevant experience with Git and deployment workflows, this role requires deep expertise in AWS, Kubernetes, and infrastructure automation that isn\'t evident in your background. Significant additional DevOps experience would be needed to be competitive for this position.',
      },
      {
        id: '5',
        title: 'Machine Learning Engineer',
        company: 'AI Solutions Ltd.',
        url: 'https://example.com/job5',
        matchScore: 35,
        keySkillMatches: ['Python', 'Data Analysis'],
        aiAnalysis: 'This role requires specialized machine learning expertise and experience with ML frameworks that isn\'t present in your background. While you have some Python experience, the core ML engineering skills needed for this position don\'t align with your current skill set.',
      },
      {
        id: '6',
        title: 'Embedded Systems Developer',
        company: 'IoT Devices Corp',
        url: 'https://example.com/job6',
        matchScore: 25,
        keySkillMatches: ['C++'],
        aiAnalysis: 'This position focuses on low-level embedded systems programming and hardware interfaces, which is quite different from your web development background. The required expertise in embedded C++ and real-time operating systems represents a significant skill gap.',
      }
    ],
  };
}