const srtParser = (content) => {
  return content.split('\n\n').map(block => {
    const [ id, timeBlock, ...rest] = block.split('\n');
    const [startTime, endTime] = timeBlock.split(' --> ')
    return {
      id,
      startTime: srtTimeToTimestamp(startTime),
      endTime: srtTimeToTimestamp(endTime),
      text: rest.join('\n'),
    };
  });
}

const srtTimeToTimestamp = (srtTime) => {
  const [ hours, minutes, seconds, milliseconds ] = srtTime.split(/[:,]/)

  return (((hours * 60 + minutes) * 60) + seconds) * 1000 + milliseconds;
}
