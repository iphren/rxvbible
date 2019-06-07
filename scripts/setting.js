var setting = util.load('setting',{});

var lock = document.getElementById('versionLock');
if (setting.hasOwnProperty('versionLock')) lock.checked = setting.versionLock;
lock.addEventListener('change', e => {
    setting['versionLock'] = e.target.checked;
    util.save('setting',setting);
})