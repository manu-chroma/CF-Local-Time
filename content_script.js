(async () => {
    const src = chrome.extension.getURL('./content_main.js');
    // console.log("src: " + src)
    const contentScript = await import(src);
    contentScript.main(/* chrome: no need to pass it */);
})();