var bible = Array();
var abbrList = Array();
var availBooks = Array();
var selectedBooks = Array();

var defaultState = {
    'abbr':[],
    'selected':[],
    'book':1,'chapter':1,'verse':1,'verseEnd':1,
};

var state = util.load('bible',JSON.parse(JSON.stringify(defaultState)));

try {
    state.abbr.intersection([]);
    state.selected.intersection([]);
    state.book = parseInt(state.book);
    state.chapter = parseInt(state.chapter);
    state.verse = parseInt(state.verse);
    state.verseEnd = parseInt(state.verseEnd);
} catch(err) {
    state = JSON.parse(JSON.stringify(defaultState));
}

ipcRenderer.on('sendBible',function (e,data) {

    // Verify state.
    bible = data;
    for (var i=0; i<bible.length; i++) {
        abbrList.push(bible[i]['abbr']);
        var book = Array();
        for (var j in bible[i]['book']) {
            book.push(j);
        };
        availBooks.push(book);
    };
    state.abbr = (state.abbr.intersection(abbrList)).union(abbrList);
    state.selected = state.selected.intersection(abbrList);
    if (state.selected.length < 1) state.selected.push(abbrList[0]);
    selectedBooks = commonBooks();
    while (!(selectedBooks.length) && selectedBookList.length) {
        selectedBookList.pop();
        state.selected.pop();
        selectedBooks = intersection(selectedBookList);
    };
    if (!selectedBooks.includes(String(state.book))) {
        state.book = selectedBooks.min();
        state.chapter = 1;
        state.verse = 0;
        state.verseEnd = 0;
    } else if (!(state.chapter <= bookChapters[state.book])) {
        state.chapter = 1;
        state.verse = 0;
        state.verseEnd = 0;
    } else {
        var maxVerse = 0;
        for (var i=0; i<state.selected.length; i++) {
            for (var v in getChapter(state.selected[i],state.book,state.chapter)['verse']) {
                if (parseInt(v) > maxVerse) maxVerse = parseInt(v);
            };
        };
        if (!glte('<=',1,state.verse, state.verseEnd, maxVerse)) {
            state.verse = 0;
            state.verseEnd = 0;
        };
    };
    
    // Build interface.
    var bookId = radio('book',bookChapters.length - 1);
    var chapterId = radio('chapter',bookChapters.max(),true);
    for (var i=0; i<state.abbr.length; i++) {
        addVersion(state.abbr[i]);
        document.getElementById(state.abbr[i]).addEventListener('change', function (e) {
            var versions = document.getElementById('versionList').childNodes;
            state.selected = Array();
            for (var i=0; i < versions.length; i++) {
                v = versions[i].firstChild;
                if (v.checked) state.selected.push(v.id);
            };
            if (state.selected.length == 1) {
                document.getElementById(state.selected[0]).disabled = true;
                document.getElementById('versionName').innerHTML = bible[abbrList.indexOf(state.selected[0])]['name'];
            } else {
                for (var i=0; i<state.selected.length; i++) {
                    document.getElementById(state.selected[i]).disabled = false;
                };
                document.getElementById('versionName').innerHTML = 'Compare';
            };
            selectedBooks = commonBooks();
            for (var id in bookId) {
                var container = document.getElementById('c-'.concat(id));
                var label = container.lastElementChild;
                var book = document.getElementById(id).getAttribute('number');
                if (selectedBooks.includes(String(book))) {
                    container.style.display = 'block';
                    label.innerHTML = bible[abbrList.indexOf(state.selected[0])]['book'][book]['name'];
                    container.className = 'container lang-'.concat(bible[abbrList.indexOf(state.selected[0])]['lang']);
                } else {
                    container.style.display = 'none';
                };
            };
            styleText();
            util.save('bible',state);
        });
    };
    for (var id in bookId) {
        document.getElementById(id).addEventListener('change', function (e) {
            state.book = e.target.getAttribute('number');
            validateVersions();
            for (var i = 1; i <= bookChapters.max(); i++) {
                var container = document.getElementById('c-chapter-'.concat(i));
                var input = document.getElementById('chapter-'.concat(i));
                if (i <= bookChapters[state.book]) {
                    container.style.display = 'block';
                }   else {
                    container.style.display = 'none';
                }
                if (i == 1)  {
                    input.checked = false;
                    input.click();
                };
            };
        });
    };
    for (var id in chapterId) {
        document.getElementById(id).addEventListener('change', function (e) {
            state.chapter = e.target.getAttribute('number');
            state.verse = 0;
            state.verseEnd = 0;
            displayText();
            util.save('bible',state);
        });
    };

    // Initialize selection.
    var selected = state.selected.filter(e => true);
    for (var i=0; i<selected.length; i++) {
        var version = document.getElementById(selected[i]);
        version.checked = false;
        version.click();
    };
    go();
    ipcRenderer.send('closeLogo');
});

