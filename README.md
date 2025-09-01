# 🎯 3D Model Gallery

A simple GitHub Pages website to showcase your 3D models with sharing capabilities.

## 📁 Repository Structure

```
your-repository/
├── index.html          # Main website file
├── README.md          # This file
└── models/            # 📁 Your 3D models folder
    ├── model1.glb     # Your first model
    ├── model2.glb     # Your second model
    └── model3.glb     # Your third model
```

## 🚀 Setup Instructions

### Step 1: Create the Repository
1. Create a new GitHub repository
2. Upload the `index.html` file
3. Create a folder named `models`

### Step 2: Upload Your 3D Models
1. Put your `.glb` or `.gltf` files in the `models` folder
2. Supported formats: GLB, GLTF
3. Recommended: Use GLB format for better compatibility

### Step 3: Update the Models List
Edit the `index.html` file and update this section:

```javascript
const models = [
    { name: "My Awesome Model", file: "models/awesome.glb" },
    { name: "Cool Character", file: "models/character.glb" },
    { name: "Vehicle Design", file: "models/car.glb" },
    // Add more models here
];
```

### Step 4: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select "Deploy from branch" → "main" → "/ (root)"
4. Wait 5-10 minutes for deployment

## 🌐 Your Website URL
Your gallery will be available at:
- `https://username.github.io/repository-name`

## ✨ Features

- 📱 **Mobile Friendly**: Works on all devices
- 🔗 **Shareable Links**: Each model gets its own link
- 📱 **QR Codes**: Auto-generated for easy mobile sharing
- 🖼️ **Gallery View**: Thumbnail previews of all models
- 📺 **Fullscreen Mode**: Immersive viewing experience
- 🎮 **Interactive Controls**: Rotate, zoom, and explore models

## 📤 Sharing Models

1. Click the "📤 Share" button on any model
2. Get a direct link to that specific model
3. QR code is automatically generated
4. Share with anyone - no GitHub account needed!

## 🔧 Adding New Models

1. Upload your `.glb` or `.gltf` file to the `models` folder
2. Edit `index.html` and add to the models array:
   ```javascript
   { name: "Your Model Name", file: "models/yourfile.glb" }
   ```
3. Commit changes - your model will appear automatically!

## 📝 Model Requirements

- **Format**: GLB or GLTF
- **Size**: Keep under 50MB for best performance
- **Optimization**: Use compressed textures when possible

## 🐛 Troubleshooting

**Models not loading?**
- Check file names match exactly in the code
- Ensure models are in the `models` folder
- Wait a few minutes for GitHub Pages to update

**Site not updating?**
- Clear browser cache (Ctrl+F5)
- Check GitHub Actions tab for deployment status
- Ensure changes are committed to main branch

## 💡 Tips

- Use descriptive model names in the array
- Test models locally before uploading
- Keep file sizes reasonable for web viewing
- Use GLB format for single-file convenience

---

🎯 **Ready to showcase your 3D creations to the world!**
