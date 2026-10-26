/**
 * Custom Tags for Hexo
 * 1. {% tip "提示文字" 目标词汇 %} or {% tip "提示文字", "目标词汇" %}
 * 2. {% heimu 吐槽或剧透内容 %} or {% heimu "吐槽或剧透内容" %}
 * 3. 块级标签支持：
 *    {% tipblock "提示文字" %}目标词汇{% endtipblock %}
 *    {% heimublock %}吐槽或剧透内容{% endheimublock %}
 */

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 悬浮/轻触提示条（行内标签）
hexo.extend.tag.register('tip', function(args) {
  let tip = '';
  let text = '';
  if (args.length >= 2) {
    tip = args[0].replace(/,$/, '').trim();
    text = args.slice(1).join(' ').replace(/^,/, '').trim();
  } else if (args.length === 1) {
    const raw = args[0];
    const parts = raw.split(/[,，|]/);
    if (parts.length >= 2) {
      tip = parts[0].trim();
      text = parts.slice(1).join('').trim();
    } else {
      tip = raw;
      text = raw;
    }
  }
  return `<span class="hover-tip" tabindex="0" data-tip="${escapeHtml(tip)}">${text}</span>`;
});

// 悬浮/轻触提示条（块级标签）
hexo.extend.tag.register('tipblock', function(args, content) {
  const tip = (args[0] || '').replace(/,$/, '').trim();
  return `<span class="hover-tip" tabindex="0" data-tip="${escapeHtml(tip)}">${content.trim()}</span>`;
}, { ends: true });

// 黑幕/防剧透遮罩（行内标签）
hexo.extend.tag.register('heimu', function(args) {
  let text = args.join(' ').trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    text = text.slice(1, -1);
  }
  return `<span class="heimu" tabindex="0">${text}</span>`;
});

// 黑幕/防剧透遮罩（块级标签）
hexo.extend.tag.register('heimublock', function(args, content) {
  return `<span class="heimu" tabindex="0">${content.trim()}</span>`;
}, { ends: true });
