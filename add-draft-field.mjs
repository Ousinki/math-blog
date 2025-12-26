import fs from 'fs';
import path from 'path';

const postsDir = 'src/content/post';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

let updated = 0;
let skipped = 0;

for (const file of files) {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否已有draft字段
    if (content.match(/^draft:\s*(true|false)/m)) {
        console.log(`⏭️  ${file} - already has draft field`);
        skipped++;
        continue;
    }
    
    // 在frontmatter中添加draft: false
    const lines = content.split('\n');
    const frontmatterEnd = lines.findIndex((line, idx) => idx > 0 && line === '---');
    
    if (frontmatterEnd > 0) {
        lines.splice(frontmatterEnd, 0, 'draft: false');
        content = lines.join('\n');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`✅ ${file} - added draft: false`);
        updated++;
    } else {
        console.log(`❌ ${file} - no frontmatter found`);
    }
}

console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
