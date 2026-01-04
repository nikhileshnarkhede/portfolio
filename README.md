# Nikhilesh Narkhede - Portfolio Website

Personal portfolio website showcasing my research in Data Science, Machine Learning, and Additive Manufacturing.

## 🚀 Live Demo

Visit: `https://nikhileshnarkhede.github.io/portfolio`

## 📁 Structure

```
portfolio/
├── index.html          # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css   # Stylesheet
│   ├── js/
│   │   └── main.js     # JavaScript
│   └── images/         # Images folder (add profile pic here)
├── projects/           # Project detail pages (optional)
├── .gitignore
└── README.md
```

## 🛠️ Deploy to GitHub Pages

1. **Initialize Git**
   ```bash
   cd D:\ML_AI\LLM\portfolio
   git init
   git add .
   git commit -m "Initial commit - portfolio website"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/nikhileshnarkhede/portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Click **Save**

Your site will be live at: `https://nikhileshnarkhede.github.io/portfolio`

## ✏️ Customization

### Add Profile Image
1. Place your photo in `assets/images/profile.jpg`
2. Add to HTML: `<img src="assets/images/profile.jpg" alt="Nikhilesh Narkhede">`

### Modify Colors
Edit `assets/css/style.css` - CSS variables at the top:
```css
:root {
    --primary: #2563eb;      /* Main accent color */
    --gradient: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
}
```

## 📱 Features

- ✅ Fully responsive (mobile-friendly)
- ✅ Smooth scroll navigation
- ✅ Animated content on scroll
- ✅ Timeline for experience
- ✅ Project cards with GitHub links
- ✅ Publications section with DOI links
- ✅ Skills categorized grid
- ✅ Education section
- ✅ Fast loading (minimal dependencies)

## 📄 License

MIT License
