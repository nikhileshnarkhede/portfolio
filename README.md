# Nikhilesh Narkhede - Portfolio Website

Personal portfolio website showcasing my research in Data Science, Machine Learning, and Additive Manufacturing. Includes an AI-powered chatbot for recruiters to interact with my profile directly.

## 🚀 Live Demo

👉 [Portfolio](https://nikhileshnarkhede.github.io/portfolio)

👉 [Chat with Me](https://nikhileshportfoliochatbot.streamlit.app) — also available as a floating widget on the portfolio site

---

## 📁 Structure

```
portfolio/
├── index.html                  # Main HTML file (includes chatbot widget)
├── assets/
│   ├── css/
│   │   └── style.css           # Stylesheet
│   ├── js/
│   │   ├── main.js             # Main JavaScript
│   │   └── skills-graph.js     # Interactive D3.js skills graph
│   └── images/                 # Images folder
├── projects/                   # Individual project detail pages
├── chatbot/                    # AI-powered recruiter chatbot (separate repo)
├── .gitignore
└── README.md
```

---

## 🤖 Chatbot Integration

The portfolio includes a floating **💬 Chat with Me** button (bottom-right corner) that opens an AI-powered chatbot in a modal. Recruiters can ask about skills, projects, research, and experience — and get instant, personality-driven answers.

### How It Works
- Built with **RAG (Retrieval-Augmented Generation)** using LangChain, FAISS, and Groq (Llama 3.3 70B)
- Embedded via an iframe with `?embed=true` to hide the Streamlit header/footer
- Iframe embedding enabled via `.streamlit/config.toml` in the chatbot repo

### Chatbot Repo
👉 [github.com/nikhileshnarkhede/portfolio-chatbot](https://github.com/nikhileshnarkhede/portfolio-chatbot)

---

## 🛠️ Deploy to GitHub Pages

**1. Initialize Git**
```bash
cd portfolio
git init
git add .
git commit -m "Initial commit - portfolio website"
```

**2. Push to GitHub**
```bash
git remote add origin https://github.com/nikhileshnarkhede/portfolio.git
git branch -M main
git push -u origin main
```

**3. Enable GitHub Pages**
- Go to repository **Settings** → **Pages**
- Source: Deploy from a branch
- Branch: `main` / `root`
- Click **Save**

Your site will be live at: `https://nikhileshnarkhede.github.io/portfolio`

---

## ✏️ Customization

### Add Profile Image
1. Place your photo in `assets/images/profile.jpg`
2. Add to HTML: `<img src="assets/images/profile.jpg" alt="Nikhilesh Narkhede">`

### Modify Colors
Edit `assets/css/style.css` — CSS variables at the top:
```css
:root {
    --primary: #2563eb;      /* Main accent color */
    --gradient: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}
```

### Update Chatbot URL
If you redeploy the chatbot to a new Streamlit URL, update the iframe `src` in `index.html`:
```html
<iframe src="https://YOUR-NEW-URL.streamlit.app/?embed=true" ...></iframe>
```

---

## 📱 Features

- ✅ Fully responsive (mobile-friendly)
- ✅ Smooth scroll navigation
- ✅ Animated content on scroll
- ✅ Timeline for experience
- ✅ Project cards with GitHub links
- ✅ Publications section with DOI links
- ✅ Interactive D3.js skills graph
- ✅ Education & certification section
- ✅ AI-powered chatbot widget (RAG + Groq)
- ✅ Fast loading (minimal dependencies)

---

## 📬 Contact

| | |
|---|---|
| **Email** | narkhede.nikhilesh@gmail.com |
| **LinkedIn** | [linkedin.com/in/nikhileshnarkhede](https://www.linkedin.com/in/nikhileshnarkhede) |
| **GitHub** | [github.com/nikhileshnarkhede](https://github.com/nikhileshnarkhede) |

---

## 📄 License

MIT License
