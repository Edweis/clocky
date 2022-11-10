export function safeJsonParse(data: string) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export function setEagerInterval(
  key: string,
  fn: () => Promise<void> | void,
  periodInMs: number,
) {
  // kill existing cron
  const cronKey = `cron-${key}`;
  const cronId = Number(localStorage.getItem(cronKey));
  if (cronId) clearInterval(cronId);

  fn(); // eagerly run
  const nextCronId = setInterval(fn, periodInMs);
  localStorage.setItem(cronKey, nextCronId.toString());
}
