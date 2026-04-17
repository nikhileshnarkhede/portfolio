// Skills Graph - stable click layout (no force simulation)
const SKILL_GROUPS = [
    {
        name: "Machine Learning",
        skills: [
            "Linear Models", "Decision Trees", "Random Forest", "Extra Trees", "SVM", "K-Means", "PCA",
            "XGBoost", "LightGBM", "CatBoost", "Feature Engineering", "Hyperparameter Tuning", "Pipelines"
        ]
    },
    {
        name: "Deep Learning",
        skills: [
            "PyTorch", "TensorFlow", "Keras", "CNN", "RNN / LSTM", "Transformers", "BERT", "VAEs", "GANs", "Style Transfer"
        ]
    },
    {
        name: "Generative AI",
        skills: [
            "LLMs", "LangChain", "LangGraph", "RAG", "Prompt Engineering", "OpenAI API", "HuggingFace", "FAISS", "ChromaDB", "Agentic AI"
        ]
    },
    {
        name: "Computer Vision",
        skills: ["MTCNN", "VGGFace", "Transfer Learning", "Object Detection", "Autonomous Vehicles", "OpenCV"]
    },
    {
        name: "Data & Viz",
        skills: ["Pandas", "NumPy", "Plotly", "D3.js", "Streamlit", "Tableau", "SQL", "Databases", "Jupyter", "Data Handling"]
    },
    {
        name: "Programming",
        skills: ["Python", "MATLAB", "PostgreSQL", "MongoDB", "MySQL", "Git", "KNN", "Math for ML"]
    },
    {
        name: "MLOps & Deploy",
        skills: ["Docker", "FastAPI", "Model Interpretation", "Vibe Coding", "Cursor / MCP", "GitHub Copilot", "Windsurf"]
    },
    {
        name: "Soft Skills",
        skills: ["Problem Solving", "Communication", "Teamwork", "Attention to Detail", "Research", "Teaching"]
    }
];

const GRAPH_THEME = {
    accent: "#0071e3",
    nearBlack: "#1d1d1f",
    softGray: "#d2d2d7",
    white: "#ffffff",
    edge: "rgba(29, 29, 31, 0.18)",
    link: "rgba(29, 29, 31, 0.20)",
    linkDim: "rgba(29, 29, 31, 0.08)",
    skillFill: "#ffffff"
};

