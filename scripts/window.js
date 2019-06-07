var mouseoverVersion = false;
document.getElementById('versionBox').addEventListener('mouseenter', () => mouseoverVersion = true);
document.getElementById('versionBox').addEventListener('mouseleave', () => mouseoverVersion = false);
window.addEventListener('click', () => {if (!mouseoverVersion && !document.getElementById('versionLock').checked) document.getElementById('versionCheck').checked = false})

document.getElementById('close').addEventListener('click', () => remote.getCurrentWindow().close());
document.getElementById('min').addEventListener('click', () => remote.getCurrentWindow().minimize());
document.getElementById('max').addEventListener('click', (e,w = remote.getCurrentWindow()) =>w.isMaximized() ? w.restore() : w.maximize());