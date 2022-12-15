import { get } from '@/lib/api';
import { StorageService, StorageServiceInstance } from '@/modules/storage-module/@types';
import { base64encode, utf16to8 } from '@/tools/common';
// import { enc, HmacSHA1 } from 'crypto-js';
import { StorageServiceType } from '../enum';

/** 七牛云存储 */
export const QiniuService: StorageService = {
  name: '七牛云存储',
  icon: '',
  enabled: true,
  type: StorageServiceType.qiniu,
  defaultHeaders: {},
  api: {
    getAuthorization(instance: StorageServiceInstance) {
      return '';
    },
    connectionTest(instance: StorageServiceInstance) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    init(instance: StorageServiceInstance) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    list(instance: StorageServiceInstance) {
      return new Promise((resolve, reject) => {
        const query = '';

        const host = 'rsf-z2.qbox.me';

        let signingStr = `GET /list${query ? '?' : ''}${query}`;
        signingStr += `\nHost: ${host}`;
        signingStr += `\n\n`;

        // const sign = HmacSHA1(signingStr, instance.config.SecretKey);

        // const encodedSign = sign.toString(enc.base64);

        get(
          'https://rsf-z2.qbox.me/list',
          {
            bucket: instance.config.bucket,
            // marker: '',
            // limit: '',
            // prefix: '',
            // delimiter: ''
          },
          {
            headers: {
              // Authorization: `Qiniu ${instance.config.AccessKey}:${encodedSign}`,
            },
          },
        ).then((d) => {
          resolve(d);
        });
        // bucket=<Bucket>&marker=<Marker>&limit=<Limit>&prefix=<UrlEncodedPrefix>&delimiter=<UrlEncodedDelimiter>
      });
    },
    upload(instance: StorageServiceInstance, fileInfo) {
      return new Promise<string>((resolve, reject) => {
        const putPolicy = JSON.stringify({
          scope: `haku-design:${fileInfo.name}`,
          deadline: ~~((Date.now() + 3600000 * 24) / 1000),
          returnBody: `${JSON.stringify({
            name: fileInfo.name,
            size: fileInfo.size,
            // w: fileInfo.width,
            // h: fileInfo.height,
            hash: '', // fileInfo.eTag
          })}`,
        });

        const encodedPutPolicy = base64encode(utf16to8(putPolicy));

        // Step 3
        const encoded = base64encode(utf16to8(putPolicy));

        // Step 4
        // const hash = HmacSHA1(encoded, instance.config.SecretKey);
        // const encodedSign = hash.toString(enc.Base64);

        // const uploadToken = instance.config.AccessKey + ':' + encodedSign + ':' + encodedPutPolicy;

        // upload(instance.serverUrl, {
        //   token: uploadToken,
        //   key: fileInfo.fileName,
        //   fileName: fileInfo.fileName,
        //   file: fileInfo.file
        // }).then(d => {
        //   resolve(d);
        // }).catch(err => {
        //   console.error(err);
        // });
      });
    },
    download() {
      return new Promise<string>((resolve, reject) => {
        resolve('');
      });
    },
    delete(key: string, instance: StorageServiceInstance) {
      return new Promise<string>((resolve, reject) => {
        resolve('');
      });
    },
  },
};