function slug(input) {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function labelWidth(label, minWidth, maxWidth, padding) {
    const calculated = (label.length * 6.8) + padding;
    return clamp(calculated, minWidth, maxWidth);
}

function buildGraphData() {
    const nodes = [];
    const links = [];

    nodes.push({
        id: "skills-root",
        type: "root",
        label: "Skills",
        baseW: 94,
        baseH: 34,
        categoryIndex: -1
    });

    SKILL_GROUPS.forEach((group, groupIndex) => {
        const categoryId = `cat-${slug(group.name)}-${groupIndex}`;

        nodes.push({
            id: categoryId,
            type: "category",
            label: group.name,
            categoryIndex: groupIndex,
            baseW: labelWidth(group.name, 100, 220, 30),
            baseH: 28
        });

        links.push({
            source: "skills-root",
            target: categoryId,
            kind: "root",
            parentId: null
        });

        group.skills.forEach((skillName, skillIndex) => {
            const skillId = `skill-${slug(group.name)}-${skillIndex}-${slug(skillName)}`;

            nodes.push({
                id: skillId,
                type: "skill",
                label: skillName,
                parentId: categoryId,
                groupName: group.name,
                categoryIndex: groupIndex,
                skillIndex,
                baseW: labelWidth(skillName, 88, 200, 26),
                baseH: 24
            });

            links.push({
                source: categoryId,
                target: skillId,
                kind: "child",
                parentId: categoryId
            });
        });
    });

    return { nodes, links };
}

function initSkillsGraph() {
    const container = document.getElementById("skills-graph");
    if (!container || typeof d3 === "undefined") return;

    d3.select(container).selectAll("*").remove();

    const tooltip = d3.select("#skill-tooltip");
    if (!tooltip.empty()) tooltip.style("opacity", 0);

    const width = Math.max(container.clientWidth || 320, 280);
    const height = Math.max(container.clientHeight || 520, 380);

    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("role", "img")
        .attr("aria-label", "Interactive technical skills graph");

    const mainLayer = svg.append("g");
    const { nodes, links } = buildGraphData();

    const nodeById = new Map(nodes.map((node) => [node.id, node]));
    const rootNode = nodes.find((node) => node.type === "root");
    const categoryNodes = nodes.filter((node) => node.type === "category");
    const skillNodes = nodes.filter((node) => node.type === "skill");

    nodes.forEach((node) => {
        node.x = width / 2;
        node.y = height / 2;
        node.boxW = node.baseW;
        node.boxH = node.baseH;
        node.targetX = node.x;
        node.targetY = node.y;
        node.targetW = node.baseW;
        node.targetH = node.baseH;
        node.showLabel = node.type !== "skill";
        node.opacity = node.type === "skill" ? 0 : 1;
    });

    let activeCategoryId = null;

    const linkSel = mainLayer
        .append("g")
        .attr("class", "sk-links")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("shape-rendering", "geometricPrecision")
        .attr("stroke", GRAPH_THEME.link)
        .attr("stroke-width", 1)
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", width / 2)
        .attr("y2", height / 2);

    const nodeSel = mainLayer
        .append("g")
        .attr("class", "sk-nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .style("cursor", (node) => (node.type === "category" || node.type === "root" ? "pointer" : "default"));

    nodeSel
        .append("rect")
        .attr("x", (node) => -node.boxW / 2)
        .attr("y", (node) => -node.boxH / 2)
        .attr("width", (node) => node.boxW)
        .attr("height", (node) => node.boxH)
        .attr("rx", 0)
        .attr("ry", 0)
        .attr("fill", GRAPH_THEME.white)
        .attr("stroke", GRAPH_THEME.edge)
        .attr("stroke-width", 1.1)
        .attr("opacity", (node) => node.opacity);

    nodeSel
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-family", "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif")
        .style("letter-spacing", "-0.12px")
        .style("pointer-events", "none")
        .text((node) => node.showLabel ? node.label : "")
        .attr("opacity", (node) => node.showLabel ? 1 : 0);

    function resolveNode(value) {
        if (typeof value === "object") return value;
        return nodeById.get(value);
    }

    function computeLayoutState() {
        const isCompact = width <= 768;
        const isNarrow = width <= 420;

        if (!activeCategoryId) {
            if (isCompact) {
                rootNode.targetX = width / 2;
                rootNode.targetY = isNarrow ? 44 : 50;
                rootNode.targetW = 86;
                rootNode.targetH = 28;

                const cols = 2;
                const rows = Math.ceil(categoryNodes.length / cols);
                const areaLeft = 12;
                const areaRight = width - 12;
                const areaTop = isNarrow ? 84 : 94;
                const areaBottom = height - 14;
                const cellW = Math.max(100, (areaRight - areaLeft) / cols);
                const cellH = Math.max(52, (areaBottom - areaTop) / rows);

                categoryNodes.forEach((node, index) => {
                    const col = index % cols;
                    const row = Math.floor(index / cols);
                    node.targetX = areaLeft + (col * cellW) + (cellW / 2);
                    node.targetY = areaTop + (row * cellH) + (cellH / 2);
                    node.targetW = labelWidth(node.label, 90, isNarrow ? 136 : 156, 20);
                    node.targetH = 24;
                });
            } else {
                rootNode.targetX = width / 2;
                rootNode.targetY = height / 2;
                rootNode.targetW = 96;
                rootNode.targetH = 34;

                const ringRX = Math.max(220, width * 0.34);
                const ringRY = Math.max(150, height * 0.30);

                categoryNodes.forEach((node, index) => {
                    const angle = ((index / categoryNodes.length) * Math.PI * 2) - (Math.PI / 2);
                    node.targetX = (width / 2) + (Math.cos(angle) * ringRX);
                    node.targetY = (height / 2) + (Math.sin(angle) * ringRY);
                    node.targetW = labelWidth(node.label, 100, 220, 30);
                    node.targetH = 28;
                });
            }

            skillNodes.forEach((node) => {
                const parent = nodeById.get(node.parentId);
                node.targetX = parent ? parent.targetX : width / 2;
                node.targetY = parent ? parent.targetY : height / 2;
                node.targetW = 3;
                node.targetH = 3;
            });
        } else {
            const activeCategory = nodeById.get(activeCategoryId);

            rootNode.targetX = 62;
            rootNode.targetY = 34;
            rootNode.targetW = 68;
            rootNode.targetH = 22;

            if (activeCategory) {
                activeCategory.targetX = width / 2;
                activeCategory.targetY = width <= 420 ? 64 : 72;
                activeCategory.targetW = labelWidth(activeCategory.label, 126, 260, 42);
                activeCategory.targetH = 32;
            }

            const otherCategories = categoryNodes.filter((node) => node.id !== activeCategoryId);
            const isCompact = width <= 768;
            const sidePadding = 18;
            const topY = 34;
            const spacing = otherCategories.length > 1
                ? (width - (sidePadding * 2)) / (otherCategories.length - 1)
                : 0;

            otherCategories.forEach((node, index) => {
                node.targetX = sidePadding + (spacing * index);
                node.targetY = topY;
                node.targetW = isCompact ? 14 : labelWidth(node.label, 58, 150, 14);
                node.targetH = isCompact ? 14 : 18;
            });

            const activeSkills = skillNodes.filter((node) => node.parentId === activeCategoryId);
            const areaLeft = width <= 420 ? 10 : 16;
            const areaRight = width - (width <= 420 ? 10 : 16);
            const areaTop = width <= 420 ? 96 : 118;
            const areaBottom = height - 12;
            const areaWidth = Math.max(220, areaRight - areaLeft);
            const areaHeight = Math.max(220, areaBottom - areaTop);

            let columnCount;
            if (width <= 420) {
                columnCount = 1;
            } else if (width <= 768) {
                columnCount = 2;
            } else {
                columnCount = Math.max(2, Math.ceil(Math.sqrt((activeSkills.length * areaWidth) / areaHeight)));
            }

            const rowCount = Math.max(1, Math.ceil(activeSkills.length / columnCount));
            const cellWidth = areaWidth / columnCount;
            const cellHeight = areaHeight / rowCount;

            activeSkills.forEach((node, index) => {
                const col = index % columnCount;
                const row = Math.floor(index / columnCount);
                node.targetX = areaLeft + (col * cellWidth) + (cellWidth / 2);
                node.targetY = areaTop + (row * cellHeight) + (cellHeight / 2);

                if (columnCount === 1) {
                    node.targetW = clamp(areaWidth - 10, 170, 260);
                } else {
                    node.targetW = labelWidth(node.label, 92, 210, 26);
                }
                node.targetH = 24;
            });

            skillNodes
                .filter((node) => node.parentId !== activeCategoryId)
                .forEach((node) => {
                    const parent = nodeById.get(node.parentId);
                    node.targetX = parent ? parent.targetX : width / 2;
                    node.targetY = parent ? parent.targetY : height / 2;
                    node.targetW = 3;
                    node.targetH = 3;
                });
        }

        nodes.forEach((node) => {
            const isCompact = width <= 768;

            if (node.type === "skill") {
                const isActiveSkill = activeCategoryId && node.parentId === activeCategoryId;
                node.showLabel = !!isActiveSkill;
                node.opacity = isActiveSkill ? 1 : 0;
            } else if (node.type === "category") {
                const isActiveCat = activeCategoryId && node.id === activeCategoryId;
                const isShrunkOther = isCompact && activeCategoryId && !isActiveCat;
                node.showLabel = !isShrunkOther;
                node.opacity = (activeCategoryId && !isActiveCat) ? 0.56 : 1;
            } else {
                node.showLabel = true;
                node.opacity = 1;
            }

            node.x = clamp(node.targetX, (node.targetW / 2) + 4, width - (node.targetW / 2) - 4);
            node.y = clamp(node.targetY, (node.targetH / 2) + 4, height - (node.targetH / 2) - 4);
            node.boxW = node.targetW;
            node.boxH = node.targetH;
        });
    }

    function styleLinks() {
        linkSel
            .attr("stroke", (linkDatum) => {
                if (linkDatum.kind === "root") {
                    if (!activeCategoryId) return GRAPH_THEME.link;
                    return resolveNode(linkDatum.target).id === activeCategoryId ? GRAPH_THEME.accent : GRAPH_THEME.linkDim;
                }

                if (!activeCategoryId) return GRAPH_THEME.linkDim;
                return linkDatum.parentId === activeCategoryId ? "rgba(0, 113, 227, 0.34)" : "rgba(29, 29, 31, 0.06)";
            })
            .attr("stroke-opacity", (linkDatum) => {
                if (linkDatum.kind === "root") return activeCategoryId ? 0.9 : 1;
                if (!activeCategoryId) return 0.1;
                return linkDatum.parentId === activeCategoryId ? 1 : 0.05;
            })
            .attr("stroke-width", (linkDatum) => {
                if (linkDatum.kind === "root") return resolveNode(linkDatum.target).id === activeCategoryId ? 1.4 : 1;
                return linkDatum.parentId === activeCategoryId ? 1 : 0.8;
            });
    }

    function styleNodes() {
        nodeSel.select("rect")
            .attr("fill", (node) => {
                if (node.type === "root") return GRAPH_THEME.nearBlack;
                if (node.type === "category") return node.id === activeCategoryId ? GRAPH_THEME.accent : GRAPH_THEME.softGray;
                return GRAPH_THEME.skillFill;
            })
            .attr("stroke", (node) => {
                if (node.type === "root") return GRAPH_THEME.nearBlack;
                if (node.type === "category") return node.id === activeCategoryId ? GRAPH_THEME.accent : GRAPH_THEME.edge;
                return GRAPH_THEME.edge;
            })
            .attr("stroke-width", (node) => {
                if (node.type === "category" && node.id === activeCategoryId) return 1.8;
                return 1;
            });

        nodeSel.select("text")
            .text((node) => node.showLabel ? node.label : "")
            .attr("fill", (node) => {
                if (node.type === "root") return GRAPH_THEME.white;
                if (node.type === "category" && node.id === activeCategoryId) return GRAPH_THEME.white;
                return GRAPH_THEME.nearBlack;
            })
            .attr("font-size", (node) => {
                if (node.type === "root") return "11px";
                if (node.type === "skill") return "9px";
                return "10px";
            })
            .attr("font-weight", (node) => node.type === "skill" ? 500 : 600);
    }

    function render(duration) {
        styleLinks();
        styleNodes();

        const ease = d3.easeCubicOut;

        nodeSel
            .interrupt()
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("transform", (node) => `translate(${node.x},${node.y})`);

        nodeSel
            .select("rect")
            .interrupt()
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("x", (node) => -node.boxW / 2)
            .attr("y", (node) => -node.boxH / 2)
            .attr("width", (node) => node.boxW)
            .attr("height", (node) => node.boxH)
            .attr("opacity", (node) => node.opacity);

        nodeSel
            .select("text")
            .interrupt()
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("opacity", (node) => node.showLabel ? node.opacity : 0);

        linkSel
            .interrupt()
            .transition()
            .duration(duration)
            .ease(ease)
            .attr("x1", (linkDatum) => resolveNode(linkDatum.source).x)
            .attr("y1", (linkDatum) => resolveNode(linkDatum.source).y)
            .attr("x2", (linkDatum) => resolveNode(linkDatum.target).x)
            .attr("y2", (linkDatum) => resolveNode(linkDatum.target).y);
    }

    function applyLayout(duration) {
        computeLayoutState();
        render(duration);
    }

    nodeSel.on("click", (event, node) => {
        event.stopPropagation();

        if (node.type === "root") {
            activeCategoryId = null;
            applyLayout(380);
            return;
        }

        if (node.type === "category") {
            activeCategoryId = activeCategoryId === node.id ? null : node.id;
            applyLayout(380);
        }
    });

    svg.on("click", () => {
        if (activeCategoryId) {
            activeCategoryId = null;
            applyLayout(380);
        }
    });

    applyLayout(0);
}

function buildMobileSkillsAccordion() {
    const container = document.getElementById("skills-mobile");
    if (!container) return;

    container.innerHTML = "";

    SKILL_GROUPS.forEach((group, index) => {
        const item = document.createElement("div");
        item.className = "sk-accordion-item";

        const header = document.createElement("button");
        header.className = "sk-accordion-header";
        header.type = "button";
        header.setAttribute("aria-expanded", "false");
        header.setAttribute("aria-controls", `sk-acc-body-${index}`);
        header.innerHTML = `<span>${group.name}</span><span>+</span>`;

        const body = document.createElement("div");
        body.className = "sk-accordion-body";
        body.id = `sk-acc-body-${index}`;

        const pills = document.createElement("div");
        pills.className = "sk-accordion-pills";
        group.skills.forEach((skill) => {
            const pill = document.createElement("span");
            pill.className = "sk-accordion-pill";
            pill.textContent = skill;
            pills.appendChild(pill);
        });
        body.appendChild(pills);

        header.addEventListener("click", () => {
            const isOpen = body.classList.contains("open");
            container.querySelectorAll(".sk-accordion-body.open").forEach((openBody) => {
                openBody.classList.remove("open");
            });
            container.querySelectorAll(".sk-accordion-header").forEach((btn) => {
                btn.setAttribute("aria-expanded", "false");
                const symbol = btn.querySelector("span:last-child");
                if (symbol) symbol.textContent = "+";
            });

            if (!isOpen) {
                body.classList.add("open");
                header.setAttribute("aria-expanded", "true");
                const symbol = header.querySelector("span:last-child");
                if (symbol) symbol.textContent = "-";
            }
        });

        item.appendChild(header);
        item.appendChild(body);
        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSkillsGraph();
    buildMobileSkillsAccordion();
});
window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        initSkillsGraph();
        buildMobileSkillsAccordion();
    }, 180);
});
