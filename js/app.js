/*globals Blockly, document, window*/
window.addEventListener('load', function () {
    'use strict';

    function init() {
        var blockCont = document.getElementById('blockCont'),
			workspace;

		blockCont.style.height = '' + window.innerHeight + 'px';

		workspace = Blockly.inject('blockCont',
			{toolbox: document.getElementById('toolbox')});
    }

    init();
});
