import EventMap from '../types/EventMap'
import EventCallback from '../types/EventCallback'
import EventHandler from './EventHandler'

export default abstract class ChatBase<ChatApi> extends EventHandler {
  abstract _eventMap: EventMap
  abstract _loader(): Promise<ChatApi> | ChatApi

  protected _api: ChatApi | undefined

  private _eventsMapped = false
  private _loaded = false

  /**
   * Method to init chat loading process, must be executed in Driver class. Can be overridden only in a last
   * resort, but its really not recommended.
   * @returns {Promise<void>}
   */
  protected async init(): Promise<void> {
    super.init()
    this.on('load', () => this.ready())
    this.mapApiEvents()
    this._api = await this._loader()
    this.mapApiEvents()
    this.ready()
  }

  /**
   * Inform class that its loaded and ready to work.
   */
  protected ready(): void {
    this._loaded = true
  }

  /**
   * Quick check that returns true if chat is loaded.
   * @returns {boolean}
   */
  get loaded(): boolean {
    return this._loaded
  }

  /**
   * Returns a Promise that resolves on chat load, if already loaded, returns a resolved promise
   * @returns {Promise<void>}
   */
  public toLoad(): Promise<void> {
    if (this._loaded) return Promise.resolve()
    return new Promise(resolve => this.on('load', () => resolve()))
  }

  /**
   * Turn ChatBase into a thenable, use like a regular promise. Resolves on chat load.
   * @param resolve
   * @param reject
   * @returns {Promise<void>}
   */
  public then(
    resolve?: (chat?: this) => any,
    reject?: (chat?: this) => any
  ): Promise<any> {
    let valueFromCallback
    if (this._loaded) {
      try {
        valueFromCallback = resolve ? resolve(this) : undefined
      } catch (e) {
        return Promise.reject(reject ? reject(e) : e)
      }
      return Promise.resolve(valueFromCallback)
    }
    return new Promise((res, rej) => {
      this.on('load', () => {
        try {
          valueFromCallback = resolve ? resolve(this) : undefined
        } catch (e) {
          return rej(reject ? reject(e) : e)
        }
        res(valueFromCallback)
      })
    })
  }

  /**
   * Helper to build drivers that needs to monitor some global event or value.
   *
   * Keep testing function given in "test" argument until it returns a truthy value. After that, resolves a
   * promise with value returned in function given in "then" argument. If "then" callback generates an error,
   * Promise is rejected with same exception.
   *
   * @param {() => any} test
   * @param {() => any} then
   * @param {number} testInterval
   * @param {number} limit
   * @returns {Promise<any>}
   */
  protected waitFor(
    test: () => any,
    then: () => any,
    testInterval = 200,
    limit = 10000
  ): Promise<any> {
    try {
      if (test()) return Promise.resolve(then())
    } catch (e) {
      return Promise.reject(e)
    }
    return new Promise((resolve, reject) => {
      let interval: NodeJS.Timeout
      let count = 0
      try {
        interval = setInterval(() => {
          if (count > limit) {
            clearInterval(interval)
            reject(`Wait time passed the allowed limit ${limit}`)
          }
          if (test()) {
            clearInterval(interval)
            let resolvedValue
            try {
              resolvedValue = then()
              resolve(resolvedValue)
            } catch (e) {
              reject(e)
            }
          }
          count += testInterval
        }, testInterval)
      } catch (e) {
        reject('Error setting interval')
      }
    })
  }

  /**
   * Set events from _eventsMapped to Chat's global JS API.
   */
  private mapApiEvents(): void {
    if (this._eventsMapped || !this._api) return

    for (const prop of Object.keys(this._events) as Array<keyof EventMap>) {
      const event = this._events[prop]
      if (!event) continue
      try {
        this.attachEvent(event.callbackName, (...args) => {
          this.trigger(prop, ...args)
        })
      } catch (e) {
        throw ChatBase.setError('Error setting callbacks in Chat API', e)
      }
    }

    this._eventsMapped = true
  }

  /**
   * Method to attach each event to Chat's global JS API. Can be overridden in Driver class to change its behavior.
   * Default simply stores callback method is a global key, most chats JS APIs works that way.
   * @param {string} event
   * @param {EventCallback<any>} callback
   */
  protected attachEvent(event: string, callback: EventCallback<any>): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (this._api) this._api[event] = callback
  }
}
