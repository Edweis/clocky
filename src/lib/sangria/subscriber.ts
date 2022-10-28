export default class Subscriber<T> {
  protected subscribers: Record<number, (data: T[]) => void> = {};

  subscribe(fn: (data: T[]) => void) {
    const id = Math.floor(Math.random() * 1000);
    // FIXME, id can conflict !
    this.subscribers = { ...this.subscribers, [id]: fn };
    return id;
  }

  unsubscribe(id: number) {
    delete this.subscribers[id];
  }
}
