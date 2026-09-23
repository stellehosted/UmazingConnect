#!/usr/bin/env node

/**
 * Show Mobile Testing URL
 * Run this to get the URL to test on your phone
 */

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIP();
const port = process.env.PORT || 3000;

console.log('\n🎉 Mobile Testing URLs\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (ip !== 'localhost') {
  console.log('📱 Test on your phone (same WiFi):');
  console.log(`   http://${ip}:${port}`);
  console.log('');
  console.log('💡 Make sure:');
  console.log('   1. Your phone is on the same WiFi network');
  console.log('   2. Your firewall allows connections on port', port);
  console.log('   3. Dev server is running (npm run dev)');
} else {
  console.log('⚠️  Could not detect local IP address');
  console.log('');
  console.log('Try manually:');
  console.log('   Windows: ipconfig');
  console.log('   Mac/Linux: ifconfig | grep "inet "');
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('🖥️  Desktop testing:');
console.log(`   http://localhost:${port}`);
console.log('');
console.log('🔧 Chrome DevTools:');
console.log('   1. Press F12');
console.log('   2. Click device icon (Ctrl+Shift+M)');
console.log('   3. Select device from dropdown');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📚 Full testing guide: docs/mobileTests.md\n');
