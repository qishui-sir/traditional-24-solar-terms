/* ============================================
   二十四节气 - 公共脚本
   所有页面共享：导航球切换
   ============================================ */

function toggleTopLeftNav() {
  const menu = document.getElementById('topLeftNavMenu');
  const hint = menu.parentElement.querySelector('.top-left-nav-hint');
  menu.classList.toggle('show');
  hint.textContent = menu.classList.contains('show') ? '点击收起' : '点击展开';
}
