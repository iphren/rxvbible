Array.prototype.intersection = function() {
    return this.filter(e => {
    	intersect = true;
    	for (var i=0; i < arguments.length; i++) {
        	intersect = intersect && arguments[i].includes(e);
        };
        return intersect;
    });
};

Array.prototype.union = function() {
	u = this.concat(arguments[0]);
	for (var i=1; i < arguments.length; i++) {
    	u = u.concat(arguments[1]);
    }
    return u.filter(function(e,i) {return u.indexOf(e) == i});
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
  
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

const ipcRenderer = require('electron').ipcRenderer;
const util = require('./utils.js');
const remote = require('electron').remote;
const bookChapters = [0,
    50, 40, 27, 36, 34, // Five Books of Moses
    24, 21, 4, 31, 24, 22, 25, 29, 36, 10, 13, 10, // Historical Books
    42, 150, 31, 12, 8, // Wisdom Books
    66, 52, 5, 48, 12, // Major Prophets
    14, 3, 9, 1, 4, 7, 3, 3, 3, 2, 14, 4, // Twelve Minor Prophets
    28, 16, 24, 21, // Gospels
    28, // Acts of the Apostles
    16, 16, 13, 6, 6, 4, 4, 5, 3, 6, 4, 3, 1, 13, 5, 5, 3, 5, 1, 1, 1, // Epistles
    22 // Book of Revelation
];

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