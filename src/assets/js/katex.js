import $ from 'jquery';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function isEscaped(text, index) {
    let count = 0;
    for (let i = index - 1; i >= 0 && text[i] === '\\'; i--) {
        count++;
    }
    return count % 2 === 1;
}

function findUnescaped(text, token, start) {
    let index = start;
    while (index < text.length) {
        const found = text.indexOf(token, index);
        if (found === -1) return -1;
        if (!isEscaped(text, found)) return found;
        index = found + token.length;
    }
    return -1;
}

function getTextNodes(container, shouldAccept) {
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function (node) {
                // 跳过已渲染的节点
                if (
                    node.parentNode &&
                    (node.parentNode.classList?.contains('katex') ||
                     node.parentNode.closest("pre, code, .katex"))
                ) {
                    return NodeFilter.FILTER_REJECT;
                }

                return shouldAccept(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
        }
    );

    const nodesToReplace = [];
    while (walker.nextNode()) {
        nodesToReplace.push(walker.currentNode);
    }
    return nodesToReplace;
}

function collectInlineMatches(text) {
    const matches = [];
    let index = 0;

    while (index < text.length) {
        const parenStart = text.indexOf('\\(', index);
        const dollarStart = text.indexOf('$', index);
        const candidates = [parenStart, dollarStart].filter((value) => value !== -1 && !isEscaped(text, value));
        const start = candidates.length ? Math.min(...candidates) : -1;
        if (start === -1) break;

        if (text.slice(start, start + 2) === '\\(') {
            const end = findUnescaped(text, '\\)', start + 2);
            if (end !== -1) {
                const raw = text.slice(start + 2, end);
                if (raw && !raw.includes('\n')) {
                    matches.push({
                        start,
                        end: end + 2,
                        raw,
                        full: text.slice(start, end + 2),
                    });
                }
                index = end + 2;
                continue;
            }
        } else if (text[start] === '$' && text[start + 1] !== '$') {
            const end = findUnescaped(text, '$', start + 1);
            if (end !== -1 && text[end + 1] !== '$') {
                const raw = text.slice(start + 1, end);
                if (raw && !raw.includes('\n')) {
                    matches.push({
                        start,
                        end: end + 1,
                        raw,
                        full: text.slice(start, end + 1),
                    });
                }
                index = end + 1;
                continue;
            }
        }

        index = start + 1;
    }

    return matches;
}

function collectBlockMatches(text) {
    const matches = [];
    let index = 0;

    while (index < text.length) {
        const dollarStart = text.indexOf('$$', index);
        const bracketStart = text.indexOf('\\[', index);
        const candidates = [dollarStart, bracketStart].filter((value) => value !== -1 && !isEscaped(text, value));
        const start = candidates.length ? Math.min(...candidates) : -1;
        if (start === -1) break;

        if (text.slice(start, start + 2) === '$$') {
            const end = findUnescaped(text, '$$', start + 2);
            if (end !== -1) {
                const raw = text.slice(start + 2, end).trim();
                if (raw) {
                    matches.push({
                        start,
                        end: end + 2,
                        raw,
                        full: text.slice(start, end + 2),
                    });
                }
                index = end + 2;
                continue;
            }
        } else if (text.slice(start, start + 2) === '\\[') {
            const end = findUnescaped(text, '\\]', start + 2);
            if (end !== -1) {
                const raw = text.slice(start + 2, end).trim();
                if (raw) {
                    matches.push({
                        start,
                        end: end + 2,
                        raw,
                        full: text.slice(start, end + 2),
                    });
                }
                index = end + 2;
                continue;
            }
        }

        index = start + 1;
    }

    return matches;
}

function replaceTextNode(node, matches, renderMatch, logPrefix) {
    if (!matches.length) return;

    const text = node.nodeValue || '';
    const frag = document.createDocumentFragment();
    let lastIndex = 0;

    matches.forEach((match) => {
        if (match.start > lastIndex) {
            frag.appendChild(document.createTextNode(text.slice(lastIndex, match.start)));
        }

        try {
            frag.appendChild(renderMatch(match.raw));
        } catch (e) {
            frag.appendChild(document.createTextNode(match.full));
            console.error(logPrefix, match.raw, e.message);
        }

        lastIndex = match.end;
    });

    if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    if (frag.hasChildNodes()) {
        node.parentNode.replaceChild(frag, node);
    }
}

function renderKatexBlock(selector = ".w-latex") {
    try {
        $(selector).each(function() {
            const $katex = $(this);

            // 避免重复渲染
            if ($katex.data('katex-rendered')) return;

            let raw = $katex.html();

            // 统一处理换行符
            raw = raw
                .replace(/\\\\\s*<br\s*\/?>/gi, '\\\\')
                .replace(/\\\s*<br\s*\/?>/gi, '\\\\')
                .replace(/<br\s*\/?>/gi, '\\\\')
                .replace(/<[^>]+>/g, '');

            // 解码HTML实体
            raw = $('<div>').html(raw).text().trim();

            try {
                katex.render(raw, $katex.get(0), {
                    displayMode: true,
                    throwOnError: false,
                    strict: false
                });
                $katex.data('katex-rendered', true);
            } catch (e) {
                console.error('KaTeX render error:', e.message, raw);
            }
        });
    } catch (e) {
        console.error('KaTeX block render error:', e);
    }
}

function renderKatexInline(container = document.body) {
    getTextNodes(container, (value) => value.includes("\\(") || value.includes("$")).forEach((node) => {
        replaceTextNode(
            node,
            collectInlineMatches(node.nodeValue || ''),
            (raw) => {
                const span = document.createElement("span");
                span.className = "katex-inline";
                span.innerHTML = katex.renderToString(raw, {
                    displayMode: false,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });
                return span;
            },
            "Inline render error:"
        );
    });
}

function renderKatexDisplayBlock(container = document.body) {
    getTextNodes(container, (value) => value.includes("$$") || value.includes("\\[")).forEach((node) => {
        replaceTextNode(
            node,
            collectBlockMatches(node.nodeValue || ''),
            (raw) => {
                const div = document.createElement("div");
                div.className = "katex-block";
                div.innerHTML = katex.renderToString(raw, {
                    displayMode: true,
                    throwOnError: false,
                    strict: false,
                    trust: true
                });
                return div;
            },
            "Block render error:"
        );
    });
}

export default function renderKatexAll(container = document.body) {
    renderKatexBlock(".w-latex");
    renderKatexDisplayBlock(container);
    renderKatexInline(container);
}
