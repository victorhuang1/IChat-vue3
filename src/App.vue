<template>
    <div>
        <IChat ref="IChat" :chats="chats" :config="config" @enter="handlerEnter" @chat-remove="handleChatRemove" @chat-click="handleChatClick"></IChat>
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                config: {
                    //简约模式
                    brief: true,
                    // 标签是否可以删除
                    tabRemove: true,
                    // 窗口是否可以越界
                    moveOut: true,
                },
                mine: {
                    id: "10001",
                    username: "july-meteor",
                    status: "online",
                    sign: "与其感慨路难行,不如马上出发！"
                },
                chats: [
                    {
                        id: 2,
                        name: "好友1",
                        type: "friend",
                        online: true,
                    },
                    {
                        id: 3,
                        name: "群组",
                        type: "group",
                        online: false,
                    },
                ],
            };
        },
        methods: {
            /**
             *  处理窗口删除事件
             */
            handleChatRemove(data){
                let channels = this.chats;
                let len = channels.length;
                let ary = [];
                for (let i = 0; i < len; i++) {
                    let model = channels[i];
                    if (model.id != data.id) {
                        ary.push(model);
                    }
                }
                this.chats = ary;
            },
            handleChatClick(pane){
                console.log(pane);

            },
            handlerEnter(data) {
                console.log("发送内容", {data});
                const {mine, to, content, timestamp} = data;
                let message = {
                    //消息来源用户名
                    username: mine.username,
                    //消息来源用户头像
                    avatar: mine.avatar,
                    //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
                    id: to.id,
                    //聊天窗口来源类型，从发送消息传递的to里面获取
                    type: to.type,
                    //消息内容
                    content,
                    //消息id，可不传。除非你要对消息进行一些操作（如撤回）
                    cid: 0,
                    //是否我发送的消息，如果为true，则会显示在右方
                    mine: true,
                    //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
                    fromid: mine.id,
                    //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
                    timestamp,
                };
                //
                this.$refs.IChat.getMessage(message);
            },
            // 未读消息单元测试
            unitTestUnread(){
                const time = 1000;
                setInterval(()=>{
                    let message = {
                        username: "单元测试",
                        id: 3,
                        type: "group",
                        //消息内容
                        content:"未读消息单元测试",
                        cid: 0,
                        mine: false,
                        fromid:10000,
                        timestamp:new Date(),
                    };
                    this.$refs.IChat.getMessage(message);
                },time);
            },

        },
        mounted(){
            this.unitTestUnread();
        }
    };
</script>