<template>
    <span class="im-chat-tool-item " title="发送表情" ref="toolItem">
        <div class="emoji-box">
            <div class="content" v-show="setBoxDisplay">
                <ul class="clearfix" ref="emojiBox">
                    <li v-for="(item,key) in emojis" :key="item" @click="handleBindEmoji(key)">
                        <img :src="item"/>
                    </li>
                </ul>
            </div>
            <i class="i-icon-smile" @click="doToggle"></i>
        </div>
   </span>
</template>

<script>
    import emojis from '../../emoji';
    import {on, off} from '../../../../util/dom'

    export default {
        name: "tool-emoji",
        props: {
            // 绑定表情
            bindEmoji: {
                type: Function,
                default: () => {
                }
            }
        },
        data() {
            return {
                emojis,
                setBoxDisplay: false,
            }
        },
        methods: {

            // 绑定标签
            handleBindEmoji(emoji) {
                let content = `emoji${emoji}`;
                this.setBoxDisplay = false;
                this.bindEmoji(content)
            },
            doToggle() {
                this.setBoxDisplay = !this.setBoxDisplay;
            },
            // 控制 表情框显示与否
            handleEmojiBoxDiaplay(e) {
                let toolItem = this.$refs.toolItem;
                let emojiBox = this.$refs.emojiBox;
                if (
                    !emojiBox ||
                    !toolItem ||
                    emojiBox.contains(e.target) ||
                    toolItem.contains(e.target)
                )
                    return;
                this.setBoxDisplay = false;
            }
        },
        unmounted() {
            off(document, "click", this.handleEmojiBoxDiaplay);
        },
        mounted() {
            // 监听 鼠标点击事件 判断setbox 的显示
            on(document, "click", this.handleEmojiBoxDiaplay);
        },
    }
</script>

<style scoped>


    .emoji-box {

    }

    .emoji-box .content {
        position: absolute;
        z-index: 19891022;
        left: 0;
        top: -211px;
        padding: 0;
        overflow: auto;
        text-align: left;
        background-color: #fff;
        color: #666;
        line-height: 22px;
        margin: 0;
        border: none;
        background: 0 0;
        background-color: #fff;
        min-width: 12px;
        border-radius: 2px;
        box-shadow: 1px 1px 3px rgb(0 0 0 / 20%);
        font-size: 12px;
    }

    .clearfix:after {
        content: '';
        clear: both;
        height: 0;
        display: block;
        overflow: hidden;
    }

    .emoji-box ul {
        position: relative;
        width: 372px;
        padding: 10px;
        border: 1px solid #D9D9D9;
        background-color: #fff;
        box-shadow: 0 0 20px rgb(0 0 0 / 20%);
        display: block;
        list-style-type: disc;

    }

    .emoji-box li {
        cursor: pointer;
        float: left;
        border: 1px solid #e8e8e8;
        height: 22px;
        width: 26px;
        overflow: hidden;
        margin: -1px 0 0 -1px;
        padding: 4px 2px;
        text-align: center;
        box-sizing: content-box;
    }

</style>