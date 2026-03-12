# The Hub Loading Animation

A premium loading animation that combines your coral laser line video with The Hub branding to create a sophisticated loading experience.

## 🎯 Features

- **Perfect Brand Integration**: Logo appears exactly when laser completes the threshold
- **Responsive Design**: Scales beautifully across all devices
- **Performance Optimized**: Hardware-accelerated animations
- **Easy Integration**: Drop-in solution for any website
- **Customizable**: Multiple configuration options
- **Production Ready**: Minified and optimized for fast loading

## 🚀 Quick Start

### 1. Download Files
```bash
# Your video file (already included)
coral_laser_line.mp4

# Minified JavaScript component
hub-loader.min.js
```

### 2. Basic Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <!-- Your main content (hidden initially) -->
    <div id="main-content" style="display: none;">
        <!-- Your website content here -->
    </div>

    <!-- Hub Loader -->
    <script src="assets/js/hub-loader.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            HubLoader.create({
                videoUrl: './assets/videos/coral_laser_line.mp4',
                onComplete: () => {
                    document.getElementById('main-content').style.display = 'block';
                }
            });
        });
    </script>
</body>
</html>
```

## ⚙️ Configuration Options

```javascript
HubLoader.create({
    // Video settings
    videoUrl: './assets/coral_laser_line.mp4', // Path to your video
    
    // Timing
    duration: 8000, // Total animation duration (ms)
    
    // UI Options
    showProgress: true, // Show progress bar
    skipOnClick: true,  // Allow click to skip
    autoStart: true,    // Start immediately
    
    // Callbacks
    onComplete: () => {
        // Your completion logic here
        showMainContent();
    }
});
```

## 📱 Responsive Design

The animation automatically adapts to different screen sizes:

- **Desktop**: Full cinematic experience
- **Tablet**: Scaled proportionally 
- **Mobile**: Optimized for smaller screens

## 🎨 Brand Guidelines

### Colors
- **Primary Coral**: #FF6B6B (matches your video)
- **Gradient**: #FF6B6B → #FF8E8E
- **Secondary**: #888 (sophisticated gray)
- **Background**: Pure black

### Typography
- **Font**: Inter (modern, clean)
- **Title Weight**: 800 (bold, impactful)
- **Subtitle Weight**: 400 (readable)

## 🔧 Advanced Integration

### React/Next.js
```jsx
import { useEffect, useState } from 'react';

function App() {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const HubLoader = require('./hub-loader.min.js');
            
            HubLoader.create({
                onComplete: () => setLoading(false)
            });
        }
    }, []);
    
    if (loading) return null;
    
    return <YourMainApp />;
}
```

### WordPress
```php
// functions.php
function enqueue_hub_loader() {
    wp_enqueue_script(
        'hub-loader',
        get_template_directory_uri() . '/assets/js/hub-loader.min.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_hub_loader');
```

## 📊 Performance

- **File Size**: ~6KB (minified JS) + 1.35MB (video)
- **Load Time**: Instant code execution + video buffering
- **Animation**: 60fps smooth with hardware acceleration
- **Compatibility**: All modern browsers

## 🎬 Animation Timeline

| Time | Event | Visual |
|------|-------|--------|
| 0s | Video starts | Laser line begins drawing |
| 1s | Progress appears | Subtle loading indicator |
| 0-5s | Line formation | Creates the threshold |
| 5s | **Logo reveal** | "The Hub." appears in center |
| 5-8s | Brand moment | Complete branding display |
| 8s | Completion | Fade out and callback |

## 🛠️ Customization

### Change Colors
```css
/* Override coral color */
:root {
    --hub-coral: #your-color;
}
```

### Modify Timing
```javascript
HubLoader.create({
    duration: 10000, // Longer display
});
```

### Custom Video
```javascript
HubLoader.create({
    videoUrl: './your-custom-video.mp4',
});
```

## 📁 File Structure

```
your-website/
├── assets/
│   ├── videos/
│   │   └── coral_laser_line.mp4
│   └── js/
│       └── hub-loader.min.js
├── index.html
└── README.md
```

## 🎯 Best Practices

1. **Preload Video**: Use `<link rel="preload">` for instant playback
2. **Load Assets in Parallel**: Load your content while animation plays
3. **Progressive Enhancement**: Provide fallbacks for older browsers
4. **Track Performance**: Monitor loading times and user engagement

## 🔍 Browser Support

- Chrome 60+
- Safari 12+
- Firefox 60+
- Edge 79+
- iOS Safari 12+
- Chrome Mobile 60+

## 📝 Events

```javascript
// Listen for completion
document.addEventListener('hubLoadingComplete', (event) => {
    console.log('Loading animation complete');
    console.log('Loader instance:', event.detail.loader);
});
```

## 🚨 Troubleshooting

### Video Not Playing
- Ensure video file path is correct
- Check MIME type is `video/mp4`
- Verify server serves video files properly

### Animation Not Smooth
- Enable hardware acceleration in browser
- Check for conflicting CSS animations
- Ensure adequate system resources

### Mobile Issues
- Test on actual devices, not just browser dev tools
- Check video format compatibility
- Verify touch events work for skip functionality

## 📞 Support

For implementation help or customization requests, refer to the integration examples or create an issue in your project repository.

## 📄 License

This loading animation is custom-built for The Hub brand. All rights reserved.