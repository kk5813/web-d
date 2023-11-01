import md5 from 'js-md5'   //MD5加密
const crypto = require('crypto');	//加密模块
const key ='node'  //加密解密时的密码
export function aesEncrypt(data){
  /**
   * 1.通过 crypto ,与key 创建一个ciper暗号
   * createCipheriv(algorithm，key)
   * algorithm 加密类型
   * key       密码
   */
  let ciper=crypto.createCipher('aes192',key);
  //把数据加密
  //update 有多种方法
  //推荐   update(data, inputEncoding, outputEncoding)
  /**
   *       data 要加密的数据
   *       inputEncoding 输入的编码，其实就是data的编码
   *       outputEncoding 输出的编码，正常我们都使用hex 16进制的输出
   */
  let returnStr=ciper.update(data,'utf8','hex');
  //加入结尾符
  let final=ciper.final('hex');
  returnStr=returnStr+final;
  return returnStr;
}
export  function aesDecrypt(encrypted){
  /**创建一个解密 */
  const deciper=crypto.createDecipher('aes192',key);
  /**
   *  update(data: string, inputEncoding: Encoding | undefined, outputEncoding: Encoding): string;
   *  data 就是被加密的字符串，inputEncoding 这个加密的字符的字符串一般椒16进制字符串，outputEncoding 输出的字符串类型一般utf8
   */
  let descrped = deciper.update(encrypted,'hex','utf8');
  descrped+=deciper.final('utf8')
  return descrped;
}





