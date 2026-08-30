const fs = require('fs');
const file = 'src/app/nano-pro/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement was messed up because of multiple instances
content = content.split('activeTab === "fb-post" || activeTab === "shayari-post"').join('activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"');

// Fix the case where it was done three times
content = content.split('activeTab === "kids-post" || activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"').join('activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"');
content = content.split('activeTab === "kids-post" || activeTab === "kids-post" || activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"').join('activeTab === "kids-post" || activeTab === "fb-post" || activeTab === "shayari-post"');

fs.writeFileSync(file, content);
console.log('Fixed globally');
