var Crawler = require("crawler")
var c = new Crawler()
var async = require('async')
var fs = require("fs")

var arr = [
    {
        code: '110100000000',
        name: '北京市',
        link: 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2015/11.html',
        level: 0
    }
]

var ss = (scope, level, cb) => async.series(arr.filter(e => e.level == level - 1).map(e => cc => c.queue({
    uri: e.link,
    callback: (err, res, done) => {
        var $ = res.$
        var url = res.request.uri.href
        $(scope).each(function () {
            arr.push({
                code: $(this)
                    .find('td')
                    .first()
                    .text(),
                name: $(this)
                    .find('td')
                    .last()
                    .text(),
                link: url.replace(/\d+.html/, $(this).find('a').first().attr('href')),
                parent: (n => n + new Array(12 - n.length).fill(0).join(''))(url.match(/11\d*/g).reverse()[0]),
                level,
                class: level == 4
                    ? $(this)
                        .find('td')
                        .first()
                        .next()
                        .text()
                    : ''
            })
        })
        done()
        console.log(new Date())
        cc()
    }
})), cb)

async.series([
    cb => ss('.citytr', 1, cb),
    cb => ss('.countytr', 2, cb),
    cb => ss('.towntr', 3, cb),
    cb => ss('.villagetr', 4, cb)
], () => console.log(arr.length) || fs.writeFile('region.json', JSON.stringify(arr.map(e => {
    delete e.link
    return e
}))))
