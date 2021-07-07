<script>
    import {h} from "vue";
    import {ConvertContext, dateFormat} from "./convertContext";
    import {default_avatar} from "../../static";

    export default {
        name: "talk-item",
        props: {
            // 聊天内容
            item: {
                type: Object,
                default: () => {
                },
            },
            // 对话内容点击
            onTalkClick: {
                type: Function,
                default: () => {
                },
            },
            // 说话人信息点击事件
            onTalkUserClick: {
                type: Function,
                default: () => {
                },
            },
        },
        render() {
            let {item, onTalkClick, onTalkUserClick} = this;
            const {mine, username, avatar, timestamp} = item;
            let leftName = mine ? "" : username;
            let rightName = mine ? username : "";
            let time = dateFormat(timestamp);
            let tempAvater = avatar || default_avatar;
            // 讲话人信息  这里使用jsx 会更为直观
            const el_talk_info = (
              <div class="content-user">
                <img src={tempAvater} />
                <cite>
                  {leftName}
                  <i>{time}</i>
                  {rightName}
                </cite>
              </div>
            );

            // 具体查看 render 2.x 与 3.x的变化 https://v3.cn.vuejs.org/guide/migration/render-function-api.html#_3-x-%E8%AF%AD%E6%B3%95-2
            let contentHtml = h('div', {innerHTML: ConvertContext(item.content)});
            // 对话内容
            const el_talk_content = h(
                "div",
                {
                    class: "content-text",
                    onClick: (ev) => {
                        onTalkClick(item);
                    },
                },
                [contentHtml]
            );
            // 组装对话内容
            const el_talk_item = h(
                "li",
                {
                    class: [item.mine ? "content-mine" : ""],
                },
                [el_talk_info, el_talk_content]
            );
            return el_talk_item;
        },
    };
</script>
