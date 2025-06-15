// Sistema de búsqueda avanzada para Kingdom Duels
class KingdomDuelsSearch {
    constructor(cardsData) {
        this.cards = cardsData;
        this.buildIndices();
    }

    // Construir índices para búsqueda rápida
    buildIndices() {
        this.indices = {
            name: new Map(),
            frame: new Map(),
            types: new Map(),
            set: new Map(),
            deck: new Map(),
            duelist: new Map(),
            id: new Map(),
            attribute: new Map(),
            grade: new Map(),
            gradeval: new Map(),
            atk: new Map(),
            def: new Map(),
            bonusatk: new Map(),
            bonusdef: new Map()
        };

        // Índice de texto completo para nombres
        this.nameWords = new Map();

        this.cards.forEach((card, index) => {
            // Índices exactos
            //this.addToIndex('frame', card.frame, index);
            this.addToIndex('set', card.set, index);
            this.addToIndex('deck', card.deck, index);
            this.addToIndex('id', card.id, index);

            // Indice de frames
            if (card.frame) {
                card.frame.split(' ').forEach(word => {
                    const cleanWord = word.trim();
                    if (cleanWord) {
                        this.addToIndex('frame', cleanWord.toLowerCase(), index);
                    }
                });
            }

            // Índice de duelistas (múltiples) - limpiar espacios
            if (card.duelist) {
                card.duelist.split(',').forEach(duelist => {
                    const cleanDuelist = duelist.trim(); // Limpiar espacios
                    if (cleanDuelist) { // Solo agregar si no está vacío
                        this.addToIndex('duelist', cleanDuelist.toLowerCase(), index);
                    }
                });
            }

            // Índices opcionales - solo si el campo existe
            if (card.attribute) {
                this.addToIndex('attribute', card.attribute.toLowerCase(), index);
            }
            if (card.grade) {
                this.addToIndex('grade', card.grade.toLowerCase(), index);
            }
            if (card.gradeval !== undefined) {
                this.addToIndex('gradeval', card.gradeval, index);
            }
            if (card.atk) {
                this.addToIndex('atk', card.atk, index);
            }
            if (card.def) {
                this.addToIndex('def', card.def, index);
            }
            if (card.bonusatk) {
                this.addToIndex('bonusatk', card.bonusatk, index);
            }
            if (card.bonusdef) {
                this.addToIndex('bonusdef', card.bonusdef, index);
            }

            // Índice de tipos (múltiples) - limpiar espacios
            if (card.types) {
                card.types.split(' ').forEach(type => {
                    const cleanType = type.trim(); // Limpiar espacios
                    if (cleanType) { // Solo agregar si no está vacío
                        this.addToIndex('types', cleanType.toLowerCase(), index);
                    }
                });
            }

            // Índice de palabras del nombre
            if (card.name) {
                card.name.toLowerCase().split(' ').forEach(word => {
                    const cleanWord = word.trim();
                    if (cleanWord) {
                        if (!this.nameWords.has(cleanWord)) {
                            this.nameWords.set(cleanWord, new Set());
                        }
                        this.nameWords.get(cleanWord).add(index);
                    }
                });
            }
        });
    }

    addToIndex(field, value, cardIndex) {
        const key = value.toLowerCase();
        if (!this.indices[field].has(key)) {
            this.indices[field].set(key, new Set());
        }
        this.indices[field].get(key).add(cardIndex);
    }

