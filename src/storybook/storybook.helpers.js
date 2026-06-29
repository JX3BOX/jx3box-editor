import { onMounted, ref } from "vue";

export function createMeta({ title, component, args = {}, argTypes = {}, docs = "", parameters = {} }) {
    return {
        title,
        component,
        tags: ["autodocs"],
        args,
        argTypes: buildArgTypes(argTypes),
        parameters: {
            layout: "padded",
            docs: {
                description: {
                    component: docs,
                },
            },
            ...parameters,
        },
    };
}

export function componentStory(component, options = {}) {
    const { template, style = "", components = {}, setup } = options;

    return {
        render: (args) => ({
            components: {
                StoryComponent: component,
                ...components,
            },
            setup() {
                return {
                    args,
                    ...(typeof setup === "function" ? setup(args) : {}),
                };
            },
            template:
                template ||
                `<div style="${style}"><StoryComponent v-bind="args" /></div>`,
        }),
    };
}

export function previewStory(component, options = {}) {
    const { title = "效果预览", description = "", code = "", style = "", template, components = {}, setup } = options;

    return {
        render: (args) => ({
            components: {
                StoryComponent: component,
                ...components,
            },
            setup() {
                return {
                    args,
                    previewTitle: title,
                    previewDescription: description,
                    previewCode: code,
                    ...(typeof setup === "function" ? setup(args) : {}),
                };
            },
            template: `
                <div style="display:grid;gap:16px;min-width:320px;">
                    <div style="padding:16px 18px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
                        <div style="font-size:16px;font-weight:600;color:#111827;">{{ previewTitle }}</div>
                        <div v-if="previewDescription" style="margin-top:8px;color:#4b5563;line-height:1.7;white-space:pre-line;">{{ previewDescription }}</div>
                        <pre v-if="previewCode" style="margin:12px 0 0;padding:12px;border-radius:10px;background:#0f172a;color:#e2e8f0;font-size:12px;line-height:1.6;overflow:auto;white-space:pre-wrap;word-break:break-word;">{{ previewCode }}</pre>
                    </div>
                    <div style="padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;${style}">
                        ${template || `<StoryComponent v-bind="args" />`}
                    </div>
                </div>
            `,
        }),
    };
}

export function docsOnlyStory(message) {
    return {
        render: () => ({
            template: `<div style="max-width:720px;padding:16px 18px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;color:#374151;line-height:1.7;">${escapeHtml(
                message
            )}</div>`,
        }),
    };
}

export function useDemoText(url, fallback = "") {
    const content = ref(fallback);
    const loaded = ref(false);

    onMounted(async () => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                content.value = await response.text();
            }
        } catch (error) {
            console.warn(`[storybook] failed to load demo content: ${url}`, error);
        } finally {
            loaded.value = true;
        }
    });

    return {
        content,
        loaded,
    };
}

function buildArgTypes(argTypes) {
    return Object.fromEntries(
        Object.entries(argTypes).map(([name, config]) => {
            const table = {};

            if (config.type) {
                table.type = { summary: config.type };
            }

            if (config.defaultValue !== undefined) {
                table.defaultValue = { summary: config.defaultValue };
            }

            if (config.required) {
                table.category = "required";
            }

            return [
                name,
                {
                    description: config.description,
                    control: config.control === false ? false : config.control || inferControl(config.type),
                    options: config.options,
                    table,
                },
            ];
        })
    );
}

function inferControl(type = "") {
    if (type.includes("Boolean")) return "boolean";
    if (type.includes("Number")) return "number";
    if (type.includes("Array") || type.includes("Object")) return "object";
    return "text";
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");
}
