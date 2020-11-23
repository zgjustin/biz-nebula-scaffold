/**
 * url Param解析
 * @param {*} url 解析的url
 */

export const getParams = function(url) {
  let pattern = /([\w\-\.]+)=([\w\-\.]+)/gi; //取路径参数正则表达式
  let params = {};
  url.replace(pattern, function(a, b, c) {
    params[b] = c;
  });

  //不区分大小写
  Object.entries(params).forEach(([k, v]) => {
      if(v === "false") {
          params[k.toLowerCase()] = false;
      }else if(v === "true") {
          params[k.toLowerCase()] = true;
      }else {
          params[k.toLowerCase()] = v;
      }
  });

  return params;
};