    // Parser principal de consultas
    parseQuery(query) {
        if (!query.trim()) return { terms: [] };

        // Tokenizar respetando comillas y operadores
        const tokens = this.tokenize(query);
        const terms = [];
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            // Detectar operadores NOT
            if (token === '-' && i + 1 < tokens.length) {
                const nextTerm = this.parseTerm(tokens[i + 1]);
                if (nextTerm) {
                    nextTerm.negate = true;
                    terms.push(nextTerm);
                    i++; // Saltar el siguiente token
                }
                continue;
            }

            // Detectar operadores OR
            if (token.toUpperCase() === 'OR' && terms.length > 0 && i + 1 < tokens.length) {
                const nextTerm = this.parseTerm(tokens[i + 1]);
                if (nextTerm) {
                    // Marcar el término anterior y el siguiente como OR
                    terms[terms.length - 1].or = true;
                    nextTerm.orGroup = true;
                    terms.push(nextTerm);
                    i++; // Saltar el siguiente token
                }
                continue;
            }

            const term = this.parseTerm(token);
            if (term) {
                terms.push(term);
            }
        }

        return { terms };
    }

    tokenize(query) {
        const tokens = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < query.length; i++) {
            const char = query[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
                if (!inQuotes && current) {
                    tokens.push(current);
                    current = '';
                }
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) {
            tokens.push(current);
        }
        
        return tokens;
    }

    parseTerm(token) {
        let negate = false;
        let actualToken = token;
        
        // Detectar si el token comienza con '-'
        if (token.startsWith('-')) {
            negate = true;
            actualToken = token.substring(1);
        }
        
        // Detectar formato campo:valor
        const colonIndex = actualToken.indexOf(':');
        
        if (colonIndex > 0) {
            let field = actualToken.substring(0, colonIndex).toLowerCase();
            let value = actualToken.substring(colonIndex + 1);
            let operator = '=';

            // Manejo de alias
            if (field === 'attrib') field = 'attribute';
            if (field === 'level') {
                // Caso especial: level:4 se convierte en grade:lvl + gradeval:4
                return this.createLevelTerm(value, negate);
            }

            // Detectar operadores de comparación
            if (value.startsWith('>=')) {
                operator = '>=';
                value = value.substring(2);
            } else if (value.startsWith('<=')) {
                operator = '<=';
                value = value.substring(2);
            } else if (value.startsWith('!=')) {
                operator = '!=';
                value = value.substring(2);
            } else if (value.startsWith('>')) {
                operator = '>';
                value = value.substring(1);
            } else if (value.startsWith('<')) {
                operator = '<';
                value = value.substring(1);
            }

            const term = {
                field,
                operator,
                value: value.toLowerCase(),
                type: 'field'
            };
            
            if (negate) {
                term.negate = true;
            }
            
            return term;
        } else {
            // Búsqueda de texto libre (en nombres)
            const term = {
                field: 'name',
                operator: 'contains',
                value: actualToken.toLowerCase(),
                type: 'text'
            };
            
            if (negate) {
                term.negate = true;
            }
            
            return term;
        }
    }

    createLevelTerm(value, negate) {
        // Extraer operador si existe
        let operator = '=';
        let cleanValue = value;
        
        if (value.startsWith('>=')) {
            operator = '>=';
            cleanValue = value.substring(2);
        } else if (value.startsWith('<=')) {
            operator = '<=';
            cleanValue = value.substring(2);
        } else if (value.startsWith('!=')) {
            operator = '!=';
            cleanValue = value.substring(2);
        } else if (value.startsWith('>')) {
            operator = '>';
            cleanValue = value.substring(1);
        } else if (value.startsWith('<')) {
            operator = '<';
            cleanValue = value.substring(1);
        }
        
        return {
            field: 'level',
            operator,
            value: cleanValue.toLowerCase(),
            type: 'compound',
            negate
        };
    }

    // Ejecutar búsqueda
    search(query, limit = 1000) {
        const parsed = this.parseQuery(query);
        
        if (parsed.terms.length === 0) {
            return this.cards.slice(0, limit);
        }

        // Separar términos positivos y negativos
        const positiveTerms = parsed.terms.filter(term => !term.negate && !term.or && !term.orGroup);
        const negativeTerms = parsed.terms.filter(term => term.negate);
        const orTerms = parsed.terms.filter(term => term.or || term.orGroup);
        
        let results;
        
        // Si hay términos positivos, empezar con intersección de esos
        if (positiveTerms.length > 0) {
            results = new Set(Array.from({ length: this.cards.length }, (_, i) => i));
            
            // Aplicar cada término positivo
            for (const term of positiveTerms) {
                const matches = this.searchTerm(term);
                results = new Set([...results].filter(x => matches.has(x)));
            }
        } else {
            // Si solo hay términos negativos, empezar con todas las cartas
            results = new Set(Array.from({ length: this.cards.length }, (_, i) => i));
        }
        
        // Aplicar términos negativos (eliminar coincidencias)
        for (const term of negativeTerms) {
            const matches = this.searchTerm(term);
            matches.forEach(index => results.delete(index));
        }
        
        // Manejar términos OR (simplificado por ahora)
        if (orTerms.length > 0) {
            let orResults = new Set();
            for (const term of orTerms) {
                const matches = this.searchTerm(term);
                matches.forEach(index => orResults.add(index));
            }
            
            if (positiveTerms.length > 0) {
                // Intersección con resultados existentes
                results = new Set([...results].filter(x => orResults.has(x)));
            } else {
                // Si solo hay OR, usar esos resultados
                results = orResults;
                
                // Aplicar términos negativos
                for (const term of negativeTerms) {
                    const matches = this.searchTerm(term);
                    matches.forEach(index => results.delete(index));
                }
            }
        }

        // Convertir índices a cartas y limitar resultados
        const resultCards = [...results]
            .slice(0, limit)
            .map(index => this.cards[index]);
            
        return resultCards;
    }

    searchTerm(term) {
        const matches = new Set();

        // Caso especial para level (compuesto)
        if (term.field === 'level') {
            this.cards.forEach((card, i) => {
                // Verificar que tenga grade = "lvl" Y que gradeval cumpla condición
                if (card.grade && card.grade.toLowerCase() === 'lvl' && 
                    card.gradeval !== undefined) {
                    
                    const cardValue = card.gradeval;
                    const searchValue = term.value;
                    
                    if (this.compareValues(cardValue, searchValue, term.operator)) {
                        matches.add(i);
                    }
                }
            });
            return matches;
        }

        switch (term.field) {
            case 'name':
                if (term.operator === 'contains') {
                    // Búsqueda parcial en nombres
                    this.cards.forEach((card, i) => {
                        if (card.name.toLowerCase().includes(term.value)) {
                            matches.add(i);
                        }
                    });
                } else {
                    // Búsqueda exacta por palabra
                    if (this.nameWords.has(term.value)) {
                        this.nameWords.get(term.value).forEach(i => matches.add(i));
                    }
                }
                break;

            case 'frame':
                // Búsqueda por palabras individuales en frame
                if (this.indices.frame.has(term.value)) {
                    this.indices.frame.get(term.value).forEach(i => matches.add(i));
                }
                break;

            case 'set':
            case 'deck':
                if (this.indices[term.field].has(term.value)) {
                    this.indices[term.field].get(term.value).forEach(i => matches.add(i));
                }
                break;

            case 'attribute':
            case 'grade':
                // Campos opcionales - verificar existencia
                if (this.indices[term.field] && this.indices[term.field].has(term.value)) {
                    this.indices[term.field].get(term.value).forEach(i => matches.add(i));
                }
                break;

            case 'atk':
            case 'def':
            case 'bonusatk':
            case 'bonusdef':
            case 'gradeval':
                // Campos numéricos opcionales
                this.cards.forEach((card, i) => {
                    const cardValue = card[term.field];
                    if (cardValue !== undefined && cardValue !== null) {
                        if (this.compareValues(cardValue, term.value, term.operator)) {
                            matches.add(i);
                        }
                    }
                });
                break;

            case 'duelist':
                // Búsqueda en duelistas - limpiar espacios
                const cleanDuelistValue = term.value.trim();
                
                // Usar búsqueda exacta en el índice primero
                if (this.indices.duelist.has(cleanDuelistValue)) {
                    this.indices.duelist.get(cleanDuelistValue).forEach(i => matches.add(i));
                } else {
                    // Solo si no encuentra coincidencia exacta, hacer búsqueda parcial
                    this.cards.forEach((card, i) => {
                        if (card.duelist) {
                            // Limpiar duelistas y buscar coincidencia exacta en la lista
                            const cardDuelists = card.duelist.split(',').map(d => d.trim().toLowerCase()).filter(d => d);
                            if (cardDuelists.includes(cleanDuelistValue)) {
                                matches.add(i);
                            }
                        }
                    });
                }
                break;

            case 'types':
            case 'type':
                // Búsqueda en tipos - limpiar espacios
                const cleanValue = term.value.trim();
                
                // Usar búsqueda exacta en el índice primero
                if (this.indices.types.has(cleanValue)) {
                    this.indices.types.get(cleanValue).forEach(i => matches.add(i));
                } else {
                    // Solo si no encuentra coincidencia exacta, hacer búsqueda parcial
                    this.cards.forEach((card, i) => {
                        if (card.types) {
                            // Limpiar tipos y buscar coincidencia exacta en la lista
                            const cardTypes = card.types.split(' ').map(t => t.trim().toLowerCase()).filter(t => t);
                            if (cardTypes.includes(cleanValue)) {
                                matches.add(i);
                            }
                        }
                    });
                }
                break;

            case 'id':
                // Búsqueda en ID (puede ser parcial)
                this.cards.forEach((card, i) => {
                    if (card.id && card.id.toLowerCase().includes(term.value)) {
                        matches.add(i);
                    }
                });
                break;

            default:
                // Campo no reconocido, buscar en nombre por defecto
                this.cards.forEach((card, i) => {
                    if (card.name.toLowerCase().includes(term.value)) {
                        matches.add(i);
                    }
                });
        }

        return matches;
    }

    compareValues(cardValue, searchValue, operator) {
        // Intentar conversión numérica
        const cardNum = parseFloat(cardValue);
        const searchNum = parseFloat(searchValue);
        
        // Si ambos son numéricos, usar comparación numérica
        if (!isNaN(cardNum) && !isNaN(searchNum)) {
            switch (operator) {
                case '>': return cardNum > searchNum;
                case '<': return cardNum < searchNum;
                case '>=': return cardNum >= searchNum;
                case '<=': return cardNum <= searchNum;
                case '!=': return cardNum !== searchNum;
                case '=': 
                default: return cardNum === searchNum;
            }
        } else {
            // Comparación de texto (solo igualdad)
            const match = cardValue.toString().toLowerCase() === searchValue.toLowerCase();
            return operator === '!=' ? !match : match;
        }
    }

    // Función de ayuda para obtener sugerencias
    getSuggestions(query, field = null) {
        const suggestions = new Set();
        const queryLower = query.toLowerCase();

        if (field) {
            // Sugerencias para un campo específico
            if (this.indices[field]) {
                for (const [key] of this.indices[field]) {
                    if (key.includes(queryLower)) {
                        suggestions.add(key);
                    }
                }
            }
        } else {
            // Sugerencias generales (nombres de carta)
            for (const [word] of this.nameWords) {
                if (word.includes(queryLower)) {
                    suggestions.add(word);
                }
            }
        }

        return Array.from(suggestions).slice(0, 10);
    }
}

// Función para integrar con tu código existente
function setupAdvancedSearch(cardsData) {
    const searcher = new KingdomDuelsSearch(cardsData);
    return searcher;
}

// Agregar campo de búsqueda avanzada al HTML
function addAdvancedSearchField() {
    // Solo agregar los event listeners
    const searchField = document.getElementById('advancedSearch');
    if (searchField) {
        searchField.addEventListener('input', onAdvancedSearchChange);
        
        // Inicializar dropdown cerrado
        const dropdown = document.getElementById('filtersDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }
}
