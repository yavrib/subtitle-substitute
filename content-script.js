let port = chrome.runtime.connect('jphkciijdapmllebkkgmnhdmkhgkibek');
let reconnectorId;
port.onDisconnect.addListener(function(event) {
  console.log('disconnected');
  console.log('trying to reconnect');
  reconnectorId = setInterval(() => {
    port = chrome.runtime.connect('jphkciijdapmllebkkgmnhdmkhgkibek');
  }, 300);
});

const extensionElementId = 'Subtitle-Substitute-Subtitles';
let subtitleIndex = 0;
let videoElem;

const subtitle = {
  subscribers: [],
  subscribe: function(fn) {
    this.subscribers.push(fn);
  },
  _content: {},
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

// FIX: find a way to try to connect when only extension html is visible because that's only when you can connect, sadly.
// FIX: handle video.onseeked event.

const getSubtitle = (videoTime) => {
  const timestamp = Math.ceil(videoTime * 1000);

  const sub = subtitle.content[subtitleIndex];

  if (!sub) {
    return '';
  }

  if (timestamp > sub.endTime) {
    subtitleIndex = 1 + subtitleIndex;
    return '';
  }

  if (timestamp > sub.startTime) {
    return subtitle.content[subtitleIndex].text.replace('↵', '<br>');
  }

  return sub.text;

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

port.onMessage.addListener(function(event) {
  /** Find the subtitle element and replace it with the subtitles imported */
  console.log('Event received', event)
  if (!(event.from === 'Subtitle Substitute')) return;
  clearInterval(reconnectorId);
  subtitle.content = event.content;
})
