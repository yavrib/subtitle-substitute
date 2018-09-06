const srtParser = (content) => {
  return content.split('\n\n').map(block => {
    const [ id, timeBlock, ...rest] = block.split('\n');
    return {
      id,
      startTime: timeBlock.split(' --> ')[0],
      endTime: timeBlock.split(' --> ')[1],
      text: rest.join('\n'),
    };
  });
}
