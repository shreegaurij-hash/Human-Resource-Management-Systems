const fs = require('fs');
const path = './src/components/Admin/CandidateScreener.tsx';
let content = fs.readFileSync(path, 'utf8');
content = '"use client";\nimport ReactMarkdown from "react-markdown";\n' + content.replace(/"use client";/g, '').replace(/import ReactMarkdown from "react-markdown";/g, '');
fs.writeFileSync(path, content, 'utf8');
