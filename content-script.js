const port = chrome.runtime.connect();
const extensionElementId = 'Subtitle-Substitute-Subtitles';

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

const seeker = {
  subscribers: [],
  subscribe: function(fn) {
    this.subscribers.push(fn);
  },
  unsubscribeAll: function() {
    this.subscribers = [];
  },
  unsubscribe: function(subscriber) {
    this.subscribers = this.subscribers.reduce((remainingSubscribers, oldSubscriber) => {
      return oldSubscriber !== subscriber ?
        remainingSubscribers :
        [ ...remainingSubscribers, oldSubscriber ];
    }, []);
  },
  _time: {},
  set time (currentTime) {
    this._time = currentTime;
    this.subscribers.forEach(subscriber => subscriber(currentTime));
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

// #1
const upToHourToMilliseconds = (hour) => {
  return hour;
}

const inBetween = (value, startPoint, endPoint) => {
  // End condition
  // Recursion
}

const findSeeker = () => {
  const buffered = document.getElementsByClassName('buffered')[0].style.width;
  const time = document.getElementsByTagName('time')[0].innerText;

  /* This is HH:MM:SS, man. WTF? Work with Millis FFS */ // Implement #1 for this.
  seeker.time = Number(time) * Number(buffered.substring(0, buffered.length - 1))
}

subtitle.subscribe((newSubtitles) => {
  seeker.unsubscribeAll();
  seeker.subscribe((time) => {
    // Make it recursively so if the value is between
    // start and end point, the recursion should stop
    // Implement #2 for this.
    newSubtitles.content.forEach(subtitle => {
      // subtitle.startTime, subtitle.endTime, subtitle.text
      if (subtitle.startTime < time && time < subtitle.endTime) {
        getSubtitleElement().innerText = subtitle.text;
      }
      /*
        00:00:03,400 --> 00:00:06,177
        00:00:06,277 --> 00:00:10,009

        case 1: time = 00:00:02,000
        case 2: time = 00:00:04,000
        case 3: time = 00:00:06,200
        case 4: time = 00:00:08,000
      */
    });
  })
});

createSubtitleElement();
setInterval(findSeeker, 300);

port.onMessage.addListener(function(event) {
  /** Find the subtitle element and replace it with the subtitles imported */
  if (!event.from === 'Subtitle Substitute') return;
  subtitle.content = event.content;
})
