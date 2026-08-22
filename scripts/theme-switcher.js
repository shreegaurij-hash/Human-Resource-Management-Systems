const fs = require('fs');
const path = require('path');

const directories = ['src/components/Admin', 'src/components/Attendance', 'src/components/Payroll', 'src/features'];

const replaceMap = {
  'bg-black': 'bg-[#F8F9FA]',
  'text-white': 'text-black', 
  'bg-zinc-900': 'bg-white shadow-xl',
  'bg-zinc-800': 'bg-gray-50',
  'text-zinc-400': 'text-gray-500',
  'text-gray-400': 'text-gray-500',
  'border-zinc-800': 'border-gray-200',
  'border-zinc-700': 'border-gray-200',
  'bg-zinc-800/50': 'bg-gray-50/50',
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = walk(dir);
    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      
      Object.keys(replaceMap).forEach(key => {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, replaceMap[key]);
      });

      fs.writeFileSync(file, content);
      console.log('Updated theme in', file);
    });
  }
});
