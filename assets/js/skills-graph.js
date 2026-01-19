// Skills Graph Data - Vibrant Colorful Version
const skillsData = {
    nodes: [
        // Center node
        { id: "Skills", group: "center", size: 55, color: "#6366f1" },
        
        // Category nodes (second level) - Bright vibrant colors
        { id: "Machine Learning", group: "category", size: 38, color: "#3b82f6" },
        { id: "Deep Learning", group: "category", size: 38, color: "#8b5cf6" },
        { id: "Generative AI", group: "category", size: 38, color: "#06b6d4" },
        { id: "Vibe Coding", group: "category", size: 38, color: "#ec4899" },
        { id: "Data & Viz", group: "category", size: 38, color: "#10b981" },
        { id: "Programming", group: "category", size: 38, color: "#f59e0b" },
        { id: "MLOps", group: "category", size: 38, color: "#ef4444" },
        
        // ML tools - Blue shades (brighter)
        { id: "PyTorch", group: "ml", size: 22, color: "#60a5fa", parent: "Machine Learning" },
        { id: "TensorFlow", group: "ml", size: 22, color: "#3b82f6", parent: "Machine Learning" },
        { id: "Scikit-learn", group: "ml", size: 20, color: "#2563eb", parent: "Machine Learning" },
        { id: "XGBoost", group: "ml", size: 18, color: "#1d4ed8", parent: "Machine Learning" },
        { id: "LightGBM", group: "ml", size: 18, color: "#3b82f6", parent: "Machine Learning" },
        { id: "CatBoost", group: "ml", size: 18, color: "#60a5fa", parent: "Machine Learning" },
        
        // Deep Learning tools - Purple shades (brighter)
        { id: "Keras", group: "dl", size: 22, color: "#a78bfa", parent: "Deep Learning" },
        { id: "CNN", group: "dl", size: 22, color: "#8b5cf6", parent: "Deep Learning" },
        { id: "RNN", group: "dl", size: 18, color: "#a78bfa", parent: "Deep Learning" },
        { id: "LSTM", group: "dl", size: 22, color: "#7c3aed", parent: "Deep Learning" },
        { id: "Transformers", group: "dl", size: 20, color: "#8b5cf6", parent: "Deep Learning" },
        { id: "GANs", group: "dl", size: 18, color: "#a78bfa", parent: "Deep Learning" },
        
        // Generative AI tools - Cyan shades (brighter)
        { id: "LangChain", group: "genai", size: 22, color: "#22d3ee", parent: "Generative AI" },
        { id: "LangGraph", group: "genai", size: 18, color: "#06b6d4", parent: "Generative AI" },
        { id: "RAG", group: "genai", size: 22, color: "#22d3ee", parent: "Generative AI" },
        { id: "LLMs", group: "genai", size: 24, color: "#06b6d4", parent: "Generative AI" },
        { id: "Prompt Eng", group: "genai", size: 18, color: "#22d3ee", parent: "Generative AI" },
        { id: "OpenAI API", group: "genai", size: 18, color: "#06b6d4", parent: "Generative AI" },
        
        // Vibe Coding tools - Pink/Magenta shades (brighter)
        { id: "Claude", group: "vibe", size: 24, color: "#f472b6", parent: "Vibe Coding" },
        { id: "Cursor", group: "vibe", size: 22, color: "#ec4899", parent: "Vibe Coding" },
        { id: "MCP", group: "vibe", size: 22, color: "#f472b6", parent: "Vibe Coding" },
        { id: "GitHub Copilot", group: "vibe", size: 20, color: "#ec4899", parent: "Vibe Coding" },
        { id: "Windsurf", group: "vibe", size: 18, color: "#f472b6", parent: "Vibe Coding" },
        { id: "Agentic AI", group: "vibe", size: 20, color: "#ec4899", parent: "Vibe Coding" },
        
        // Data & Visualization tools - Green shades (brighter)
        { id: "Pandas", group: "data", size: 24, color: "#34d399", parent: "Data & Viz" },
        { id: "NumPy", group: "data", size: 22, color: "#10b981", parent: "Data & Viz" },
        { id: "Plotly", group: "data", size: 20, color: "#34d399", parent: "Data & Viz" },
        { id: "D3.js", group: "data", size: 20, color: "#10b981", parent: "Data & Viz" },
        { id: "Streamlit", group: "data", size: 22, color: "#34d399", parent: "Data & Viz" },
        { id: "Tableau", group: "data", size: 18, color: "#10b981", parent: "Data & Viz" },
        
        // Programming tools - Amber/Orange shades (brighter)
        { id: "Python", group: "prog", size: 26, color: "#fbbf24", parent: "Programming" },
        { id: "SQL", group: "prog", size: 22, color: "#f59e0b", parent: "Programming" },
        { id: "MATLAB", group: "prog", size: 18, color: "#fbbf24", parent: "Programming" },
        { id: "PostgreSQL", group: "prog", size: 18, color: "#f59e0b", parent: "Programming" },
        { id: "MongoDB", group: "prog", size: 18, color: "#fbbf24", parent: "Programming" },
        { id: "MySQL", group: "prog", size: 18, color: "#f59e0b", parent: "Programming" },
        
        // MLOps tools - Red shades (brighter)
        { id: "Docker", group: "mlops", size: 22, color: "#f87171", parent: "MLOps" },
        { id: "Git", group: "mlops", size: 22, color: "#ef4444", parent: "MLOps" },
        { id: "FastAPI", group: "mlops", size: 20, color: "#f87171", parent: "MLOps" },
        { id: "HuggingFace", group: "mlops", size: 20, color: "#ef4444", parent: "MLOps" },
        { id: "FAISS", group: "mlops", size: 18, color: "#f87171", parent: "MLOps" },
        { id: "ChromaDB", group: "mlops", size: 18, color: "#ef4444", parent: "MLOps" }
    ],
    links: [
        // Center to categories
        { source: "Skills", target: "Machine Learning", strength: 0.4 },
        { source: "Skills", target: "Deep Learning", strength: 0.4 },
        { source: "Skills", target: "Generative AI", strength: 0.4 },
        { source: "Skills", target: "Vibe Coding", strength: 0.4 },
        { source: "Skills", target: "Data & Viz", strength: 0.4 },
        { source: "Skills", target: "Programming", strength: 0.4 },
        { source: "Skills", target: "MLOps", strength: 0.4 },
        
        // ML connections
        { source: "Machine Learning", target: "PyTorch", strength: 0.8 },
        { source: "Machine Learning", target: "TensorFlow", strength: 0.8 },
        { source: "Machine Learning", target: "Scikit-learn", strength: 0.8 },
        { source: "Machine Learning", target: "XGBoost", strength: 0.8 },
        { source: "Machine Learning", target: "LightGBM", strength: 0.8 },
        { source: "Machine Learning", target: "CatBoost", strength: 0.8 },
        
        // Deep Learning connections
        { source: "Deep Learning", target: "Keras", strength: 0.8 },
        { source: "Deep Learning", target: "CNN", strength: 0.8 },
        { source: "Deep Learning", target: "RNN", strength: 0.8 },
        { source: "Deep Learning", target: "LSTM", strength: 0.8 },
        { source: "Deep Learning", target: "Transformers", strength: 0.8 },
        { source: "Deep Learning", target: "GANs", strength: 0.8 },
        
        // Generative AI connections
        { source: "Generative AI", target: "LangChain", strength: 0.8 },
        { source: "Generative AI", target: "LangGraph", strength: 0.8 },
        { source: "Generative AI", target: "RAG", strength: 0.8 },
        { source: "Generative AI", target: "LLMs", strength: 0.8 },
        { source: "Generative AI", target: "Prompt Eng", strength: 0.8 },
        { source: "Generative AI", target: "OpenAI API", strength: 0.8 },
        
        // Vibe Coding connections
        { source: "Vibe Coding", target: "Claude", strength: 0.8 },
        { source: "Vibe Coding", target: "Cursor", strength: 0.8 },
        { source: "Vibe Coding", target: "MCP", strength: 0.8 },
        { source: "Vibe Coding", target: "GitHub Copilot", strength: 0.8 },
        { source: "Vibe Coding", target: "Windsurf", strength: 0.8 },
        { source: "Vibe Coding", target: "Agentic AI", strength: 0.8 },
        
        // Data & Visualization connections
        { source: "Data & Viz", target: "Pandas", strength: 0.8 },
        { source: "Data & Viz", target: "NumPy", strength: 0.8 },
        { source: "Data & Viz", target: "Plotly", strength: 0.8 },
        { source: "Data & Viz", target: "D3.js", strength: 0.8 },
        { source: "Data & Viz", target: "Streamlit", strength: 0.8 },
        { source: "Data & Viz", target: "Tableau", strength: 0.8 },
        
        // Programming connections
        { source: "Programming", target: "Python", strength: 0.8 },
        { source: "Programming", target: "SQL", strength: 0.8 },
        { source: "Programming", target: "MATLAB", strength: 0.8 },
        { source: "Programming", target: "PostgreSQL", strength: 0.8 },
        { source: "Programming", target: "MongoDB", strength: 0.8 },
        { source: "Programming", target: "MySQL", strength: 0.8 },
        
        // MLOps connections
        { source: "MLOps", target: "Docker", strength: 0.8 },
        { source: "MLOps", target: "Git", strength: 0.8 },
        { source: "MLOps", target: "FastAPI", strength: 0.8 },
        { source: "MLOps", target: "HuggingFace", strength: 0.8 },
        { source: "MLOps", target: "FAISS", strength: 0.8 },
        { source: "MLOps", target: "ChromaDB", strength: 0.8 }
    ]
};

