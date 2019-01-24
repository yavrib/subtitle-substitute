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

let pagePort;

chrome.runtime.onConnect.addListener(function(port) {
  if (
    port &&
    port.sender &&
    port.sender.url &&
    port.sender.url.indexOf('netflix') > 0 // tedious
  ) {
    pagePort = port;
  }

  port.postMessage({
    from: 'Subtitle Substitute',
    type: 'CONNECTION_ESTABLISHED',
  });

  port.onMessage.addListener((event) => {
    if (event.from !== 'Subtitle Substitute') return;
    if (event.type !== 'TRIGGER') return;
    w = window.open(
      chrome.extension.getURL('popup.html'),
      '_blank',
      'width=400,height=400'
    );
    w.port = pagePort;
  });
});
