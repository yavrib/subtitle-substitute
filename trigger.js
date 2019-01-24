let port = chrome.runtime.connect('jphkciijdapmllebkkgmnhdmkhgkibek');
port.postMessage({
  from: 'Subtitle Substitute',
  type: 'TRIGGER',
});
