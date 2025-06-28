# Jishnu Prasad - Portfolio

My personal portfolio website showcasing my experience as a DevOps Engineer & Site Reliability Expert.

## 🚀 Live Site

Visit my portfolio at: [https://j1shnu.github.io](https://j1shnu.github.io)

## 🛠️ Built With

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **GitHub Pages** - Hosting

## 📁 Project Structure

```
portfolio-2025/
├── src/
│   ├── data/
│   │   └── portfolio.json    # All personal data (easily editable)
│   ├── types/
│   │   └── portfolio.ts      # TypeScript interfaces
│   └── App.tsx              # Main component
├── public/
│   └── resume.pdf           # Resume file
└── .github/workflows/
    └── deploy.yml           # GitHub Actions deployment
```

## 🎨 Features

- **Responsive Design** - Works on all devices
- **Smooth Animations** - Intersection Observer animations
- **Data-Driven** - All content in JSON file for easy updates
- **Type Safe** - Full TypeScript support
- **Auto-Deploy** - GitHub Actions automatically deploys on push

## 📝 How to Edit Content

All personal data is stored in `src/data/portfolio.json`. You can easily update:

- Personal information (name, title, bio)
- Work experience
- Skills and technologies
- Projects
- Contact information
- Profile image

See `src/data/README.md` for detailed editing instructions.

## 🚀 Deployment

This portfolio is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch triggers a new deployment.

### Manual Deployment

If needed, you can deploy manually:

```bash
npm run build
npm run deploy
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).