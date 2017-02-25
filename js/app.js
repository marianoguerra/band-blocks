/*globals Blockly, document, window*/
window.addEventListener('load', function () {
    'use strict';

    function imgOption(key, src, alt) {
        return [{src: src, alt: alt, height: 24, width: 24}, key];
    }

    function initBlocks() {
        Blockly.Blocks.sound = {
            init: function() {
                this.appendDummyInput()
                    .appendField("sound")
                    .appendField(new Blockly.FieldDropdown([
                        imgOption('WHOLE', 'img/notes/whole.png', 'Whole'),
                        imgOption('HALF', 'img/notes/half.png', 'Half'),
                        imgOption('QUARTER', 'img/notes/quarter.png', 'Quarter'),
                        imgOption('EIGHTH', 'img/notes/eighth.png', 'Eight')
                    ]), "RHYTHM")
                    .appendField(new Blockly.FieldDropdown([
                        ["A","A"],
                        ["B","B"],
                        ["C","C"],
                        ["D","D"],
                        ["E","E"],
                        ["F","F"],
                        ["G","G"]]), "NOTE")
                    .appendField(new Blockly.FieldDropdown([
                        ["Natural","NATURAL"],
                        ["Sharp","SHARP"],
                        ["Flat","FLAT"]]),
                    "MOD");
                this.setOutput(true, "Note");
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.Blocks.rest = {
            init: function() {
                this.appendDummyInput()
                    .appendField("rest")
                    .appendField(new Blockly.FieldDropdown([
                        imgOption('WHOLE', 'img/notes/whole.png', 'Whole'),
                        imgOption('HALF', 'img/notes/half.png', 'Half'),
                        imgOption('QUARTER', 'img/notes/quarter.png', 'Quarter'),
                        imgOption('EIGHTH', 'img/notes/eighth.png', 'Eight')
                    ]), "RHYTHM");
                this.setOutput(true, "Note");
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.Blocks.play = {
            init: function() {
                this.appendValueInput("NOTE")
                    .setCheck("Note")
                    .appendField("play");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };
    }

    function init() {
        var blockCont = document.getElementById('blockCont'),
			workspace;

		blockCont.style.height = '' + window.innerHeight + 'px';

		workspace = Blockly.inject('blockCont',
			{toolbox: document.getElementById('toolbox')});
    }

    initBlocks();
    init();
});
