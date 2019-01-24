let port = chrome.runtime.connect('jphkciijdapmllebkkgmnhdmkhgkibek');
let reconnectorId;
port.onDisconnect.addListener(function(_event) {
  // console.log('disconnected');
  reconnectorId = setInterval(() => {
    // console.log('trying to reconnect');
    port = chrome.runtime.connect('jphkciijdapmllebkkgmnhdmkhgkibek');
    setupListener(port);
  }, 300);
});

const extensionElementId = 'Subtitle-Substitute-Subtitles';
let videoElem;

const subtitle = {
  subscribers: [],
  subscribe: function(fn) {
    this.subscribers.push(fn);
  },
  _content: [],
  set content(content) {
    this._content = content;
    this.subscribers.forEach(subscriber => subscriber(content));
  },
  get content() {
    return this._content;
  }
};

const createSubtitleElement = () => {
  subtitleElement = document.createElement('span');
  subtitleElement.id = extensionElementId;
  subtitleElement.style = 'display: block; position: fixed; height: 20px; bottom: 0; left: 0; right: 0; font-size: 16px; color: white; z-index: 3000; text-align: center;';
  document.body.appendChild(subtitleElement);
}

const getSubtitleElement = () => {
  return document.getElementById(extensionElementId);
};

const mountVideoListener = (records) => {
  records.forEach(record => {
    if (
      record.addedNodes &&
      record.addedNodes.length &&
      record.addedNodes[0] &&
      record.addedNodes[0].innerHTML &&
      record.addedNodes[0].innerHTML.indexOf('<video') === 0
    ) {

      videoElem = document.getElementsByTagName('video')[0];
      videoElem.ontimeupdate = () => {
        const sub = getSubtitle(videoElem.currentTime); // returns correct subtitle to show
        const subtitleElement = getSubtitleElement();
        subtitleElement.innerHTML = sub;
      };
    }
  })
}

const getSubtitle = (videoTime) => {
  const timestamp = Math.ceil(videoTime * 1000);

  return ((subtitle && subtitle.content) || []).reduce((acc, item) => {
    if (item && (timestamp > item.startTime && timestamp < item.endTime)) {
      return item.text;
    }

    return acc;
  }, '');

  /*
      00:00:03,400 --> 00:00:06,177
      00:00:06,277 --> 00:00:10,009

      case 1: time = 00:00:02,000
      case 2: time = 00:00:04,000
      case 3: time = 00:00:06,200
      case 4: time = 00:00:08,000
  */
}

createSubtitleElement();

const observer = new MutationObserver(mountVideoListener)
observer.observe(document.body, { childList: true, subtree: true });

const setupListener = (port) => {
  if (!port) {
    return;
  }

  port.onMessage.addListener(function(event) {
    /** Find the subtitle element and replace it with the subtitles imported */
    // console.log('Event received', event);
    if (!(event.from === 'Subtitle Substitute')) return;
    switch (event.type) {
      case 'CONNECTION_ESTABLISHED':
        // console.log('connection established')
        clearInterval(reconnectorId);
        break;
      case 'NEW_SUBTITLE':
        subtitle.content = event.content;
        break;
      default:
        break;
    }
  });
}

setupListener(port);
