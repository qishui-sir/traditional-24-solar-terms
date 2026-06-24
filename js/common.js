/* ============================================
   二十四节气 - 公共脚本
   所有页面共享：导航球切换、背景音乐控制
   ============================================ */

function toggleTopLeftNav() {
  const menu = document.getElementById('topLeftNavMenu');
  const hint = menu.parentElement.querySelector('.top-left-nav-hint');
  menu.classList.toggle('show');
  hint.textContent = menu.classList.contains('show') ? '点击收起' : '点击展开';
}

/* ========== 背景音乐控制（跨页面连续播放） ========== */
(function initMusicPlayer() {
  var STORAGE_KEY = 'solarTerms_musicEnabled';
  var TIME_KEY = 'solarTerms_musicTime';
  var PLAYING_KEY = 'solarTerms_musicPlaying';

  function setup() {
    var audio = document.getElementById('bgmAudio');
    var btn = document.getElementById('musicToggleBtn');
    var tooltip = document.getElementById('musicTooltip');
    if (!audio || !btn) return;

    var isPlaying = false;
    var saved = localStorage.getItem(STORAGE_KEY);
    var musicEnabled = saved !== null ? saved === 'true' : true;

    // 恢复播放进度
    var savedTime = parseFloat(sessionStorage.getItem(TIME_KEY)) || 0;
    var wasPlaying = sessionStorage.getItem(PLAYING_KEY) === 'true';

    function updateUI() {
      if (musicEnabled) {
        btn.classList.add('playing');
        btn.classList.remove('paused');
        if (tooltip) tooltip.textContent = '暂停音乐';
      } else {
        btn.classList.add('paused');
        btn.classList.remove('playing');
        if (tooltip) tooltip.textContent = '播放音乐';
      }
    }

    function play() {
      audio.play().then(function() {
        isPlaying = true;
        musicEnabled = true;
        localStorage.setItem(STORAGE_KEY, 'true');
        updateUI();
      }).catch(function() {
        musicEnabled = true;
        localStorage.setItem(STORAGE_KEY, 'true');
        updateUI();
      });
    }

    function pause() {
      audio.pause();
      isPlaying = false;
      musicEnabled = false;
      localStorage.setItem(STORAGE_KEY, 'false');
      updateUI();
    }

    // 按钮点击
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (tooltip) {
        btn.classList.add('show-tooltip');
        clearTimeout(btn._tooltipTimer);
        btn._tooltipTimer = setTimeout(function() {
          btn.classList.remove('show-tooltip');
        }, 1800);
      }
      if (isPlaying) { pause(); } else { play(); }
    });

    // 音频就绪后恢复进度
    audio.addEventListener('loadedmetadata', function() {
      if (wasPlaying && savedTime > 0) {
        audio.currentTime = savedTime;
      }
    });

    // 持续记录进度（每 2 秒）
    setInterval(function() {
      if (isPlaying && !audio.paused) {
        sessionStorage.setItem(TIME_KEY, audio.currentTime);
      }
    }, 2000);

    updateUI();

    if (musicEnabled || wasPlaying) {
      audio.play().then(function() {
        isPlaying = true;
        musicEnabled = true;
        localStorage.setItem(STORAGE_KEY, 'true');
        updateUI();
      }).catch(function() {
        updateUI();
      });
    }

    // 页面离开前：保存状态和进度
    window.addEventListener('beforeunload', function() {
      sessionStorage.setItem(TIME_KEY, audio.currentTime);
      sessionStorage.setItem(PLAYING_KEY, isPlaying);
      audio.pause();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
