const messages = {
    "zh-cn": {
        directory: { title: "导读", collapse: "折叠" },
    },
    "zh-tw": {
        directory: { title: "導讀", collapse: "折疊" },
    },
    "en-us": {
        directory: { title: "Guide", collapse: "Collapse" },
    },
    vi: {
        directory: { title: "Hướng dẫn", collapse: "Thu gọn" },
    },
};

function getValue(message, key) {
    return key.split(".").reduce((value, part) => (value && value[part] !== undefined ? value[part] : undefined), message);
}

export function getLocale() {
    const locale = (localStorage.getItem("lang") || "zh-cn").toLowerCase();
    return locale === "en" ? "en-us" : messages[locale] ? locale : "zh-cn";
}

export function t(key, fallback = key) {
    return getValue(messages[getLocale()], key) ?? fallback;
}

export function getMessages() {
    return messages;
}
