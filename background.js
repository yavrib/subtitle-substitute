chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({ pageUrl: { hostEquals: 'www.netflix.com' }, })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

chrome.runtime.onConnect.addListener(function(port) {
  port.postMessage({
    from: 'Subtitle Substitute',
    type: 'CONNECTION_ESTABLISHED',
  });
  // open when extension clicked
  // open as popup/small window
  w = window.open(chrome.extension.getURL('popup.html'));
  w.port = port;
});
