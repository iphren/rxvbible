function intersection (a) {
    return a[0].filter(e => (a.map(x => x.includes(e))).every(y => y));
};

function addVersion (abbr='CUVMPS',position=-1) {
    name = abbrList.includes(abbr) ? bible[abbrList.indexOf(abbr)]['name'] : '';
    copy = abbrList.includes(abbr) ? bible[abbrList.indexOf(abbr)]['copyright'] : '';
    var box = document.createElement('div');
    box.className = 'versionBox';
    box.setAttribute('draggable','true');

    var check = document.createElement('input');
    check.setAttribute('type','checkbox');
    check.id = abbr;
    check.className = 'versionCheck';

    var button = document.createElement('label');
    var label = document.createElement('div');
    var tag = document.createElement('span');
    button.setAttribute('for',abbr);
    button.className = 'versionButton';
    label.className = 'versionLabel';
    tag.className = 'versionName';
    tag.innerHTML = name;

    var icon = document.createElement('div');
    var after = document.createElement('span');
    icon.className = 'versionIcon';
    after.className = 'versionAfter'

    label.appendChild(tag);
    button.appendChild(label);
    icon.appendChild(after);

    box.appendChild(check);
    box.appendChild(icon);
    box.appendChild(button);

    var list = document.getElementById('versionList');
    versions = list.childNodes;
    if (!glte('<',-1,position,versions.length)) {
        list.appendChild(box);
    } else {
        list.insertBefore(box,versions[position]);
    };

    box.addEventListener('dragstart', dragstart);
    box.addEventListener('dragenter', dragover);
    box.addEventListener('dragover', dragover);
    box.addEventListener('drop', drop);
    
};

function radio (name='item',range=0,labeled=false) {

    var json = {};

    for (var i=1; i <= range; i++) {
        id = name.concat('-',String(i));
        json[id] = i;
        var label = document.createElement('label');
        label.className = 'container';
        label.setAttribute('id','c-'.concat(id));
        label.innerHTML = 'label';
    
        var input = document.createElement('input');
        input.setAttribute('type','radio');
        input.setAttribute('id',id);
        input.setAttribute('name',name);
        input.setAttribute('number',i);
    
        var span = document.createElement("span");
        span.className = 'checkmark';
        if (labeled) span.innerHTML = i;
    
        label.appendChild(input);
        label.appendChild(span);
        document.getElementById(name.concat('List')).appendChild(label);
    }

    return json;

};

function validateVersions () {
    for (var i=0; i<abbrList.length; i++) {
        document.getElementById(abbrList[i]).disabled = !(availBooks[i].includes(String(state.book)));
    };
    document.getElementById(state.selected[0]).disabled = (state.selected.length == 1);
};

function getChapter (abbr='CUVMPS',book=1,chapter=1) {
    return bible[abbrList.indexOf(abbr)]['book'][book]['chapter'][chapter];
};

function glte () {
    arg = Array();
    for (var i=1; i<arguments.length; i++) {
        if (arguments[0].match('<')) {
            arg.push(arguments[i]);
        } else {
            arg.unshift(arguments[i]);
        }
    };
    if (arg.length < 2) return false;
    pass = true;
    switch (arguments[0]) {
        case '<=':
        case '>=':
            for (var i=0; i<arg.length-1; i++) {
                pass = pass && (arg[i] <= arg[i+1]);
            }
            return pass;
        case '<':
        case '>':
            for (var i=0; i<arg.length-1; i++) {
                pass = pass && (arg[i] < arg[i+1]);
            }
            return pass;
        case '==':
            for (var i=0; i<arg.length-1; i++) {
                pass = pass && (arg[i] == arg[i+1]);
            }
            return pass;
        default:
            return false;
    };
};

function commonBooks () {
    var selectedBookList = Array();
    for (var i=0; i<state.selected.length; i++) {
        var ind = abbrList.indexOf(state.selected[i]);
        selectedBookList.push(availBooks[ind]);
    }
    return intersection(selectedBookList);
};

function go () {
    var verse = parseInt(String(state.verse)), verseEnd = parseInt(String(state.verseEnd));
    var book = document.getElementById('book-'.concat(state.book));
    var chapter = document.getElementById('chapter-'.concat(state.chapter));
    book.checked = false;
    book.click();
    book.scrollIntoView();
    chapter.checked = false;
    chapter.click();
    chapter.scrollIntoView();
    state.verse = verse;
    state.verseEnd = verseEnd;
    displayText();
};