const srtParser = (content) => {
  return content.split('\n\n').map(block => {
    const [id, timeBlock, ...rest] = block.split('\n');
    const [startTime, endTime] = timeBlock.split(' --> ');

    console.log(rest.join('\n'));

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

  console.log(
    place,
    'hours',
    hours,
    'minutes',
    minutes,
    'seconds',
    seconds,
    'milliseconds',
    milliseconds
  )

  const result = (((Number(hours) * 60 + Number(minutes)) * 60) + Number(seconds)) * 1000 + Number(milliseconds);
  console.log(result);
  console.log(srtTime);
  return result;
}
