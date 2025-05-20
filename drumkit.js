const s = {
    ctx: null,
    step: -1,
    insts: ['kick', 'snare', 'hihat', 'tom', 'clap'],
    steps: 16,
    tempo: 120,
    playing: false,
    timer: null,
    pat: {},
    sel: null
};
const instDefs = {
    kick: {
    name: 'Kick',
    ctrls: [
        {lbl: 'Waveform', type: 'select', key: 'type', opts: ['sine', 'square', 'triangle', 'sawtooth']},
        {lbl: 'Start Freq', type: 'range', key: 'startF', min: 50, max: 400, step: 1},
        {lbl: 'End Freq', type: 'range', key: 'endF', min: 0.001, max: 150, step: 0.1},
        {lbl: 'Decay (s)', type: 'range', key: 'decay', min: 0.1, max: 1, step: 0.05}
    ],
    defs: {type: 'sine', startF: 150, endF: 0.001, decay: 0.5},
    play: (t, p) => {
        const osc = s.ctx.createOscillator();
        const gain = s.ctx.createGain();
        osc.type = p.type;
        osc.frequency.setValueAtTime(p.startF, t);
        osc.frequency.exponentialRampToValueAtTime(p.endF, t + p.decay);
        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
        osc.connect(gain).connect(s.ctx.destination);
        osc.start(t);
        osc.stop(t + p.decay);
    }
    },
    snare: {
    name: 'Snare',
    ctrls: [
        {lbl: 'Filter Freq', type: 'range', key: 'filterF', min: 200, max: 5000, step: 1},
        {lbl: 'Decay (s)', type: 'range', key: 'decay', min: 0.05, max: 1, step: 0.05},
        {lbl: 'Level', type: 'range', key: 'level', min: 0.1, max: 2, step: 0.1}
    ],
    defs: {filterF: 1000, decay: 0.2, level: 1},
    play: (t, p) => {
        const size = s.ctx.sampleRate * p.decay;
        const buf = s.ctx.createBuffer(1, size, s.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for(let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
        const noise = s.ctx.createBufferSource();
        noise.buffer = buf;
        const filter = s.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = p.filterF;
        const gain = s.ctx.createGain();
        gain.gain.setValueAtTime(p.level, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
        noise.connect(filter).connect(gain).connect(s.ctx.destination);
        noise.start(t);
        noise.stop(t + p.decay);
    }
    },
    hihat: {
    name: 'Hi-Hat',
    ctrls: [
        {lbl: 'Filter Freq', type: 'range', key: 'filterF', min: 1000, max: 12000, step: 1},
        {lbl: 'Decay (s)', type: 'range', key: 'decay', min: 0.01, max: 0.5, step: 0.01},
        {lbl: 'Level', type: 'range', key: 'level', min: 0.1, max: 1, step: 0.05}
    ],
    defs: {filterF: 7000, decay: 0.05, level: 0.5},
    play: (t, p) => {
        const size = s.ctx.sampleRate * p.decay;
        const buf = s.ctx.createBuffer(1, size, s.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for(let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
        const noise = s.ctx.createBufferSource();
        noise.buffer = buf;
        const filter = s.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = p.filterF;
        const gain = s.ctx.createGain();
        gain.gain.setValueAtTime(p.level, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
        noise.connect(filter).connect(gain).connect(s.ctx.destination);
        noise.start(t);
        noise.stop(t + p.decay);
    }
    },
    tom: {
    name: 'Tom',
    ctrls: [
        {lbl: 'Frequency', type: 'range', key: 'freq', min: 60, max: 300, step: 1},
        {lbl: 'Decay (s)', type: 'range', key: 'decay', min: 0.1, max: 1, step: 0.05},
        {lbl: 'Level', type: 'range', key: 'level', min: 0.1, max: 1, step: 0.05}
    ],
    defs: {freq: 100, decay: 0.3, level: 0.8},
    play: (t, p) => {
        const osc = s.ctx.createOscillator();
        const gain = s.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = p.freq;
        gain.gain.setValueAtTime(p.level, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + p.decay);
        osc.connect(gain).connect(s.ctx.destination);
        osc.start(t);
        osc.stop(t + p.decay);
    }
    },
    clap: {
    name: 'Clap',
    ctrls: [
        {lbl: 'Filter Freq', type: 'range', key: 'filterF', min: 500, max: 5000, step: 1},
        {lbl: 'Decay (s)', type: 'range', key: 'decay', min: 0.05, max: 0.5, step: 0.01},
        {lbl: 'Level', type: 'range', key: 'level', min: 0.1, max: 1, step: 0.05}
    ],
    defs: {filterF: 1500, decay: 0.2, level: 0.8},
    play: (t, p) => {
        for (let i = 0; i < 4; i++) {
        const delay = i * 0.01;
        const size = s.ctx.sampleRate * (p.decay / 4);
        const buf = s.ctx.createBuffer(1, size, s.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for(let j = 0; j < size; j++) data[j] = Math.random() * 2 - 1;
        const noise = s.ctx.createBufferSource();
        noise.buffer = buf;
        const filter = s.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = p.filterF;
        const gain = s.ctx.createGain();
        gain.gain.setValueAtTime(p.level * (i === 0 ? 1 : 0.7), t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + p.decay/2);
        noise.connect(filter).connect(gain).connect(s.ctx.destination);
        noise.start(t + delay);
        noise.stop(t + delay + p.decay/2);
        }
    }
    }
};
const presets = {
    'Rock': {
    kick: [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
    snare: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    hihat: Array(16).fill(1),
    tom: Array(16).fill(0),
    clap: Array(16).fill(0)
    },
    '4-on-the-Floor': {
    kick: Array(16).fill(0).map((_, i) => i % 4 === 0 ? 1 : 0),
    snare: Array(16).fill(0).map((_, i) => i % 8 === 4 ? 1 : 0),
    hihat: Array(16).fill(0).map((_, i) => i % 2 === 0 ? 1 : 0),
    tom: Array(16).fill(0),
    clap: Array(16).fill(0)
    },
    'Funk': {
    kick: [1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0],
    snare: Array(16).fill(0).map((_, i) => i % 4 === 2 ? 1 : 0),
    hihat: [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
    tom: Array(16).fill(0),
    clap: Array(16).fill(0)
    },
    'Trap': {
    kick: [1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0],
    snare: Array(16).fill(0).map((_, i) => i % 8 === 4 ? 1 : 0),
    hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    tom: [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
    clap: Array(16).fill(0).map((_, i) => i % 8 === 4 ? 1 : 0)
    },
    'Bossa Nova': {
    kick: [1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0],
    snare: [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1],
    hihat: [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1],
    tom: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
    clap: Array(16).fill(0)
    },
    'Disco': {
    kick: Array(16).fill(0).map((_, i) => i % 4 === 0 ? 1 : 0),
    snare: Array(16).fill(0).map((_, i) => i % 4 === 2 ? 1 : 0),
    hihat: Array(16).fill(1),
    tom: Array(16).fill(0),
    clap: Array(16).fill(0).map((_, i) => i % 4 === 2 ? 1 : 0)
    },
    'House': {
    kick: Array(16).fill(0).map((_, i) => i % 4 === 0 ? 1 : 0),
    snare: Array(16).fill(0),
    hihat: Array(16).fill(0).map((_, i) => i % 2 === 1 ? 1 : 0),
    tom: Array(16).fill(0),
    clap: Array(16).fill(0).map((_, i) => i % 4 === 2 ? 1 : 0)
    }
};
const params = {};
for (const inst in instDefs) {
    params[inst] = {...instDefs[inst].defs};
}
const $ = id => document.getElementById(id);
const tapTimes = [];
function handleTap() {
    const now = performance.now();
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000) {
    tapTimes.length = 0;
    }
    tapTimes.push(now);
    if (tapTimes.length >= 2) {
    const intervals = tapTimes
        .slice(1)
        .map((t, i) => (t - tapTimes[i]) / 1000);
    const avgInterval = intervals.reduce((sum, x) => sum + x, 0) / intervals.length;
    const bpm = Math.round(60 / avgInterval);
    $('bpm').value = bpm;
    s.tempo = bpm;
    }
}
function initGrid() {
    const grid = $('grid');
    grid.innerHTML = '';
    s.insts.forEach(inst => {
    s.pat[inst] = new Array(s.steps).fill(false);
    const row = document.createElement('tr');
    row.dataset.inst = inst;
    for (let i = 0; i < s.steps; i++) {
        const cell = document.createElement('td');
        cell.dataset.inst = inst;
        cell.dataset.step = i;
        cell.onclick = () => {
        s.pat[inst][i] = !s.pat[inst][i];
        cell.classList.toggle('active', s.pat[inst][i]);
        };
        row.appendChild(cell);
    }
    grid.appendChild(row);
    });
}
function initInstBtns() {
    const container = $('inst-btns');
    container.innerHTML = '';
    s.insts.forEach(inst => {
    const btn = document.createElement('div');
    btn.className = 'inst-btn';
    btn.textContent = instDefs[inst].name;
    btn.dataset.inst = inst;
    btn.onclick = () => {
        if (s.sel) {
        document.querySelector(`.inst-btn[data-inst="${s.sel}"]`).classList.remove('sel');
        }
        s.sel = inst;
        btn.classList.add('sel');
        openPanel(inst);
    };
    container.appendChild(btn);
    });
}
function updateGrid() {
    document.querySelectorAll('#grid td').forEach(cell => {
    const inst = cell.dataset.inst;
    const step = parseInt(cell.dataset.step);
    cell.classList.toggle('active', s.pat[inst][step]);
    });
}
function updatePlayhead(step) {
    document.querySelectorAll('td.playing').forEach(cell => {
    cell.classList.remove('playing');
    });
    if (step >= 0) {
    document.querySelectorAll(`td[data-step="${step}"]`).forEach(cell => {
        cell.classList.add('playing');
    });
    $('beat').textContent = `Beat: ${step + 1}`;
    } else {
    $('beat').textContent = '-';
    }
}
function openPanel(inst) {
    const panel = $('panel');
    const title = $('panel-title');
    const content = $('panel-content');
    title.textContent = `${instDefs[inst].name} Settings`;
    content.innerHTML = '';
    const groups = {
    'Options': instDefs[inst].ctrls.filter(c => c.type === 'select'),
    'Parameters': instDefs[inst].ctrls.filter(c => c.type === 'range')
    };
    for (const [name, ctrls] of Object.entries(groups)) {
    if (!ctrls.length) continue;
    const group = document.createElement('div');
    group.className = 'ctrl-group';
    const header = document.createElement('h3');
    header.textContent = name;
    group.appendChild(header);
    ctrls.forEach(ctrl => {
        const label = document.createElement('label');
        label.textContent = ctrl.lbl;
        let input;
        if (ctrl.type === 'select') {
        input = document.createElement('select');
        ctrl.opts.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            if (params[inst][ctrl.key] === opt) option.selected = true;
            input.appendChild(option);
        });
        input.onchange = () => params[inst][ctrl.key] = input.value;
        } else {
        input = document.createElement('input');
        input.type = 'range';
        input.min = ctrl.min;
        input.max = ctrl.max;
        input.step = ctrl.step;
        input.value = params[inst][ctrl.key];
        const display = document.createElement('span');
        display.textContent = params[inst][ctrl.key];
        input.oninput = () => {
            params[inst][ctrl.key] = parseFloat(input.value);
            display.textContent = input.value;
        };
        label.appendChild(display);
        }
        label.appendChild(input);
        group.appendChild(label);
    });
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Test Sound';
    testBtn.onclick = () => {
        initAudio();
        instDefs[inst].play(s.ctx.currentTime, params[inst]);
    };
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset to Default';
    resetBtn.onclick = () => {
        params[inst] = {...instDefs[inst].defs};
        openPanel(inst);
    };
    group.appendChild(testBtn);
    group.appendChild(resetBtn);
    content.appendChild(group);
    }
    panel.classList.add('open');
}
function initAudio() {
    if (!s.ctx) {
    s.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function schedule() {
    const interval = (60 / s.tempo) / 4;
    const now = s.ctx.currentTime;
    for (let i = 0; i < s.steps; i++) {
    const time = now + i * interval;
    setTimeout(() => {
        s.step = i;
        updatePlayhead(i);
    }, i * interval * 1000);
    for (const inst of s.insts) {
        if (s.pat[inst][i]) {
        instDefs[inst].play(time, params[inst]);
        }
    }
    }
    setTimeout(() => {
    if (s.playing) schedule();
    else updatePlayhead(-1);
    }, s.steps * interval * 1000);
}
function togglePlay() {
    initAudio();
    s.playing = !s.playing;
    const btn = $('play');
    btn.textContent = s.playing ? 'Stop' : 'Play';
    btn.classList.toggle('active', s.playing);
    if (s.playing) schedule();
    else {
    s.step = -1;
    updatePlayhead(-1);
    }
}
function loadPreset(name) {
    if (presets[name]) {
    for (const inst in presets[name]) {
        s.pat[inst] = presets[name][inst].map(v => v === 1);
    }
    updateGrid();
    }
}
function clearPattern() {
    for (const inst in s.pat) {
    s.pat[inst] = new Array(s.steps).fill(false);
    }
    updateGrid();
}
function savePattern() {
    try {
    localStorage.setItem('drumPattern', JSON.stringify({
        pattern: s.pat,
        params: params
    }));
    alert('Pattern saved!');
    } catch (e) {
    alert('Save error: ' + e.message);
    }
}
function loadPattern() {
    try {
    const data = JSON.parse(localStorage.getItem('drumPattern'));
    if (data) {
        s.pat = data.pattern;
        Object.assign(params, data.params);
        updateGrid();
        alert('Pattern loaded!');
    } else {
        alert('No saved pattern found');
    }
    } catch (e) {
    alert('Load error: ' + e.message);
    }
}
function init() {
    initGrid();
    initInstBtns();
    $('genre').onchange = e => loadPreset(e.target.value);
    $('close-panel').onclick = () => $('panel').classList.remove('open');
    $('play').onclick = togglePlay;
    $('clear').onclick = clearPattern;
    $('save').onclick = savePattern;
    $('load').onclick = loadPattern;
    $('bpm').onchange = e => s.tempo = parseInt(e.target.value);
    $('tap-bpm').onclick = handleTap;  // ← Tap BPM wiring
    document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    } else if (e.code === 'KeyC' && e.ctrlKey) {
        clearPattern();
    }
    });
}
init();