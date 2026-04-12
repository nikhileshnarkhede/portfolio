// Technical Skills Graph - Apple design aligned
const skillsData = {
    nodes: [
        { id: "Skills", group: "center", size: 52 },

        { id: "Machine Learning", group: "category", size: 34 },
        { id: "Deep Learning", group: "category", size: 34 },
        { id: "Generative AI", group: "category", size: 34 },
        { id: "Vibe Coding", group: "category", size: 34 },
        { id: "Data & Viz", group: "category", size: 34 },
        { id: "Programming", group: "category", size: 34 },
        { id: "MLOps", group: "category", size: 34 },

        { id: "PyTorch", group: "skill", size: 19, parent: "Machine Learning" },
        { id: "TensorFlow", group: "skill", size: 19, parent: "Machine Learning" },
        { id: "Scikit-learn", group: "skill", size: 17, parent: "Machine Learning" },
        { id: "XGBoost", group: "skill", size: 16, parent: "Machine Learning" },
        { id: "LightGBM", group: "skill", size: 16, parent: "Machine Learning" },
        { id: "CatBoost", group: "skill", size: 16, parent: "Machine Learning" },

        { id: "Keras", group: "skill", size: 19, parent: "Deep Learning" },
        { id: "CNN", group: "skill", size: 18, parent: "Deep Learning" },
        { id: "RNN", group: "skill", size: 16, parent: "Deep Learning" },
        { id: "LSTM", group: "skill", size: 17, parent: "Deep Learning" },
        { id: "Transformers", group: "skill", size: 18, parent: "Deep Learning" },
        { id: "GANs", group: "skill", size: 16, parent: "Deep Learning" },

        { id: "LangChain", group: "skill", size: 18, parent: "Generative AI" },
        { id: "LangGraph", group: "skill", size: 16, parent: "Generative AI" },
        { id: "RAG", group: "skill", size: 18, parent: "Generative AI" },
        { id: "LLMs", group: "skill", size: 20, parent: "Generative AI" },
        { id: "Prompt Eng", group: "skill", size: 16, parent: "Generative AI" },
        { id: "OpenAI API", group: "skill", size: 16, parent: "Generative AI" },

        { id: "Claude", group: "skill", size: 18, parent: "Vibe Coding" },
        { id: "Cursor", group: "skill", size: 18, parent: "Vibe Coding" },
        { id: "MCP", group: "skill", size: 17, parent: "Vibe Coding" },
        { id: "GitHub Copilot", group: "skill", size: 16, parent: "Vibe Coding" },
        { id: "Windsurf", group: "skill", size: 16, parent: "Vibe Coding" },
        { id: "Agentic AI", group: "skill", size: 16, parent: "Vibe Coding" },

        { id: "Pandas", group: "skill", size: 19, parent: "Data & Viz" },
        { id: "NumPy", group: "skill", size: 18, parent: "Data & Viz" },
        { id: "Plotly", group: "skill", size: 17, parent: "Data & Viz" },
        { id: "D3.js", group: "skill", size: 17, parent: "Data & Viz" },
        { id: "Streamlit", group: "skill", size: 18, parent: "Data & Viz" },
        { id: "Tableau", group: "skill", size: 16, parent: "Data & Viz" },

        { id: "Python", group: "skill", size: 20, parent: "Programming" },
        { id: "SQL", group: "skill", size: 18, parent: "Programming" },
        { id: "MATLAB", group: "skill", size: 16, parent: "Programming" },
        { id: "PostgreSQL", group: "skill", size: 16, parent: "Programming" },
        { id: "MongoDB", group: "skill", size: 16, parent: "Programming" },
        { id: "MySQL", group: "skill", size: 16, parent: "Programming" },

        { id: "Docker", group: "skill", size: 18, parent: "MLOps" },
        { id: "Git", group: "skill", size: 18, parent: "MLOps" },
        { id: "FastAPI", group: "skill", size: 17, parent: "MLOps" },
        { id: "HuggingFace", group: "skill", size: 17, parent: "MLOps" },
        { id: "FAISS", group: "skill", size: 16, parent: "MLOps" },
        { id: "ChromaDB", group: "skill", size: 16, parent: "MLOps" }
    ],
    links: [
        { source: "Skills", target: "Machine Learning", strength: 0.5 },
        { source: "Skills", target: "Deep Learning", strength: 0.5 },
        { source: "Skills", target: "Generative AI", strength: 0.5 },
        { source: "Skills", target: "Vibe Coding", strength: 0.5 },
        { source: "Skills", target: "Data & Viz", strength: 0.5 },
        { source: "Skills", target: "Programming", strength: 0.5 },
        { source: "Skills", target: "MLOps", strength: 0.5 },

        { source: "Machine Learning", target: "PyTorch", strength: 0.85 },
        { source: "Machine Learning", target: "TensorFlow", strength: 0.85 },
        { source: "Machine Learning", target: "Scikit-learn", strength: 0.85 },
        { source: "Machine Learning", target: "XGBoost", strength: 0.85 },
        { source: "Machine Learning", target: "LightGBM", strength: 0.85 },
        { source: "Machine Learning", target: "CatBoost", strength: 0.85 },

        { source: "Deep Learning", target: "Keras", strength: 0.85 },
        { source: "Deep Learning", target: "CNN", strength: 0.85 },
        { source: "Deep Learning", target: "RNN", strength: 0.85 },
        { source: "Deep Learning", target: "LSTM", strength: 0.85 },
        { source: "Deep Learning", target: "Transformers", strength: 0.85 },
        { source: "Deep Learning", target: "GANs", strength: 0.85 },

        { source: "Generative AI", target: "LangChain", strength: 0.85 },
        { source: "Generative AI", target: "LangGraph", strength: 0.85 },
        { source: "Generative AI", target: "RAG", strength: 0.85 },
        { source: "Generative AI", target: "LLMs", strength: 0.85 },
        { source: "Generative AI", target: "Prompt Eng", strength: 0.85 },
        { source: "Generative AI", target: "OpenAI API", strength: 0.85 },

        { source: "Vibe Coding", target: "Claude", strength: 0.85 },
        { source: "Vibe Coding", target: "Cursor", strength: 0.85 },
        { source: "Vibe Coding", target: "MCP", strength: 0.85 },
        { source: "Vibe Coding", target: "GitHub Copilot", strength: 0.85 },
        { source: "Vibe Coding", target: "Windsurf", strength: 0.85 },
        { source: "Vibe Coding", target: "Agentic AI", strength: 0.85 },

        { source: "Data & Viz", target: "Pandas", strength: 0.85 },
        { source: "Data & Viz", target: "NumPy", strength: 0.85 },
        { source: "Data & Viz", target: "Plotly", strength: 0.85 },
        { source: "Data & Viz", target: "D3.js", strength: 0.85 },
        { source: "Data & Viz", target: "Streamlit", strength: 0.85 },
        { source: "Data & Viz", target: "Tableau", strength: 0.85 },

        { source: "Programming", target: "Python", strength: 0.85 },
        { source: "Programming", target: "SQL", strength: 0.85 },
        { source: "Programming", target: "MATLAB", strength: 0.85 },
        { source: "Programming", target: "PostgreSQL", strength: 0.85 },
        { source: "Programming", target: "MongoDB", strength: 0.85 },
        { source: "Programming", target: "MySQL", strength: 0.85 },

        { source: "MLOps", target: "Docker", strength: 0.85 },
        { source: "MLOps", target: "Git", strength: 0.85 },
        { source: "MLOps", target: "FastAPI", strength: 0.85 },
        { source: "MLOps", target: "HuggingFace", strength: 0.85 },
        { source: "MLOps", target: "FAISS", strength: 0.85 },
        { source: "MLOps", target: "ChromaDB", strength: 0.85 }
    ]
};

