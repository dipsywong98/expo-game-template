/*
With thanks, https://github.com/FormidableLabs/react-game-kit/blob/master/src/native/utils/game-loop.js
*/

/*
The MIT License (MIT)

Copyright (c) 2013

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export type TimerSubscriber = (currentMs: number) => unknown

export class Timer {
  private subscribers: TimerSubscriber[] = []
  private loopId?: number
  private running = false
  private timeStampMinusTimerMs: number = Date.now()

  public now (): number {
    return Date.now() - this.timeStampMinusTimerMs
  }

  constructor () {
    this.subscribers = [this.syncTimer]
    this.loopId = undefined
  }

  private readonly syncTimer = (currentMs: number): void => {
    this.timeStampMinusTimerMs = Date.now() - currentMs
    this.unsubscribe(this.syncTimer)
  }

  public loop = (time: number): void => {
    if (this.loopId !== undefined) {
      this.subscribers.forEach(callback => {
        callback(time)
      })
    }

    this.loopId = requestAnimationFrame(this.loop)
  }

  public start (): void {
    if (this.loopId === undefined) {
      this.loop(Date.now())
    }
    this.running = true
  }

  public stop (): void {
    if (this.loopId !== undefined) {
      cancelAnimationFrame(this.loopId)
      this.loopId = undefined
    }
    this.running = false
  }

  public subscribe (callback: TimerSubscriber): void {
    if (!this.subscribers.includes(callback)) { this.subscribers.push(callback) }
  }

  public unsubscribe (callback: TimerSubscriber): void {
    this.subscribers = this.subscribers.filter(s => s !== callback)
  }

  public isRunning (): boolean {
    return this.running
  }
}
