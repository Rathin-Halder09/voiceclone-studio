# GitHub Pages এ Deploy করার সম্পূর্ণ গাইড

## 🚀 দ্রুত Deploy (৫ মিনিটে)

### ধাপ ১: GitHub Repository তৈরি করুন

1. GitHub.com এ যান
2. উপরে ডানদিকে **"+"** ক্লিক করুন → **"New repository"**
3. Repository name দিন, যেমন: `voiceclone-studio`
4. **Public** সিলেক্ট করুন (GitHub Pages এর জন্য)
5. **"Create repository"** ক্লিক করুন

### ধাপ ২: আপনার কোড GitHub এ Push করুন

Terminal এ এই commands চালান:

```bash
# আপনার প্রজেক্ট ফোল্ডারে যান
cd voiceclone-studio

# Git initialize করুন
git init

# সব ফাইল add করুন
git add .

# প্রথম commit
git commit -m "Initial commit: VoiceClone Studio Pro"

# Main branch এ নাম দিন
git branch -M main

# GitHub repository যোগ করুন (YOUR_USERNAME এবং YOUR_REPO পরিবর্তন করুন)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push করুন
git push -u origin main
```

### ধাপ ৩: GitHub Pages Enable করুন

1. GitHub repository page এ যান
2. **Settings** ট্যাবে ক্লিক করুন
3. বামদিকে **Pages** ক্লিক করুন
4. **Source** এ **"GitHub Actions"** সিলেক্ট করুন
5. স্বয়ংক্রিয়ভাবে deploy শুরু হবে!

### ধাপ ৪: Deploy Status দেখুন

1. Repository তে **Actions** ট্যাবে যান
2. "Deploy to GitHub Pages" workflow চলছে দেখবেন
3. সবুজ tick mark আসলে deploy সফল হয়েছে!

### ধাপ ৫: আপনার Live URL

আপনার অ্যাপ্লিকেশন এই URL এ available হবে:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

উদাহরণ: `https://rathin.github.io/voiceclone-studio/`

---

## 🔄 Automatic Updates

এখন থেকে যখনই আপনি কোড পরিবর্তন করে push করবেন, স্বয়ংক্রিয়ভাবে deploy হবে:

```bash
# পরিবর্তন করার পর
git add .
git commit -m "Updated features"
git push

# ২-৩ মিনিট পর automatically deploy হবে!
```

---

## ⚠️ গুরুত্বপূর্ণ বিষয়

### প্রথম Deploy এর পর URL পরিবর্তন করতে হলে:

যদি আপনার repository এর নাম পরিবর্তন করেন, তাহলে:

1. `vite.config.js` এ `base` পরিবর্তন করুন
2. আবার commit ও push করুন

### Microphone Permission:

GitHub Pages HTTPS provide করে, তাই microphone access কাজ করবে।

### Custom Domain ব্যবহার করতে চাইলে:

1. GitHub repository → Settings → Pages
2. "Custom domain" এ আপনার domain দিন
3. DNS settings এ CNAME record যোগ করুন

---

## 🐛 Troubleshooting

### Deploy হচ্ছে না?

1. **Actions** ট্যাবে যান
2. Failed workflow এ ক্লিক করুন
3. Error log দেখুন
4. সাধারণ সমস্যা:
   - Node version সমস্যা → workflow file এ Node version পরিবর্তন করুন
   - Build error → `npm run build` locally চালান আগে

### Page load হচ্ছে না?

- ২-৩ মিনিট অপেক্ষা করুন (প্রথম deploy এ সময় লাগে)
- Browser cache clear করুন
- Incognito mode এ চেষ্টা করুন

### Assets load হচ্ছে না?

- `vite.config.js` এ `base` path ঠিক আছে কিনা চেক করুন
- Repository name এবং base path মিলতে হবে

---

## 📱 শেয়ার করার উপায়

Deploy হয়ে গেলে এই URL টি শেয়ার করুন:

```
🎤 VoiceClone Studio - Personal Voice Cloning

আপনার নিজের ভয়েস ক্লোন করুন এবং বাংলা/ইংরেজিতে স্পিচ জেনারেট করুন!

🔗 Link: https://YOUR_USERNAME.github.io/YOUR_REPO/

✅ বাংলা ও ইংরেজি সাপোর্ট
✅ Real-time voice analysis
✅ Quality testing lab
✅ Privacy-first design
```

---

## 🎯 Quick Commands Summary

```bash
# প্রথমবার setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# পরবর্তী updates
git add .
git commit -m "Update description"
git push
```

---

## ✅ Checklist

- [ ] GitHub repository তৈরি করেছেন (Public)
- [ ] Git install আছে
- [ ] কোড push করেছেন
- [ ] Settings → Pages → GitHub Actions enable করেছেন
- [ ] Actions ট্যাবে deploy সফল হয়েছে দেখেছেন
- [ ] Live URL এ অ্যাপ্লিকেশন কাজ করছে

---

সবকিছু ঠিকমতো করলে ৫-১০ মিনিটের মধ্যে আপনার অ্যাপ্লিকেশন live হয়ে যাবে! 🎉

কোনো সমস্যা হলে Actions tab এ error log দেখুন বা আমাকে জানান।
