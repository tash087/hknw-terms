// src/index.js
import { renderMarkdownToHtml } from './markdownRenderer.js';

const PAGE_MAPPING = {
  '/': 'terms.md',
  '/terms': 'terms.md',
  '/disclaimer': 'disclaimer.md',
  '/privacy': 'privacy.md'
};

const PAGE_INFO = {
  'terms.md': {
    title: '利用規約 | 箱庭リンク',
    theme: 'purple'
  },
  'disclaimer.md': {
    title: '免責事項 | 箱庭リンク',
    theme: 'red'
  },
  'privacy.md': {
    title: 'プライバシーポリシー | 箱庭リンク',
    theme: 'blue'
  }
};

function getGitHubRawUrl(filename, env) {
  const repo = env.GITHUB_REPO;
  const branch = env.GITHUB_BRANCH;
  return `https://raw.githubusercontent.com/${repo}/${branch}/contents/${filename}`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path === '/robots.txt') {
      return new Response(`User-agent: *\nAllow: /`, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    const markdownFile = PAGE_MAPPING[path];
    if (!markdownFile) {
      return new Response('Not Found', { status: 404 });
    }
    
    try {
      const githubUrl = getGitHubRawUrl(markdownFile, env);
      const response = await fetch(githubUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const markdown = await response.text();
      const info = PAGE_INFO[markdownFile];
      const html = renderMarkdownToHtml(markdown, info, path);
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
      
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};