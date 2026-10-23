// Loads the browser data files into Node for the scripts in this folder.
global.window = {};
require('../js/standards.js');
require('../js/content.js');
module.exports = { STD: window.RT_STANDARDS, C: window.RT_CONTENT };
