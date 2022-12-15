import aes from 'crypto-js/aes';
import Pkcs7 from 'crypto-js/pad-pkcs7';
import encUTF8 from 'crypto-js/enc-utf8';
import modeECB from 'crypto-js/mode-ecb';
// { enc, mode, pad, AES }

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word: any, keyWord = 'XwKsGlMcdPMEhR1B') {
  const key = encUTF8.parse(keyWord);
  const srcs = encUTF8.parse(word);
  const encrypted = aes.encrypt(srcs, key, { mode: modeECB, padding: Pkcs7 });
  return encrypted.toString();
}
export default aesEncrypt;
