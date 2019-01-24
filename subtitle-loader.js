const parserMap = { srt: srtParser };

const jumpStart = port => {
  const inputElement = document.getElementById("file-input");

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
  };

  inputElement.addEventListener("change", function(event) {
    const file = event.target.files[0];
    const fileExtension = getExtension(file.name);
    const parser = parserMap[fileExtension];

    if (!parser) {
      alert('Not supported file type!');
      inputElement.value = '';
      return;
    }

    fr = new FileReader();
    fr.readAsText(file);
    fr.addEventListener("load", function(event) {
      subtitle.content = parser(event.target.result);
    });
    fr.onerror = (error) => { };// console.log(error);
  }, false);

  const getExtension = (fileName) => {
    const destructredFileName = fileName.split('.');
    return destructredFileName[destructredFileName.length - 1];
  }

  subtitle.subscribe((newSubtitle) => {
    const event = {
      from: 'Subtitle Substitute' /* Need to find a secure way */,
      type: 'NEW_SUBTITLE',
      content: newSubtitle
    };

    port.postMessage(event);
  });
};

const spark = setInterval(() => {
  if (window.port) {
    clearInterval(spark);
    jumpStart(window.port);
  }
}, 300);
