import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SECTION_HEADING = '## Cross-Project Contributors';

export function updateReadmeSection(repoPath: string, count: number): void {
  const readmePath = join(repoPath, 'README.md');
  const newSection = `${SECTION_HEADING}\n${count}`;
  const sectionRegex = new RegExp(
    `## Cross-Project Contributors\\n.*?(?=\\n## |\\n?$)`,
    's'
  );

  let content = '';

  if (existsSync(readmePath)) {
    content = readFileSync(readmePath, 'utf-8');
    if (content.includes(SECTION_HEADING)) {
      content = content.replace(sectionRegex, newSection);
    } else {
      content = `${content.trim()}\n\n${newSection}`;
    }
  } else {
    content = newSection;
  }

  writeFileSync(readmePath, content, 'utf-8');
}
