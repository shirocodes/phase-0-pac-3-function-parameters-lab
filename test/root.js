global.expect = require('expect');

const babel = require('@babel/core');
const { JSDOM, VirtualConsole } = require('jsdom');
const path = require('path');
const fs = require('fs');

before(function(done) {
  const babelResult = babel.transformFileSync(
    path.resolve(__dirname, '..', 'index.js'), {
      presets: ['@babel/preset-env'] // ✅ Correct Babel preset
    }
  );

  const htmlPath = path.resolve(__dirname, '..', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8'); // Read HTML file manually

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    virtualConsole: new VirtualConsole().sendTo(console)
  });

  global.window = dom.window;
  global.document = dom.window.document;

  // ✅ Instead of assigning `navigator` directly, we define it as a getter
  Object.defineProperty(global, 'navigator', {
    get: () => dom.window.navigator,
    configurable: true
  });

  Object.keys(dom.window).forEach(key => {
    if (!(key in global)) {
      global[key] = dom.window[key];
    }
  });

  done();
});


