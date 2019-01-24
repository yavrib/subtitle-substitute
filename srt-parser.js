const srtParser = (content) => {
  return content.split('\n\n').map(block => {
    const [id, timeBlock, ...rest] = block.split('\n');
    const [startTime, endTime] = timeBlock.split(' --> ');

    return {
      id,
      startTime: srtTimeToTimestamp(startTime, 'start'),
      endTime: srtTimeToTimestamp(endTime, 'end'),
      text: rest.join('\n'),
    };
  });
}

const srtTimeToTimestamp = (srtTime, place) => {
  const [hours, minutes, seconds, milliseconds] = srtTime.split(/[:,]/)

  return (((Number(hours) * 60 + Number(minutes)) * 60) + Number(seconds)) * 1000 + Number(milliseconds);
}
