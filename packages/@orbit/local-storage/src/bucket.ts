import Orbit, {
  Bucket, BucketSettings
} from '@orbit/core';
import { assert } from '@orbit/utils';
import { supportsLocalStorage } from './lib/local-storage';

declare const self: any;

export interface LocalStorageBucketSettings extends BucketSettings {
  delimiter?: string;
}

/**
 * Bucket for persisting transient data in localStorage.
 *
 * @class LocalStorageBucket
 * @extends Bucket
 */
export default class LocalStorageBucket extends Bucket {
  private _delimiter: string;

  /**
   * Create a new LocalStorageBucket.
   *
   * @constructor
   * @param {Object}  [settings]           Settings.
   * @param {String}  [settings.name]      Optional. Name of this bucket. Defaults to 'localStorageBucket'.
   * @param {String}  [settings.namespace] Optional. Prefix for keys used in localStorage. Defaults to 'orbit-bucket'.
   * @param {String}  [settings.delimiter] Optional. Delimiter used to separate key segments in localStorage. Defaults to '/'.
   * @param {Integer} [settings.version]   Optional. Defaults to 1.
   */
  constructor(settings: LocalStorageBucketSettings = {}) {
    assert('Your browser does not support local storage!', supportsLocalStorage());

    settings.name = settings.name || 'localStorage';

    super(settings);

    this._delimiter = settings.delimiter || '/';
  }

  get delimiter(): string {
    return this._delimiter;
  }

  getFullKeyForItem(key: string): string {
    return [this.namespace, key].join(this.delimiter);
  }

  getItem(key: string): Promise<any> {
    const fullKey: string = this.getFullKeyForItem(key);
    return Orbit.Promise.resolve(JSON.parse(self.localStorage.getItem(fullKey)));
  }

  setItem(key: string, value: any): Promise<void> {
    const fullKey: string = this.getFullKeyForItem(key);
    self.localStorage.setItem(fullKey, JSON.stringify(value));
    return Orbit.Promise.resolve();
  }

  removeItem(key): Promise<void> {
    const fullKey: string = this.getFullKeyForItem(key);
    self.localStorage.removeItem(fullKey);
    return Orbit.Promise.resolve();
  }
}
