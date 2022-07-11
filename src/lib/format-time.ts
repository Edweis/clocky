const formatTime = (elasped: number) => {
  const rounded = Math.floor(elasped);
  const seconds = rounded % 60;
  const minutes = (rounded - seconds) / 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
export default formatTime;
