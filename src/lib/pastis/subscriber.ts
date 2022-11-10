export default class Subscriber<T> {
  protected subscribers: Array<(data: T[]) => void> = [];

  subscribe(fn: (data: T[]) => void) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== fn);
    };
  }
}
