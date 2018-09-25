const port = chrome.runtime.connect();
const extensionElementId = 'Subtitle-Substitute-Subtitles';
let subtitleIndex = 0;

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
};

const createSubtitleElement = () => {
  subtitleElement = document.createElement('span');
  subtitleElement.id = extensionElementId;
  document.body.appendChild(subtitleElement);
}

const getSubtitleElement = () => {
  return document.getElementById(extensionElementId);
};

document.getElementsByTagName('video')[0].ontimeupdate = (event) => {
  const subtitle = getSubtitle(event.target.value); // returns correct subtitle to show
  const subtitleElement = getSubtitleElement();
  subtitleElement.innerText = subtitle;
};

const getSubtitle = (timestamp) => {
  let currentSubtitle = '';

  for (let index = subtitleIndex; index < subtitle.content.length; index++) {
    const sub = subtitle.content[subtitleIndex];

    if (timestamp >= sub.startTime && timestamp <= sub.endTime) {
      currentSubtitle = sub.text;
      subtitleIndex = index;
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

port.onMessage.addListener(function(event) {
  /** Find the subtitle element and replace it with the subtitles imported */
  if (!(event.from === 'Subtitle Substitute')) return;
  subtitle.content = event.content;
})
