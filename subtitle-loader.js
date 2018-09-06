const inputElement = document.getElementById("file-input")

const subtitle = {
  subscribers: [],
  subscribe: function(fn) {
    this.subscribers.push(fn);
  },
  _content: {},
  set content (content) {
    this._content = content;
    this.subscribers.forEach(subscriber => subscriber(content))
  },
};

inputElement.addEventListener("change", function(event) {
  const file = event.target.files[0];
  const fileExtension = getExtension(file.name);
  if (fileExtension !== 'srt') {
    alert('Not supported file type!');
  }

  fr = new FileReader();
  fr.readAsText(file)
  fr.addEventListener("load", function(event) {
    subtitle.content = srtParser(event.target.result);
  });
}, false)

const getExtension = (fileName) => {
  const destructredFileName = fileName.split('.');
  return destructredFileName[destructredFileName.length - 1];
}

subtitle.subscribe(console.log)
