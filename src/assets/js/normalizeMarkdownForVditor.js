const PROTECTED_SEGMENT_REGEXP = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;

function replaceUnderline(text) {
    return text.replace(/\+\+([^\n+][^\n]*?)\+\+/g, "<u>$1</u>");
}

function replaceSuperscript(text) {
    return text.replace(
        /(^|[^\w\\])([A-Za-z0-9)\]}\u4e00-\u9fa5]+)\^([^^\s][^^]*?)\^/g,
        (match, prefix, base, value) => {
            return `${prefix}${base}<sup>${value}</sup>`;
        }
    );
}

function replaceSubscript(text) {
    return text.replace(/(^|[^\w\\])([A-Za-z0-9)\]}\u4e00-\u9fa5]+)~([^~\s][^~]*?)~/g, (match, prefix, base, value) => {
        return `${prefix}${base}<sub>${value}</sub>`;
    });
}

function normalizePlainMarkdown(text) {
    return [replaceUnderline, replaceSuperscript, replaceSubscript].reduce((result, transform) => {
        return transform(result);
    }, text);
}

export default function normalizeMarkdownForVditor(markdown) {
    const source = String(markdown || "");
    if (!source) return "";

    const segments = source.split(PROTECTED_SEGMENT_REGEXP);

    return segments
        .map((segment, index) => {
            return index % 2 === 1 ? segment : normalizePlainMarkdown(segment);
        })
        .join("");
}
