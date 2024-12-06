import React from 'react';

interface JobSkillsProps {
  skills: string[];
}

export function JobSkills({ skills }: JobSkillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}