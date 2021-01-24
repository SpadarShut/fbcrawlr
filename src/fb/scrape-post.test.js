import dotenv from 'dotenv-yaml'
import { scrapePost } from './scrape-post'
import { getBrowserAndSetupFB } from '../utils/fb'

const config = dotenv.config().parsed

/*
# post-card
- https://m.facebook.com/story.php?story_fbid=1986462278179380&id=100004468813704

# memories repost
- https://m.facebook.com/story.php?story_fbid=10217800745239366&id=1504035647&refid=28&_ft_=qid.6914989952322632310%3Amf_story_key.3191518275763438597%3Atop_level_post_id.10217800745239366%3Acontent_owner_id_new.1504035647%3Aoriginal_content_id.10215158225418022%3Aoriginal_content_owner_id.1504035647%3Asrc.22%3Astory_location.5%3Astory_attachment_style.goodwill_shared_card%3Aview_time.1610021561%3Afilter.h_nor

# link to video, with comment, 6 likes 1 share
- https://m.facebook.com/story.php?story_fbid=3791434034242780&id=100001286618258&refid=17&_ft_=mf_story_key.3791434034242780%3Atop_level_post_id.3791434034242780%3Atl_objid.3791434034242780%3Acontent_owner_id_new.100001286618258%3Athrowback_story_fbid.3791434034242780%3Astory_location.4%3Astory_attachment_style.share%3Athid.100001286618258%3A306061129499414%3A2%3A0%3A1612166399%3A6308985284389879358

# adarka stefa, photo very many likes and comments with emoji
- https://m.facebook.com/story.php?story_fbid=3821912454528271&id=100001286618258
# todo repost

# 92comments, 22 shares, 51 reactions аганесян
- https://m.facebook.com/story.php?story_fbid=5201769466503688&id=100000120587654&refid=17&ref=content_filter&_ft_=mf_story_key.5201769466503688%3Atop_level_post_id.5201769466503688%3Atl_objid.5201769466503688%3Acontent_owner_id_new.100000120587654%3Athrowback_story_fbid.5201769466503688%3Astory_location.4%3Athid.100000120587654%3A306061129499414%3A2%3A0%3A1612166399%3A1138825431641199535

# 179 comment 5 shares, 43 reactions
https://www.facebook.com/groups/pramovu/permalink/2321750068099328/
*/

const data = [
  ['post-card', {
    url: 'https://m.facebook.com/story.php?story_fbid=1986462278179380&id=100004468813704',
    expected: {
      text: 'Фальсіфікатары выбараў у ЗША - нічым не лепшыя за фальсіфікатараў выбараў у Беларусі'
    }
  }],
  ['memories-repost', {
    url: 'https://m.facebook.com/story.php?story_fbid=10217800745239366&id=1504035647',
    expected: {
      text: 'З теплом згадую минулорічне Різдво, коли гуглмепс заставив оббігати пів-центра Відня, намерзнутися, і таки знайти за вивішеним прапором. Українську церкву, українську громаду, яка живе тут ще з часів Австро-Угорщини, опинитися серед своїх, побачити, як у них тут гарно і затишно.\n' +
        '\n' +
        'Щасливого Різдва!'
    }
  }]
]

// jest has a bug where concurrent tests start earlier than beforeAll,
// so we just wait for promises manually
const browser = await getBrowserAndSetupFB({
  user: config.EMAIL,
  pass: config.PASSWORD,
})

afterAll(async () => {
  console.log('afterAll')
  await browser.close()
})

describe('scrapePost', () => {

  data.forEach(([name, params]) => {
    test(name, async () => {
      console.log('IN TEST', name)

      let actual = await scrapePost({
        browser,
        url: params.url
      })

      expect(actual).toMatchObject(
        params.expected
      )
    }, 60000)
  })
})

