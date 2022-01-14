import VkApi from "../API/api";
const Page = require('./page');
import logger from '@wdio/logger'
let config = require('../../config')


const log = logger(config.projectName)


class MainPage extends Page {

    lastPost = '#page_wall_posts > div'
    wpt = '#wpt'
    likeWall = "div.like_wrap._like_wall"
    post = '#post'
    postText = " > div > div.post_content > div > div.wall_text"
    updatedPostText = "> div.post_highlight_updated_content"

    get latestPost() {
        return $(this.lastPost).getAttribute("id")
    }

    async getUserId() {
        let user_id
        return browser.call(() => {
            return VkApi.getUserId()
                .then(data => user_id = data)
                .catch(err => log.info(err))
        })
    }

    async wallRandomPost() {
        let post_id
        return browser.call(() => {
            return VkApi.postRandomWallPost()
                .then(data => post_id = data)
                .catch(err => log.info(err))
        })
    }

    async wallPostImage(user_id, image_path) {
        let image
        return browser.call(() => {
            return VkApi.postImageToWall(user_id, image_path)
                .then(data => image = data)
                .catch(err => log.info(err))
        })
    }

    async wallPostEdit(post_id, image="", message="") {
        return browser.call(() => {
            return VkApi.editWallPost(post_id, image, message)
                .then(data => post_id = data)
                .catch(err => log.info(err))
        })
    }

    async wallPostAddComment(post_id, message) {
        return browser.call(() => {
            return VkApi.addPostComment(post_id, message)
        })
    }

    async getPostLike(post_id) {
        return browser.call(() => {
            return VkApi.getPostLikes(post_id)
        })
    }

    async deleteWallPost(post_id) {
        return browser.call(() => {
            VkApi.deletePost(post_id)
        })
    }

    async getPostComment(user_id, post_id) {
        return $(this.wpt + user_id + '_' + post_id).getText()
    }

    async wallPostLike(user_id, post_id) {
        return $(this.likeWall + user_id + "_" + post_id + " > div > div > div").click()
    }

    async getEditedPostMessage(user_id, post_id) {
        await browser.waitUntil(
            async () => (await $(this.post + user_id + '_' + post_id + this.postText + this.updatedPostText).getText()), {timeout: config.defaultTimeoutTime})
        return $(this.post + user_id + '_' + post_id + this.postText)
    }

    async lastPostId(user_id, post_id) {
        await browser.waitUntil(
            async () => (await $(this.post + user_id + '_' + post_id).getText()), {timeout: config.defaultTimeoutTime})
        let posted_id = await this.latestPost
        return posted_id.split("_")[1]
    }

    open() {
        return $('#l_pr').click();
    }
}

module.exports = new MainPage();
