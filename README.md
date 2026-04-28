# 🎯 Real-Time Object Detection

A real-time object detection app using your webcam, powered by **TensorFlow.js** and the **COCO-SSD** model. Detects 80 different object classes live in your browser — no server required.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.x-FF6F00?logo=tensorflow)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## ✨ Features

- 📷 Live webcam feed with real-time bounding boxes
- 🤖 80 object classes (person, car, dog, phone, chair, etc.)
- 📊 Live FPS counter and confidence scores
- 🚀 Runs 100% in the browser — no backend needed
- 🌐 Deployable to GitHub Pages for free

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+ installed
- A webcam

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/realtime-object-detection.git
cd realtime-object-detection

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser and click **Start Detection**.

---

## 🌍 Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it `realtime-object-detection`
3. Keep it public, click **Create repository**

### Step 2 — Update vite.config.js
Open `vite.config.js` and change the `base` to match your repo name:
```js
base: '/realtime-object-detection/',
```

### Step 3 — Push your code
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/realtime-object-detection.git
git push -u origin main
```

### Step 4 — Deploy
```bash
npm run deploy
```

This builds the app and pushes it to the `gh-pages` branch automatically.

### Step 5 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select branch: `gh-pages` / folder: `/ (root)`
3. Click **Save**

After ~1 minute your app will be live at:
```
https://YOUR_USERNAME.github.io/realtime-object-detection/
```

---

## 📁 Project Structure

```
realtime-object-detection/
├── src/
│   ├── components/
│   │   ├── useObjectDetection.js   # TF.js model + webcam hook
│   │   └── DetectionPanel.jsx      # Sidebar with detected objects
│   ├── App.jsx                     # Main layout
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles
├── index.html
├── vite.config.js                  # Vite + GitHub Pages base path
├── package.json
└── README.md
```

## 🏷️ Detectable Objects (80 classes)

Person, bicycle, car, motorcycle, airplane, bus, train, truck, boat, traffic light, fire hydrant, stop sign, parking meter, bench, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, TV, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissors, teddy bear, hair drier, toothbrush.

---

## 📝 License
MIT
