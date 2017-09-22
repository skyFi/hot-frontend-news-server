const router = require('koa-router')()
const cheerio = require('cheerio');
const request = require('request');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// segmentfault前端头条
router.get('/segmentfault', async (ctx, next) => {
  const query = ctx.query;
  const url = `http://segmentfault.com/news/frontend?page=${query.page || 1}`;
  const baseUrl = 'http://segmentfault.com'
  //初始url 
  const res = await new Promise((resolve, reject) => {
    const newsList = [];
    try {
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(body, { decodeEntities: false });
          const newsInfo = $('.news__item').get();
          for (const item of newsInfo) {
            const mr = $(item).find('.news__item-title').find('.mr10');
            const text = mr.text().trim();
            const href = mr.attr('href').trim().replace(/\?.*/, '');
            const num = $(item).find('.stream__item-zan').text().trim();
            newsList.push({ text, href: `${baseUrl}${href}`, num });
          }
          resolve(newsList);
        }
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  })
  ctx.body = res;
})

router.get('*', async(ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router
