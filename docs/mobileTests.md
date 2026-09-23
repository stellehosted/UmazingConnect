# Mobile Testing Checklist

## Quick Test on Your Phone

### Step 1: Get Your Local IP
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Access on Phone
Visit: `http://YOUR_IP:3000`

Example: `http://192.168.1.100:3000`

---

## Test Checklist

### Navigation (Mobile Menu)
- [ ] Hamburger menu opens
- [ ] Menu items clickable
- [ ] User profile shows in menu
- [ ] Logout works

### Home Feed
- [ ] Posts load correctly
- [ ] Images display properly
- [ ] Like button works
- [ ] Load more button works
- [ ] Scrolling is smooth

### Clubs Page
- [ ] Club cards display correctly
- [ ] Images load
- [ ] Join button works
- [ ] Search works
- [ ] Category filter works
- [ ] Tabs switch properly

### Club Detail Page
- [ ] Hero image displays
- [ ] Back button works
- [ ] Join button works
- [ ] Posts show correctly
- [ ] Members list scrolls

### Profile Creation
- [ ] Form fields are accessible
- [ ] Dropdowns work
- [ ] Submit button works
- [ ] Keyboard doesn't cover inputs

### Dialogs/Modals
- [ ] Create post dialog opens
- [ ] Image upload works
- [ ] Text input works
- [ ] Submit works
- [ ] Close button works

### Performance
- [ ] Pages load in <3 seconds
- [ ] Scrolling is smooth (60fps)
- [ ] No layout shifts
- [ ] Images load progressively

### Touch Interactions
- [ ] Buttons are easy to tap (44x44px min)
- [ ] No accidental taps
- [ ] Swipe gestures work
- [ ] Pull to refresh (if implemented)

### Orientation
- [ ] Portrait mode works
- [ ] Landscape mode works
- [ ] Layout adjusts properly

### Different Devices
- [ ] Small phone (iPhone SE - 375px)
- [ ] Medium phone (iPhone 12 - 390px)
- [ ] Large phone (iPhone 14 Pro Max - 430px)
- [ ] Tablet (iPad - 768px)

---

## Common Issues to Check

### Text Readability
- [ ] Font size readable (min 14px)
- [ ] Sufficient contrast
- [ ] Line height comfortable
- [ ] No text overflow

### Images
- [ ] Proper aspect ratios
- [ ] No distortion
- [ ] Load quickly
- [ ] Fallback for failed loads

### Buttons
- [ ] Large enough to tap
- [ ] Proper spacing between buttons
- [ ] Visual feedback on tap
- [ ] Disabled state clear

### Forms
- [ ] Inputs large enough
- [ ] Labels visible
- [ ] Keyboard doesn't cover inputs
- [ ] Validation messages visible

### Navigation
- [ ] Easy to reach nav items
- [ ] Clear active state
- [ ] Back button works
- [ ] Breadcrumbs (if any)

---

## Browser Testing

### Chrome DevTools
1. Press F12
2. Click device icon (Ctrl+Shift+M)
3. Select device
4. Test!

### Devices to Test
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPhone 14 Pro Max (430x932)
- Samsung Galaxy S20 (360x800)
- iPad (768x1024)
- iPad Pro (1024x1366)

---

## Network Testing

### Throttle Network in DevTools
1. Open DevTools
2. Go to Network tab
3. Select throttling:
   - Fast 3G
   - Slow 3G
   - Offline

### Test:
- [ ] App loads on slow connection
- [ ] Loading states show
- [ ] Error handling works
- [ ] Retry mechanisms work

---

## Accessibility Testing

### Mobile Accessibility
- [ ] Text is zoomable
- [ ] Touch targets are large
- [ ] Color contrast sufficient
- [ ] Screen reader compatible
- [ ] Keyboard navigation works

---

## Performance Testing

### Lighthouse Mobile Audit
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Mobile"
4. Run audit

### Target Scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production (test production build)
npm run build
npm start

# Check for TypeScript errors
npm run type-check

# Run linter
npm run lint
```

---

## Troubleshooting

### Can't access from phone?
1. Check firewall settings
2. Ensure phone and computer on same WiFi
3. Try using ngrok
4. Check if port 3000 is open

### Slow loading?
1. Check network throttling
2. Optimize images
3. Check database queries
4. Enable caching

### Layout issues?
1. Check CSS media queries
2. Test different screen sizes
3. Check for fixed widths
4. Use responsive units (rem, %, vw)

---

## Advanced Testing

### Real Device Testing Services
- BrowserStack (paid)
- Sauce Labs (paid)
- LambdaTest (paid)
- AWS Device Farm (paid)

### Free Alternatives
- Chrome DevTools (free)
- Firefox Responsive Design Mode (free)
- Your own devices (free)
- Friends' devices (free)

---

## Automated Testing (Future)

```bash
# Install Playwright for mobile testing
npm install -D @playwright/test

# Run mobile tests
npx playwright test --project=mobile
```

---

## Notes

- Always test on real devices when possible
- Test with real content (not just lorem ipsum)
- Test with slow network
- Test with different user roles
- Test edge cases (long names, many posts, etc.)
