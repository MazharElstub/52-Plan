const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Reduce the number of watched files
config.watchFolders = [];
config.resolver.blockList = [
  /node_modules\/.*\/node_modules/,
  /\.git/,
  /\.expo/,
  /\.next/,
];

module.exports = config;