/*globals Blockly, document, window, console*/
window.addEventListener('load', function () {
    'use strict';

    function imgOption(key, src, alt) {
        return [{src: src, alt: alt, height: 24, width: 24}, key];
    }

    var ACCIDENTALS_TO_STR = {
            NATURAL: '',
            SHARP: '#',
            FLAT: 'b'
        },
        NEXT_NOTE = {
            A: ['B', false],
            B: ['C', true],
            C: ['D', false],
            D: ['E', false],
            E: ['F', false],
            F: ['G', false],
            G: ['A', false],
        },
        PREV_NOTE = {
            A: ['G', false],
            B: ['A', false],
            C: ['B', true],
            D: ['C', false],
            E: ['D', false],
            F: ['E', false],
            G: ['F', false]
        },
        NEXT_ACCIDENTAL = {
            FLAT: ['NATURAL', false],
            NATURAL: ['SHARP', false],
            SHARP: ['FLAT', true]
        },
        PREF_ACCIDENTAL = {
            FLAT: ['SHARP', true],
            NATURAL: ['FLAT', false],
            SHARP: ['NATURAL', false]
        };

    function Chord(notes) {
        this.notes = notes;
    }

    Chord.prototype.toString = function () {
        return this.notes.map(function (note) {
            return note.toString();
        }).join(', ');
    };

    Chord.prototype.next = function () {
        return new Chord(this.notes.map(function (note) {
            return note.next();
        }));
    };

    function Note(level, octave, accidental) {
        this.level = level;
        this.octave = octave;
        this.accidental = accidental;
    }

    Note.prototype.toString = function () {
        return this.level + ACCIDENTALS_TO_STR[this.accidental] + this.octave;
    };

    Note.prototype.next = function () {
        var newAccidentalInfo = NEXT_ACCIDENTAL[this.accidental],
            newAccidental = newAccidentalInfo[0],
            accidentalOverflow = newAccidentalInfo[1],
            newNoteInfo, newNote, newNoteOverflow,
            newOctave;

        if (accidentalOverflow) {
            newAccidental = 'NATURAL';
            newNoteInfo = NEXT_NOTE[this.level];

            newNote = newNoteInfo[0];
            newNoteOverflow = newNoteInfo[1];

            if (newNoteOverflow) {
                newNote = this.level;
                newOctave = this.octave + 1;

                if (newOctave > 8) {
                    newOctave = 1;
                }

            } else {
                newOctave = this.octave;
            }
        } else {
            newNote = this.level;
            newOctave = this.octave;
        }

        if (newNote === 'B' && newAccidental === 'SHARP') {
            newNote = 'C';
            newAccidental = 'NATURAL';
            newOctave = this.octave + 1;

            if (newOctave > 8) {
                newOctave = 1;
            }
        }

        if (newNote === 'E' && newAccidental === 'SHARP') {
            newNote = 'F';
            newAccidental = 'NATURAL';
        }

        console.log(newNote, newOctave, newAccidental);
        return new Note(newNote, newOctave, newAccidental);
    };

    function switchTo(tabId) {
        var tabs = document.querySelectorAll('.tabs td'),
            bodies = document.querySelectorAll('.tab-sections .tab-section'),
            currentTab = document.getElementById(tabId),
            currentBody = document.getElementById(tabId + '-section'),
            i, len, tab, body;

        for (i = 0, len = tabs.length; i < len; i += 1) {
            tab = tabs[i];
            tab.className = '';
        }

        for (i = 0, len = bodies.length; i < len; i += 1) {
            body = bodies[i];
            body.className = 'tab-section';
        }

        currentTab.className = 'active';
        currentBody.className = 'tab-section active';
    }

    function initBlocks() {
        Blockly.Blocks.note = {
            init: function() {
                this.appendDummyInput()
                    .appendField("note")
                    .appendField(new Blockly.FieldDropdown([
                        ["A","A"],
                        ["B","B"],
                        ["C","C"],
                        ["D","D"],
                        ["E","E"],
                        ["F","F"],
                        ["G","G"]]), "NOTE")
                    .appendField(new Blockly.FieldDropdown([
                        ["1","1"],
                        ["2","2"],
                        ["3","3"],
                        ["4","4"],
                        ["5","5"],
                        ["6","6"],
                        ["7","7"]]), "OCTAVE")
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

		Blockly.JavaScript.note = function(block) {
			var note = block.getFieldValue('NOTE'),
				mod = block.getFieldValue('MOD'),
				octave = block.getFieldValue('OCTAVE'),
                code = 'new Note("' + note + '", ' + octave + ', "' + mod + '")';
			return [code, Blockly.JavaScript.ORDER_NEW];
		};

        Blockly.Blocks.play = {
            init: function() {
                this.appendValueInput("NOTE")
                    .setCheck(["Note", "Chord"])
                    .appendField("play")
                    .appendField(new Blockly.FieldDropdown([
                        imgOption('WHOLE', 'img/notes/whole.png', 'Whole'),
                        imgOption('HALF', 'img/notes/half.png', 'Half'),
                        imgOption('QUARTER', 'img/notes/quarter.png', 'Quarter'),
                        imgOption('EIGHTH', 'img/notes/eighth.png', 'Eight')
                    ]), "RHYTHM");

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.JavaScript.play = function(block) {
            var rhythm = block.getFieldValue('RHYTHM'),
                rhythmName = rhythm.toLowerCase(),
                note = Blockly.JavaScript.valueToCode(block, 'NOTE',
                    Blockly.JavaScript.ORDER_ATOMIC);
            var code = 'inst.note("' + rhythmName + '", ' + note + '.toString());\n';
            return code;
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

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.JavaScript.rest = function(block) {
            var rhythm = block.getFieldValue('RHYTHM'),
                rhythmName = rhythm.toLowerCase();
            var code = 'inst.rest("' + rhythmName + '");\n';
            return code;
        };

        Blockly.Blocks.nextSound = {
            init: function() {
                this.appendValueInput("SOUND")
                    .setCheck(["Note", "Chord"])
                    .appendField("next");

                this.setOutput(true, "Note");
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.JavaScript.nextSound = function(block) {
            var note = Blockly.JavaScript.valueToCode(block, 'SOUND',
                            Blockly.JavaScript.ORDER_ATOMIC),
                code = note + '.next()';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };

        Blockly.Blocks.chord = {
            init: function() {
                this.appendValueInput("NOTES")
                    .setCheck("Array")
                    .appendField("chord");

                this.setOutput(true, "Chord");
                this.setColour(230);
                this.setTooltip('');
                this.setHelpUrl('');
            }
        };

        Blockly.JavaScript.chord = function(block) {
            var notes = Blockly.JavaScript.valueToCode(block, 'NOTES',
                            Blockly.JavaScript.ORDER_ATOMIC),
                code = 'new Chord(' + notes + ')';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };

    }

    function getInstrument() {
        var select = document.getElementById('instrument'),
            instrumentId = select.value,
            group;

        switch (instrumentId) {
            case "sine":
            case "square":
            case "sawtooth":
            case "triangle":
                group = 'oscillators';
                break;
            default:
                group = 'noises';
        }

        return {id: instrumentId, group: group};
    }

    function setCode(code) {
        document.getElementById('code').innerHTML = code;
    }

    function getCode(workspace) {
        var instrument = getInstrument(),
            userCode = Blockly.JavaScript.workspaceToCode(workspace),
            prefixCode = 'var composer = new BandJS();\ncomposer.setTimeSignature(2, 2);\ncomposer.setTempo(180);\nvar inst = composer.createInstrument("' + instrument.id + '", "' + instrument.group + '");\n\n',
            suffixCode = '\nvar player = composer.finish();\nplayer.play();\n',
            code = prefixCode + userCode + suffixCode;

        return code;
    }

    function showCode(workspace) {
        var code = getCode(workspace);
        setCode(code);
        switchTo('tab-code');
    }

    function play(workspace) {
        var code = getCode(workspace);
        setCode(code);
        eval(code);
    }

    function save(workspace, name) {
        var xml = Blockly.Xml.workspaceToDom(workspace),
            xmlText = Blockly.Xml.domToText(xml),
            store;

        if (window.localStorage.bandBlocksXml) {
            store = JSON.parse(window.localStorage.bandBlocksXml);
        } else {
            store = {};
        }

        store[name] = xmlText;
        window.localStorage.bandBlocksXml = JSON.stringify(store);
    }

    function load(xmlText, workspace) {
        var xml = Blockly.Xml.textToDom(xmlText);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
    }

    function restore(workspace, name) {
        var store = JSON.parse(window.localStorage.bandBlocksXml || '{}'),
            xmlText = store[name],
            xml;

        if (xmlText) {
            load(xmlText, workspace);
        }
    }

    function newOption(value, label) {
        var node = document.createElement('option');

        node.value = value;
        node.innerHTML = label;

        return node;
    }

    function initSamples(workspace) {
        var samples = document.getElementById('samples'),
            loadBtn = document.getElementById('loadSample'),
            options = window.bandBlocksSamples.options,
            i, len, option;

        for (i = 0, len = options.length; i < len; i += 1) {
            option = options[i];
            samples.appendChild(newOption(option[0], option[1]));
        }

        loadBtn.addEventListener('click', function (evt) {
            var sampleId = samples.value,
                sampleXML = window.bandBlocksSamples.samples[sampleId];
            load(sampleXML, workspace);
        });
    }

    function init() {
        var blockCont = document.getElementById('blockCont'),
            playBtn = document.getElementById('play'),
            saveBtn = document.getElementById('save'),
            restoreBtn = document.getElementById('restore'),
            clearBtn = document.getElementById('clear'),
            showCodeBtn = document.getElementById('showCode'),
			workspace;

		blockCont.style.height = '' + window.innerHeight * 0.85 + 'px';

		workspace = Blockly.inject('blockCont',
			{toolbox: document.getElementById('toolbox')});

        playBtn.addEventListener('click', function () {
            play(workspace);
        });

        saveBtn.addEventListener('click', function () {
            var name = window.prompt('Name', 'default');
            save(workspace, name);
        });

        restoreBtn.addEventListener('click', function () {
            var name = window.prompt('Name', 'default');
            restore(workspace, name);
        });

        showCodeBtn.addEventListener('click', function () {
            showCode(workspace);
        });

        clearBtn.addEventListener('click', function () {
            var yes = window.confirm('Sure?');

            if (yes) {
                workspace.clear();
            }
        });

        restore(workspace, 'default');

        initSamples(workspace);
        window.ws = workspace;
    }

    initBlocks();
    init();

    window.switchTo = switchTo;
    window.Note = Note;
    window.Chord = Chord;
});
