// Combo con búsqueda, sin dependencias.
//
// Por qué no <datalist>: no permite separar `value` de `label` (el combo de Set
// muestra "01 - Seal of Exodia" pero la query necesita `set:SOE`), no admite
// multi-selección ni iconos, y el filtrado difiere entre navegadores.
//
// El panel se monta en <body> con position:fixed en vez de dentro del combo:
// el sidebar tiene overflow-y:auto y recortaría un panel posicionado en absolute.
(function () {
    'use strict';

    const instances = new Set();

    function createCombo(mount, config) {
        const {
            id,
            icon = null,
            placeholder = 'Any',
            searchPlaceholder = 'Type to filter...',
            multi = false,
            options = [],
            onChange = () => { },
        } = config;

        let allOptions = options.slice();
        let selected = multi ? [] : '';
        let visible = allOptions;
        let activeIndex = -1;

        // ---------- DOM ----------
        const root = document.createElement('div');
        root.className = 'combo';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'combo-trigger';
        trigger.id = id;
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-controls', id + '-list');

        if (icon) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'combo-icon');
            svg.setAttribute('aria-hidden', 'true');
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#icon-' + icon);
            svg.appendChild(use);
            trigger.appendChild(svg);
        }

        const valueEl = document.createElement('span');
        valueEl.className = 'combo-value';
        trigger.appendChild(valueEl);

        const caret = document.createElement('span');
        caret.className = 'combo-caret';
        caret.setAttribute('aria-hidden', 'true');
        caret.textContent = '▾';
        trigger.appendChild(caret);

        root.appendChild(trigger);
        mount.appendChild(root);

        const panel = document.createElement('div');
        panel.className = 'combo-panel';
        panel.hidden = true;

        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'combo-search';
        search.placeholder = searchPlaceholder;
        search.setAttribute('role', 'searchbox');
        search.setAttribute('autocomplete', 'off');
        panel.appendChild(search);

        const list = document.createElement('ul');
        list.className = 'combo-list';
        list.id = id + '-list';
        list.setAttribute('role', 'listbox');
        if (multi) list.setAttribute('aria-multiselectable', 'true');
        panel.appendChild(list);

        document.body.appendChild(panel);

        // ---------- render ----------
        function isSelected(value) {
            return multi ? selected.indexOf(value) !== -1 : selected === value;
        }

        function labelFor(value) {
            const opt = allOptions.find(o => o.value === value);
            return opt ? opt.label : value;
        }

        function renderValue() {
            const empty = multi ? selected.length === 0 : !selected;
            valueEl.textContent = empty
                ? placeholder
                : (multi
                    ? (selected.length === 1 ? labelFor(selected[0]) : selected.length + ' selected')
                    : labelFor(selected));
            valueEl.classList.toggle('is-placeholder', empty);
            root.classList.toggle('has-value', !empty);
        }

        function renderList() {
            list.textContent = '';

            if (visible.length === 0) {
                const li = document.createElement('li');
                li.className = 'combo-empty';
                li.textContent = 'No matches';
                list.appendChild(li);
                return;
            }

            visible.forEach((opt, i) => {
                const li = document.createElement('li');
                li.className = 'combo-option';
                li.id = id + '-opt-' + i;
                li.setAttribute('role', 'option');
                li.setAttribute('aria-selected', String(isSelected(opt.value)));
                if (i === activeIndex) li.classList.add('active');
                if (isSelected(opt.value)) li.classList.add('selected');

                if (multi) {
                    const box = document.createElement('span');
                    box.className = 'combo-check';
                    box.setAttribute('aria-hidden', 'true');
                    box.textContent = isSelected(opt.value) ? '✓' : '';
                    li.appendChild(box);
                }

                // textContent, nunca innerHTML: las opciones salen de los datos
                const text = document.createElement('span');
                text.className = 'combo-option-label';
                text.textContent = opt.label;
                li.appendChild(text);

                if (opt.count !== undefined) {
                    const count = document.createElement('span');
                    count.className = 'combo-count';
                    count.textContent = opt.count;
                    li.appendChild(count);
                }

                li.addEventListener('mousedown', e => {
                    e.preventDefault(); // no robar el foco al input de búsqueda
                    pick(opt.value);
                });
                li.addEventListener('mousemove', () => setActive(i));

                list.appendChild(li);
            });
        }

        function setActive(i) {
            activeIndex = i;
            [...list.children].forEach((li, n) => li.classList.toggle('active', n === i));
            const el = list.children[i];
            if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
            if (el) search.setAttribute('aria-activedescendant', el.id);
        }

        function filter(query) {
            const q = query.trim().toLowerCase();
            visible = q
                ? allOptions.filter(o => o.label.toLowerCase().includes(q))
                : allOptions;
            activeIndex = visible.length ? 0 : -1;
            renderList();
        }

        function pick(value) {
            if (multi) {
                const i = selected.indexOf(value);
                if (i === -1) selected.push(value);
                else selected.splice(i, 1);
                renderValue();
                renderList();
            } else {
                selected = selected === value ? '' : value;
                renderValue();
                close();
            }
            onChange(api.getValue());
        }

        // ---------- open / close ----------
        function position() {
            const rect = trigger.getBoundingClientRect();
            const pad = 8;
            panel.style.width = rect.width + 'px';
            panel.style.left = Math.max(pad, Math.min(rect.left, window.innerWidth - rect.width - pad)) + 'px';

            // medir para decidir si abre hacia abajo o hacia arriba
            const h = panel.offsetHeight;
            const below = window.innerHeight - rect.bottom;
            panel.style.top = (below >= h + pad || below >= rect.top)
                ? (rect.bottom + 4) + 'px'
                : Math.max(pad, rect.top - h - 4) + 'px';
        }

        function open() {
            instances.forEach(c => { if (c !== api) c.close(); });
            panel.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            root.classList.add('open');
            search.value = '';
            filter('');
            position();
            search.focus();
        }

        function close() {
            if (panel.hidden) return;
            panel.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            root.classList.remove('open');
            search.removeAttribute('aria-activedescendant');
        }

        // ---------- eventos ----------
        trigger.addEventListener('click', () => {
            if (panel.hidden) open(); else close();
        });

        search.addEventListener('input', () => filter(search.value));

        search.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (visible.length) setActive((activeIndex + 1) % visible.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (visible.length) setActive((activeIndex - 1 + visible.length) % visible.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (visible[activeIndex]) pick(visible[activeIndex].value);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                close();
                trigger.focus();
            } else if (e.key === 'Tab') {
                close();
            }
        });

        // ---------- API ----------
        const api = {
            id,
            multi,
            get element() { return root; },
            get panel() { return panel; },
            get trigger() { return trigger; },
            get optionsRef() { return allOptions; },
            getValue() { return multi ? selected.slice() : selected; },
            setValue(v) {
                selected = multi ? (Array.isArray(v) ? v.slice() : []) : (v || '');
                renderValue();
                if (!panel.hidden) renderList();
            },
            setOptions(opts) {
                allOptions = opts.slice();
                visible = allOptions;
                renderValue();
                if (!panel.hidden) renderList();
            },
            clear() { api.setValue(multi ? [] : ''); },
            close,
            reposition() { if (!panel.hidden) position(); },
            contains(node) { return root.contains(node) || panel.contains(node); },
        };

        instances.add(api);
        renderValue();
        return api;
    }

    // ---------- listeners globales, uno solo para todos los combos ----------
    document.addEventListener('click', e => {
        instances.forEach(c => { if (!c.contains(e.target)) c.close(); });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') instances.forEach(c => c.close());
    });

    // El panel es fixed: hay que reposicionarlo cuando el sidebar scrollea
    const reposition = () => instances.forEach(c => c.reposition());
    window.addEventListener('scroll', reposition, { passive: true, capture: true });
    window.addEventListener('resize', reposition, { passive: true });

    window.createCombo = createCombo;
})();
