#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const postsDir = 'src/content/post';
const resourcesDir = 'public/posts';

console.log('🔍 Scanning for unused resources...\n');

// 获取所有文章内容
function getAllArticleContents() {
    const contents = new Map(); // slug -> content
    
    if (!fs.existsSync(postsDir)) return contents;
    
    const files = fs.readdirSync(postsDir);
    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
            const slug = file.replace(/\.(md|mdx)$/, '');
            const content = fs.readFileSync(filePath, 'utf-8');
            contents.set(slug, content);
        }
    }
    
    return contents;
}

// 检查资源是否被引用
function isResourceReferenced(resourcePath, allContents) {
    // resourcePath like: "article-slug/image.jpg"
    const parts = resourcePath.split(path.sep);
    if (parts.length < 2) return false;
    
    const [articleSlug, fileName] = parts;
    
    // 检查对应的文章内容
    const content = allContents.get(articleSlug);
    if (!content) return false;
    
    // 检查是否被引用
    // 匹配 ![...](/posts/article-slug/filename) 或 <Video src="/posts/article-slug/filename" />
    const patterns = [
        new RegExp(`!\\[[^\\]]*\\]\\(/posts/${articleSlug}/${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        new RegExp(`<Video\\s+src="/posts/${articleSlug}/${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        new RegExp(`<source\\s+src="/posts/${articleSlug}/${fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
    ];
    
    return patterns.some(pattern => content.match(pattern));
}

// 扫描所有资源
function scanResources() {
    if (!fs.existsSync(resourcesDir)) {
        console.log('❌ Resources directory not found');
        return;
    }
    
    const allContents = getAllArticleContents();
    const unusedResources = [];
    
    const articleDirs = fs.readdirSync(resourcesDir);
    
    for (const articleSlug of articleDirs) {
        const articleDir = path.join(resourcesDir, articleSlug);
        const stat = fs.statSync(articleDir);
        
        if (!stat.isDirectory()) continue;
        
        // 检查文章是否存在
        if (!allContents.has(articleSlug)) {
            unusedResources.push({
                type: 'orphaned-folder',
                path: articleSlug,
                fullPath: articleDir,
                size: getDirectorySize(articleDir)
            });
            continue;
        }
        
        // 检查文件夹中的每个文件
        const files = fs.readdirSync(articleDir);
        for (const file of files) {
            const filePath = path.join(articleDir, file);
            const fileStat = fs.statSync(filePath);
            
            if (fileStat.isFile()) {
                const resourcePath = `${articleSlug}/${file}`;
                if (!isResourceReferenced(resourcePath, allContents)) {
                    unusedResources.push({
                        type: 'unused-file',
                        path: resourcePath,
                        fullPath: filePath,
                        size: fileStat.size
                    });
                }
            }
        }
    }
    
    return unusedResources;
}

// 获取目录大小
function getDirectorySize(dirPath) {
    let size = 0;
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            size += getDirectorySize(filePath);
        } else {
            size += stat.size;
        }
    }
    
    return size;
}

// 格式化文件大小
function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// 主函数
const unused = scanResources();

if (!unused || unused.length === 0) {
    console.log('✨ No unused resources found! Everything is clean.\n');
    process.exit(0);
}

// 分类显示
const orphanedFolders = unused.filter(r => r.type === 'orphaned-folder');
const unusedFiles = unused.filter(r => r.type === 'unused-file');

if (orphanedFolders.length > 0) {
    console.log('📁 Orphaned Folders (article deleted):');
    orphanedFolders.forEach(item => {
        console.log(`  ❌ ${item.path}/ (${formatSize(item.size)})`);
    });
    console.log('');
}

if (unusedFiles.length > 0) {
    console.log('📄 Unused Files (not referenced in articles):');
    unusedFiles.forEach(item => {
        console.log(`  ⚠️  ${item.path} (${formatSize(item.size)})`);
    });
    console.log('');
}

const totalSize = unused.reduce((sum, item) => sum + item.size, 0);
console.log(`💾 Total unused space: ${formatSize(totalSize)}\n`);

// 询问是否删除
const autoRemove = process.argv.includes('--auto-remove');

if (autoRemove) {
    console.log('🗑️  Removing unused resources...\n');
    
    for (const item of unused) {
        try {
            if (item.type === 'orphaned-folder') {
                fs.rmSync(item.fullPath, { recursive: true, force: true });
                console.log(`  ✅ Deleted folder: ${item.path}/`);
            } else {
                fs.unlinkSync(item.fullPath);
                console.log(`  ✅ Deleted file: ${item.path}`);
            }
        } catch (error) {
            console.error(`  ❌ Failed to delete ${item.path}:`, error.message);
        }
    }
    
    console.log(`\n✨ Cleanup complete! Freed ${formatSize(totalSize)}\n`);
} else {
    console.log('💡 To automatically remove these files, run:');
    console.log('   npm run clean-unused -- --auto-remove\n');
}
