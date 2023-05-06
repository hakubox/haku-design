import { StorageService, StorageServiceInstance } from '@/modules/storage-module/@types';
import { StorageServiceType } from '../enum';
import { getCosAuthorization } from '../api';

const cosConfig = {
  cosRegion: 'ap-guangzhou',
  // publicBucketName: 'saas-1258165268',
  privateBucketName: 'saas-private-1258165268',
};

const getAuthorization = async (options, cosCallback) => {
  const res = await getCosAuthorization();
  if (res) {
    const { sessionToken, tmpSecretId, startTime, tmpSecretKey, expiredTime } = res;

    cosCallback({
      TmpSecretId: tmpSecretId,
      TmpSecretKey: tmpSecretKey,
      SecurityToken: sessionToken,
      StartTime: startTime, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
      ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000000
      ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
    });
  }
};

/** 腾讯云COS存储 */
export const COSService: StorageService = {
  name: '腾讯云COS存储',
  icon: '',
  enabled: true,
  type: StorageServiceType.cos,
  defaultHeaders: {},
  api: {
    init(instance) {
      return new Promise((resolve, reject) => {
        // instance.sdk = new COS({
        //   getAuthorization,
        //   UploadCheckContentMd5: true,
        // });
        resolve();
      });
    },
    getAuthorization(instance: StorageServiceInstance) {
      return '';
    },
    connectionTest(instance: StorageServiceInstance) {
      return new Promise((resolve, reject) => {
        // instance.sdk!.headBucket(
        //   {
        //     Bucket: cosConfig.privateBucketName,
        //     Region: cosConfig.cosRegion,
        //   },
        //   function (err, data) {
        //     if (err) reject(err);
        //     else resolve(data);
        //   },
        // );
      });
    },
    list(instance: StorageServiceInstance) {
      return new Promise((resolve, reject) => {
        const _listFolder = async (params, callback) => {
          const Contents: any[] = [];
          const CommonPrefixes: any[] = [];
          let marker;
          let retryCount = 0; // 重试次数
          const maxRetry = 10; // 最大重试次数
          const next = async () => {
            params.Marker = marker;
            instance.sdk!.getBucket(params, async (err, data) => {
              if (err) return callback(err);
              data &&
                data.CommonPrefixes &&
                data.CommonPrefixes.forEach((item) => {
                  CommonPrefixes.push(item);
                });
              data &&
                data.Contents &&
                data.Contents.forEach((item) => {
                  Contents.push(item);
                });
              if (data.IsTruncated === 'true') {
                if (retryCount > maxRetry) {
                  reject();
                } else {
                  retryCount++;
                  marker = data.NextMarker;
                  setTimeout(next, 1000);
                }
              } else {
                callback(null, {
                  CommonPrefixes: CommonPrefixes,
                  Contents: Contents,
                });
              }
            });
          };
          await next();
        };
        _listFolder(
          {
            Bucket: cosConfig.privateBucketName,
            Region: cosConfig.cosRegion,
            Delimiter: '/', // 如果按目录列出文件传入该分隔符，如果要深度列出文件不传改参数
            // Prefix: 'folder/', // 要列出的目录前缀
          },
          function (err, data) {
            if (err) reject(err);
            else resolve(data.Contents);
          },
        );
      });
    },
    upload(instance, file, config) {
      return new Promise((resolve, reject) => {
        const fileKey = config?.cosConfig?.Key ?? file.name;
        const { onTaskReady, ...rest } = config?.cosConfig ?? {};
        const params = {
          ...rest,
          Key: fileKey /* 必须 */,
          Bucket: cosConfig.privateBucketName /* 必须 */,
          Region: cosConfig.cosRegion /* 存储桶所在地域，必须字段 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          ChunkSize: 1024 * 500, // 分片大小，单位 B
          onTaskReady: (taskId) => {
            onTaskReady?.(taskId, onResume);
          },
        };
        const callback = (err, data) => {
          if (err) {
            reject('上传失败');
          } else {
            if (data.statusCode === 200) {
              resolve('上传成功');
              config?.callback?.(err, data);
            }
          }
        };
        // 恢复上传
        const onResume = () => {
          instance.sdk!.sliceUploadFile(params, callback);
        };
        onResume();
      });
    },
    download(fileKey, instance) {
      return new Promise((resolve, reject) => {
        instance.sdk!.getObject(
          {
            Bucket: cosConfig.privateBucketName,
            Region: cosConfig.cosRegion,
            Key: fileKey,
            DataType: 'blob',
          },
          function (err, data) {
            if (err) reject('下载失败，请重试！');
            else resolve(data.Body);
          },
        );
      });
    },
    delete(fileKey, instance) {
      return new Promise((resolve, reject) => {
        instance.sdk!.deleteObject(
          {
            Bucket: cosConfig.privateBucketName,
            Region: cosConfig.cosRegion,
            Key: fileKey,
          },
          function (err, data) {
            if (err) reject('删除失败，请重试！');
            else resolve('删除成功！');
          },
        );
      });
    },
  },
};
