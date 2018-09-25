const parserMap = { srt: srtParser };

chrome.runtime.onConnect.addListener(function(port) {
  console.log('Connection Established');

  const inputElement = document.getElementById("file-input");

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

  inputElement.addEventListener("change", function(event) {
    const file = event.target.files[0];
    const fileExtension = getExtension(file.name);
    const parser = parserMap[fileExtension];

    if (!parser) {
      alert('Not supported file type!');
      return;
    }

    fr = new FileReader();
    fr.readAsText(file);
    fr.addEventListener("load", function(event) {
      subtitle.content = parser(event.target.result);
    });
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
    console.log('sent', event)
    port.postMessage(event);
  })
});
