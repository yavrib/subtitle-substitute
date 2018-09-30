console.log('gonna try to connect');
// This does not work
const port = chrome.runtime.connect('kkmdmkacfdkimjcfkkiojbdkiamjkbmg');
console.log('tried connecting, this is result:', port);
const extensionElementId = 'Subtitle-Substitute-Subtitles';
let subtitleIndex = 0;
let videoElem;

const subtitle = {
  subscribers: [],
  subscribe: function(fn) {
    this.subscribers.push(fn);
  },
  _content: {},
  set content (content) {
    this._content = content;
    this.subscribers.forEach(subscriber => subscriber(content));
  },
  get content () {
    return this._content;
  }
};

const createSubtitleElement = () => {
  subtitleElement = document.createElement('span');
  subtitleElement.id = extensionElementId;
  subtitleElement.style = 'position: fixed; height: 20px; bottom: 0; left: 0; right: 0; font-size: 16px; color: white;';
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

const getSubtitle = (timestamp) => {
  let currentSubtitle = '';

  for (let index = subtitleIndex; index < subtitle.content.length; index++) {
    const sub = subtitle.content[subtitleIndex];

    console.log(sub.startTime, timestamp, sub.endTime)
    if (timestamp >= sub.startTime && timestamp <= sub.endTime) {
      currentSubtitle = sub.text;
      subtitleIndex = index;
      break;
    }
  }

  return currentSubtitle;

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
  subtitle.content = event.content;
})
