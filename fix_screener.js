const fs = require('fs');
const path = './src/components/Admin/CandidateScreener.tsx';
let content = fs.readFileSync(path, 'utf8');

const fix = content.replace(
  /\)\s*:\s*\(\s*return\s*<li[\s\S]*?<\/div>/,
  `) : (
              <div className="prose prose-sm max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-strong:font-semibold prose-strong:text-gray-900 prose-p:leading-relaxed prose-a:text-blue-600">
                <ReactMarkdown>{evaluation}</ReactMarkdown>
              </div>`
);
fs.writeFileSync(path, fix, 'utf8');
