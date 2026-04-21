// src/markdownRenderer.js
export function renderMarkdownToHtml(markdown, pageInfo, currentPath) {
  let html = markdown;
  
  // 見出し
  html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // 強調
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // リンク
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // リスト
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // 空の<p>を削除
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // テーマカラー
  const colors = {
    purple: { primary: '#667eea', secondary: '#764ba2' },
    red: { primary: '#f093fb', secondary: '#f5576c' },
    blue: { primary: '#4facfe', secondary: '#00f2fe' }
  };
  const theme = colors[pageInfo.theme] || colors.purple;
  
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageInfo.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.8;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      padding: 2rem 1rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .content { padding: 2.5rem; }
    .content h1 { color: ${theme.primary}; border-bottom: 2px solid ${theme.primary}; padding-bottom: 0.5rem; }
    .content h2 { color: ${theme.secondary}; margin-top: 1.5rem; }
    .content p { margin-bottom: 1rem; color: #2d3748; }
    .content ul { margin: 1rem 0; padding-left: 2rem; }
    .content li { margin-bottom: 0.5rem; }
    .content a { color: ${theme.primary}; text-decoration: none; border-bottom: 1px solid transparent; }
    .content a:hover { border-bottom-color: ${theme.primary}; }
    .footer {
      background: #f8f9fa;
      padding: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
    .nav-links {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .nav-links a { color: ${theme.primary}; text-decoration: none; }
    @media (max-width: 600px) {
      .content { padding: 1.5rem; }
      .header h1 { font-size: 1.4rem; }
      .nav-links { gap: 1rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${pageInfo.title.split('|')[0].trim()}</h1>
      <div class="date">最終更新日: ${new Date().toLocaleDateString('ja-JP')}</div>
    </div>
    <div class="content">
      ${html}
    </div>
    <div class="footer">
      <div class="nav-links">
        <a href="/">📋 利用規約</a>
        <a href="/disclaimer">⚠️ 免責事項</a>
        <a href="/privacy">🔒 プライバシーポリシー</a>
      </div>
      <p>© ${new Date().getFullYear()} 箱庭スタジオ</p>
      <p>連絡: legal@hknw.link | 通報: abuse@hknw.link</p>
    </div>
  </div>
</body>
</html>`;
}