const graphTheme = {
    accent: "#0071e3",
    nearBlack: "#1d1d1f",
    softGray: "#d2d2d7",
    surface: "#ffffff",
    link: "rgba(29, 29, 31, 0.22)",
    rootLink: "rgba(29, 29, 31, 0.36)",
    labelMuted: "rgba(0, 0, 0, 0.56)"
};

function getNodeFill(node) {
    if (node.group === "center") return graphTheme.nearBlack;
    if (node.group === "category") return graphTheme.softGray;
    return graphTheme.surface;
}

function isRootLink(linkDatum) {
    const sourceId = typeof linkDatum.source === "object" ? linkDatum.source.id : linkDatum.source;
    return sourceId === "Skills";
}

function connectedToNode(linkDatum, nodeId) {
    const sourceId = typeof linkDatum.source === "object" ? linkDatum.source.id : linkDatum.source;
    const targetId = typeof linkDatum.target === "object" ? linkDatum.target.id : linkDatum.target;
    return sourceId === nodeId || targetId === nodeId;
}

function categoryToolCount(categoryId) {
    return skillsData.nodes.filter((n) => n.parent === categoryId).length;
}

function initSkillsGraph() {
    const container = document.getElementById("skills-graph");
    if (!container || typeof d3 === "undefined") return;

    const width = container.offsetWidth;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    d3.select("#skills-graph").selectAll("*").remove();

    const svg = d3
        .select("#skills-graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    const g = svg.append("g");

    svg.call(
        d3
            .zoom()
            .scaleExtent([0.6, 2.2])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            })
    );

    const tooltip = d3.select("#skill-tooltip");
    const categories = skillsData.nodes.filter((n) => n.group === "category");
    const categoryRadius = Math.min(width, height) * 0.30;

    categories.forEach((cat, i) => {
        const angle = (i / categories.length) * 2 * Math.PI - Math.PI / 2;
        cat.x = centerX + categoryRadius * Math.cos(angle);
        cat.y = centerY + categoryRadius * Math.sin(angle);
    });

    const centerNode = skillsData.nodes.find((n) => n.group === "center");
    if (centerNode) {
        centerNode.x = centerX;
        centerNode.y = centerY;
        centerNode.fx = centerX;
        centerNode.fy = centerY;
    }

    const childRadius = 84;
    skillsData.nodes.filter((n) => n.parent).forEach((node) => {
        const parent = categories.find((c) => c.id === node.parent);
        if (!parent) return;

        const siblings = skillsData.nodes.filter((n) => n.parent === node.parent);
        const idx = siblings.indexOf(node);
        const parentAngle = Math.atan2(parent.y - centerY, parent.x - centerX);
        const spreadAngle = Math.PI * 0.82;
        const startAngle = parentAngle - spreadAngle / 2;
        const angle = startAngle + (idx / (siblings.length - 1 || 1)) * spreadAngle;

        node.x = parent.x + childRadius * Math.cos(angle);
        node.y = parent.y + childRadius * Math.sin(angle);
    });

    const simulation = d3
        .forceSimulation(skillsData.nodes)
        .force(
            "link",
            d3
                .forceLink(skillsData.links)
                .id((d) => d.id)
                .distance((d) => (isRootLink(d) ? categoryRadius : 64))
                .strength((d) => (isRootLink(d) ? 0.72 : 0.95))
        )
        .force(
            "charge",
            d3.forceManyBody().strength((d) => {
                if (d.group === "center") return -760;
                if (d.group === "category") return -320;
                return -115;
            })
        )
        .force("collision", d3.forceCollide().radius((d) => d.size + 8))
        .force(
            "radial",
            d3
                .forceRadial(
                    (d) => {
                        if (d.group === "center") return 0;
                        if (d.group === "category") return categoryRadius;
                        return categoryRadius + 88;
                    },
                    centerX,
                    centerY
                )
                .strength((d) => {
                    if (d.group === "center") return 1;
                    if (d.group === "category") return 0.3;
                    return 0.1;
                })
        );

    const link = g
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(skillsData.links)
        .join("line")
        .attr("stroke", (d) => (isRootLink(d) ? graphTheme.rootLink : graphTheme.link))
        .attr("stroke-width", (d) => (isRootLink(d) ? 2.1 : 1.3))
        .attr("stroke-opacity", 0.9);

    const node = g
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(skillsData.nodes)
        .join("g")
        .call(
            d3
                .drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
        );

    node
        .append("circle")
        .attr("r", (d) => d.size)
        .attr("fill", (d) => getNodeFill(d))
        .attr("stroke", (d) => (d.group === "center" ? "#ffffff" : "rgba(29, 29, 31, 0.14)"))
        .attr("stroke-width", (d) => (d.group === "center" ? 1.8 : 1.2))
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).transition().duration(180).attr("r", d.size * 1.08).attr("stroke", graphTheme.accent).attr("stroke-width", 2.4);

            link
                .attr("stroke-opacity", (l) => (connectedToNode(l, d.id) ? 1 : 0.14))
                .attr("stroke", (l) => (connectedToNode(l, d.id) ? graphTheme.accent : isRootLink(l) ? graphTheme.rootLink : graphTheme.link))
                .attr("stroke-width", (l) => (connectedToNode(l, d.id) ? (isRootLink(l) ? 3 : 2.1) : isRootLink(l) ? 2.1 : 1.3));

            const isCategory = d.group === "category";
            const metaLine = d.parent ? d.parent : (isCategory ? `${categoryToolCount(d.id)} tools` : "Core skill node");

            tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 14 + "px")
                .style("top", event.pageY - 14 + "px")
                .html(`
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="width:10px;height:10px;border-radius:50%;background:${graphTheme.accent};display:inline-block;"></span>
                        <strong>${d.id}</strong>
                    </div>
                    <div style="margin-top:4px;color:${graphTheme.labelMuted};font-size:0.8rem;">${metaLine}</div>
                `);
        })
        .on("mousemove", function (event) {
            tooltip.style("left", event.pageX + 14 + "px").style("top", event.pageY - 14 + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition()
                .duration(180)
                .attr("r", d.size)
                .attr("stroke", d.group === "center" ? "#ffffff" : "rgba(29, 29, 31, 0.14)")
                .attr("stroke-width", d.group === "center" ? 1.8 : 1.2);

            link
                .attr("stroke-opacity", 0.9)
                .attr("stroke", (l) => (isRootLink(l) ? graphTheme.rootLink : graphTheme.link))
                .attr("stroke-width", (l) => (isRootLink(l) ? 2.1 : 1.3));

            tooltip.style("opacity", 0);
        });

    node
        .append("text")
        .text((d) => d.id)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("font-family", "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif")
        .attr("font-size", (d) => {
            const base = d.size * 0.44;
            const len = d.id.length;
            if (len > 11) return Math.min(base, d.size * 0.31) + "px";
            if (len > 8) return Math.min(base, d.size * 0.36) + "px";
            return base + "px";
        })
        .attr("font-weight", (d) => {
            if (d.group === "center") return 600;
            if (d.group === "category") return 600;
            return 500;
        })
        .attr("fill", (d) => (d.group === "center" ? "#ffffff" : graphTheme.nearBlack))
        .style("pointer-events", "none")
        .style("letter-spacing", "-0.22px");

    simulation.on("tick", () => {
        link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        if (d.group === "center") {
            d.fx = centerX;
            d.fy = centerY;
            return;
        }
        d.fx = null;
        d.fy = null;
    }
}

document.addEventListener("DOMContentLoaded", initSkillsGraph);
window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(initSkillsGraph, 250);
});
