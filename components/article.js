const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

class Article extends Nanocomponent {
  constructor (tweet) {
    super()
    this.tweet = tweet
    this.link = this.parseArticle(tweet)
  }
  parseArticle (url) {
    return {
      title: 'Zato ESB - Test demo hosted on company server',
      alias: 'zato-esb-test-demo-hosted-on-company-server-1500021746537-PAQXw8IYcU',
      url: 'https://www.youtube.com/watch?v=tRGJj59G1x4',
      canonicals:
   [ 'https://www.youtube.com/watch?v=tRGJj59G1x4',
     'https://youtu.be/tRGJj59G1x4',
     'https://www.youtube.com/v/tRGJj59G1x4',
     'https://www.youtube.com/embed/tRGJj59G1x4' ],
      description: 'Our sample: https://github.com/greenglobal/zato-demo Zato homepage: https://zato.io Tutorial: "Zato — a powerful Python-based ESB solution for your SOA" http...',
      content: '<iframe src="https://www.youtube.com/embed/tRGJj59G1x4?feature=oembed" frameborder="0" allowfullscreen></iframe>',
      image: 'https://i.ytimg.com/vi/tRGJj59G1x4/hqdefault.jpg',
      author: 'Dong Nguyen',
      source: 'YouTube',
      domain: 'youtube.com',
      publishedTime: '',
      duration: 292
    }
  }
  createElement () {
    const tweet = this.tweet
    const url = tweet.entitites.urls[0].expanded_url
    const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

    const link = this.link
    // TODO: if link is loading, display loading
    return html`
          <li class="">
              <div class="flex-ns flex-column space-around">
                <div class="">
                  <h1 class=""><a class="" href="${link.url}">${link.title}</a></h1>
                  <h2 class="">${link.author ? `${link.author} | ` : ''}${link.source ? link.source : link.domain}</h2>
                  <div class=" ">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="">
                    <a data-pocket-label="pocket" data-save-url="${link.url}" data-pocket-count="vertical" class="pocket-btn" data-lang="en"></a>
                </div>
              </div>
              <div class="">
                ${link.image ? html`<img class="" src="${link.image}"></img>` : ''}
                    <div class="">
                      <h5 class="">${link.duration} minute read</h5>
                      <h5 class="">Shared by <a class="link navy hover-blue" href="${tweetUrl}">${tweet.user.name}</a></h5>
                    </div>
              </div>
          </li>
    
    `
  }
}

module.exports = Article
