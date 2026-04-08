const fs = require('fs');
const path = 'c:/Users/Hp/OneDrive/Desktop/PROJECTS/Vibe coding/Flexora/Client/src/components/Userhome.jsx';
let content = fs.readFileSync(path, 'utf8');

// Flexible replacement for 'Post Your First Job' Link
content = content.replace(/<Link to="\/post-job"[\s\S]*?>Post Your First Job<\/Link>/, 
  `<SlideButton to="/post-job" className="!px-8 !py-4">
                              Post Your First Job
                           </SlideButton>`);

// Flexible replacement for 'Browse Jobs' Link
content = content.replace(/<Link to="\/jobs"[\s\S]*?>Browse Jobs<\/Link>/, 
  `<SlideButton to="/jobs" className="!px-8 !py-4">
                           Browse Jobs
                        </SlideButton>`);

fs.writeFileSync(path, content);
console.log('Replacements completed successfully');
