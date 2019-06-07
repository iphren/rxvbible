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
const util = require('./scripts/utils.js');
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