# Mobile-Specific Tests
## Navigation (Mobile Menu)
- Bottom Navbar is in screen safe area

## Home Feed
- Posts load correctly
- Images display properly
- Like button works
- Load more button works
- Scrolling is smooth

## Clubs Page
- Club cards display correctly
- Images load
- Join button works
- Search works
- Tabs switch properly

## Club Detail Page
- Hero image displays
- Back button works
- Join button works
- Posts show correctly
- Members list scrolls

## Profile Creation
- Form fields are accessible
- Dropdowns work
- Submit button works
- Keyboard doesn't cover inputs

## Dialogs/Modals
- Create post dialog opens
- Image upload works
- Text input works
- Submit works
- Close button works

## Performance
- Pages load in <3 seconds
- Scrolling is smooth (60fps)
- No layout shifts
- Images load progressively

## Touch Interactions
- Buttons are easy to tap (44x44px min)
- No accidental taps
- Swipe gestures work
- Pull to refresh (if implemented)

## Orientation
- Portrait mode works
- Landscape mode works
- Layout adjusts properly

## Devices
- Small phone (iPhone SE)
- Medium phone (iPhone 15)
- Large phone (iPhone 15 Pro Max)
- Tablet (iPad Pro)

---
# Issues to Check

## Text Readability
- Font size readable (min 14px)
- Sufficient contrast
- Line height comfortable
- No text overflow

## Images
- Proper aspect ratios
- No distortion
- Load quickly
- Fallback for failed loads

## Buttons
- Large enough to tap
- Proper spacing between buttons
- Visual feedback on tap
- Disabled state clear

## Forms
- Inputs large enough
- Labels visible
- Keyboard doesn't cover inputs
- Validation messages visible

## Navigation
- Easy to reach nav items
- Clear active state
- Back button works
- Breadcrumbs (if any)

---
# Network Testing
## Throttle Network in DevTools
1. Open DevTools
2. Go to Network tab
3. Select throttling:
   - Fast 3G
   - Slow 3G
   - Offline

## Test:
- App loads on slow connection
- Loading states show
- Error handling works
- Retry mechanisms work

---
# Accessibility Testing
## Mobile Accessibility
- Text is zoomable
- Touch targets are large
- Color contrast sufficient
- Screen reader compatible
- Keyboard navigation works

---
# Performance Testing
## Lighthouse Mobile Audit
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Mobile"
4. Run audit

## Target Scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

---
## Troubleshooting

## Can't access from phone?
1. Check firewall settings
2. Ensure phone and computer on same WiFi
3. Try using ngrok
4. Check if port 3000 is open

## Slow loading?
1. Check network throttling
2. Optimize images
3. Check database queries
4. Enable caching

## Layout issues?
1. Check CSS media queries
2. Test different screen sizes
3. Check for fixed widths
4. Use responsive units (rem, %, vw)