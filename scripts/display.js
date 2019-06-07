function displayText () {
    var display = document.getElementById('display');
    var text = String();
    var chapter = getChapter(state.selected[0],state.book,state.chapter);
    var lang = 'lang-'.concat(bible[abbrList.indexOf(state.selected[0])]['lang']);
    for (var v in chapter['verse']) {
        var verse = chapter['verse'][v].replace(/\{H:|:H\}|\{F:|:F\}/g,'');
        text += "<span class='" + lang + "'>" + verse + '</span>';
    }
    display.innerHTML = text;
    display.scrollTop = 0;
};

function styleText () {
    var display = document.getElementById('display');
    var text = String();
    var chapter = getChapter(state.selected[0],state.book,state.chapter);
    var lang = 'lang-'.concat(bible[abbrList.indexOf(state.selected[0])]['lang']);
    for (var v in chapter['verse']) {
        var verse = chapter['verse'][v].replace(/\{H:|:H\}|\{F:|:F\}/g,'');
        text += "<span class='" + lang + "'>" + verse + '</span>';
    }
    display.innerHTML = text;
};