// Category color mapping for links
const categoryColors = {
    "Machine Learning": "#3b82f6",
    "Deep Learning": "#8b5cf6",
    "Generative AI": "#06b6d4",
    "Data & Viz": "#10b981",
    "Programming": "#f59e0b",
    "MLOps": "#ef4444"
};

// Initialize the graph
function initSkillsGraph() {
    const container = document.getElementById('skills-graph');
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = 600;
    
    // Clear any existing SVG
    d3.select('#skills-graph').selectAll('*').remove();
    
    const svg = d3.select('#skills-graph')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);
    
    // Add gradient definitions
    const defs = svg.append('defs');
    
    // Create radial gradients for each node
    skillsData.nodes.forEach(node => {
        const gradient = defs.append('radialGradient')
            .attr('id', `gradient-${node.id.replace(/\s+/g, '-')}`)
            .attr('cx', '30%')
            .attr('cy', '30%')
            .attr('r', '70%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', d3.color(node.color).brighter(0.8));
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', node.color);
    });
    
    // Add zoom behavior
    const g = svg.append('g');
    
    svg.call(d3.zoom()
        .scaleExtent([0.4, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        }));
    
    // Create tooltip
    const tooltip = d3.select('#skill-tooltip');
    
    // Create force simulation
    const simulation = d3.forceSimulation(skillsData.nodes)
        .force('link', d3.forceLink(skillsData.links)
            .id(d => d.id)
            .distance(d => {
                if (d.source.group === 'center' || d.source === 'Skills') return 140;
                return 70;
            })
            .strength(d => d.strength || 0.5))
        .force('charge', d3.forceManyBody()
            .strength(d => {
                if (d.group === 'center') return -1000;
                if (d.group === 'category') return -500;
                return -200;
            }))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.size + 15));
    
    // Create links
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(skillsData.links)
        .join('line')
        .attr('stroke', (d, i) => {
            // Get source node color for colored links
            const sourceNode = skillsData.nodes.find(n => n.id === d.source || n.id === d.source.id);
            if (sourceNode && sourceNode.group === 'category') {
                return sourceNode.color;
            }
            if (sourceNode && sourceNode.group === 'center') {
                return '#94a3b8';
            }
            return '#cbd5e1';
        })
        .attr('stroke-width', d => {
            if (d.source === 'Skills' || d.source.id === 'Skills') return 2.5;
            return 1.5;
        })
        .attr('stroke-opacity', 0.5);
    
    // Create nodes
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(skillsData.nodes)
        .join('g')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add circles to nodes with gradients (no stroke)
    node.append('circle')
        .attr('r', d => d.size)
        .attr('fill', d => `url(#gradient-${d.id.replace(/\s+/g, '-')})`)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.size * 1.15);
            
            // Highlight connected links
            link.attr('stroke-opacity', l => 
                (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.15
            ).attr('stroke-width', l => 
                (l.source.id === d.id || l.target.id === d.id) ? 
                    (l.source === 'Skills' || l.source.id === 'Skills' ? 3.5 : 2.5) : 
                    (l.source === 'Skills' || l.source.id === 'Skills' ? 2.5 : 1.5)
            );
            
            tooltip
                .style('opacity', 1)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 15) + 'px')
                .html(`
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="width: 12px; height: 12px; border-radius: 50%; background: ${d.color};"></span>
                        <strong>${d.id}</strong>
                    </div>
                    ${d.parent ? `<div style="color: #64748b; margin-top: 4px; font-size: 0.85rem;">📁 ${d.parent}</div>` : ''}
                    ${d.group === 'category' ? `<div style="color: #64748b; margin-top: 4px; font-size: 0.85rem;">6 tools</div>` : ''}
                `);
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.size);
            
            // Reset links
            link.attr('stroke-opacity', 0.5)
                .attr('stroke-width', l => 
                    l.source === 'Skills' || l.source.id === 'Skills' ? 2.5 : 1.5
                );
            
            tooltip.style('opacity', 0);
        });
    
    // Add text INSIDE all nodes
    node.append('text')
        .text(d => d.id)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', d => {
            // Scale font size based on node size and text length
            const baseSize = d.size * 0.65;
            const textLength = d.id.length;
            // Reduce size for longer text to fit inside circle
            if (textLength > 10) return Math.min(baseSize, d.size * 0.45) + 'px';
            if (textLength > 6) return Math.min(baseSize, d.size * 0.55) + 'px';
            return baseSize + 'px';
        })
        .attr('font-weight', d => {
            if (d.group === 'center') return '800';
            if (d.group === 'category') return '700';
            return '600';
        })
        .attr('fill', '#1e293b')
        .style('pointer-events', 'none');
    
    // Update positions on tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
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
        d.fx = null;
        d.fy = null;
    }
}

// Initialize on load and resize
document.addEventListener('DOMContentLoaded', initSkillsGraph);
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(initSkillsGraph, 250);
});
