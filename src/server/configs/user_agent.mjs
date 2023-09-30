export default {
  request_config: {
    mode: 'no-cors',
    withCredentials: true,
    credentials: 'same-origin',
    headers: { 
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
      'Accept-Encoding': 'gzip, deflate, br',
      // 'content-type' : 'application/x-www-form-urlencoded',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Upgrade-Insecure-Requests': 1,
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'sec-ch-ua': '"Chromium";v="113", "Not-A.Brand";v="24"',
      'Referer': 'https://kwork.ru/',
      'Sec-Fetch-Site': 'cross-site',
      'DNT': 1,
      'Sec-GPC': 1,
    
    }
  }
}