// 这是一个 Hexo 注入脚本
// 它的作用是：在每个页面的 </body> 标签之前，自动插入 Mermaid 的 JS 代码

hexo.extend.injector.register('body_end', `
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'default'
    });
  </script>
`);