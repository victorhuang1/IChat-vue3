<script>
    import TalkItem from "./talk-item";
    import {h, renderList, watch, ref, nextTick, computed, getCurrentInstance, onUpdated, onMounted} from "vue";
    import Scroll from '../../util/scroll'

    export default {
        name: "talk-list",
        componentName: "talkList",
        components: {
            TalkItem,
        },
        props: {
            //是否是当前对话框,由父级组件提供
            current: {
                type: Boolean,
                default: false,
            },
            //聊天记录
            list: {
                type: Array,
                default: () => [],
            },
            // 对话内容点击
            onTalkClick: {
                type: Function,
                default: () => {
                },
            },
            // 提交未读
            onUnread: {
                type: Function,
                default: () => {
                },
            }
        },
        /**
         *
         * @param props
         * @param ctx
         */
        setup(props, ctx) {
            // 滚动条组件
            const domScroller = ref(null);
            // 查看历史按钮显示
            const historyBtnDisplay = ref(false);
            //下载历史
            const loadHistory = ref(false);

            const instance = getCurrentInstance();

            const isBottom = computed(() => {
                return domScroller && domScroller.value.isBottom;
            });

            /**
             *  关键代码，计算未读数
             *   如果要监听 parent  setup 创建的属性目前我找到只能通过setup 去绑定关系
             * */
            watch(props.list, newVal => {
                if (newVal) {
                    nextTick(() => {
                        // 更新节点
                        updateNode();
                        // 下载记录历史
                        /**
                         *    这里的延时的原因
                         *    是因为发送图片，render的时间太长
                         */
                        setTimeout(() => {
                                if (loadHistory.value) {
                                    cleanerTopTip();
                                    domScroller.value.refresh();
                                    domScroller.value.toBeforePosition()
                                }
                                if (props.current && isBottom) {
                                    domScroller.value.scrollToBottom();
                                }
                                //还有一种情况是自己发送的。
                            }
                            , 100);
                    });
                }
            });

            // 初始化 scroll
            const initScroll = () => {
                const dom = instance.refs.scroller;
                // 初始化
                domScroller.value = new Scroll(dom, {
                    click: true,
                    scrollbars: true,
                    mouseWheel: true,
                    preventDefault: false,
                    interactiveScrollbars: true,
                    hijackInternalLinks: true,
                    // useTransform: false,
                });

                dom.addEventListener(
                    "ontouchstart" in window ? "touchstart" : "mousedown",
                    function (e) {
                        //阻止冒泡事件
                        e.stopPropagation();
                    }
                );
                // 停止滚动时触发。
                domScroller.value.on("scrollEnd", function () {
                    scrollTop();
                    domScroller.value.savePosition();
                });
            };

            // 是否触顶
            const scrollTop = () => {
                const {isTop} = domScroller.value;
                if (isTop) {
                    // 后期自动拉取历史再改进
                    historyBtnDisplay.value = true;
                    return;
                }
                cleanerTopTip();
            };

            // 清除 top tip
            const cleanerTopTip = () => {
                loadHistory.value = false;
                historyBtnDisplay.value = false;
            };

            // 更新聊天节点
            const updateNode = () => {
                const parent = instance.refs.main;
                if (!parent) return;
                const childes = parent.children;
                for (let el of childes) {
                    const top = el.offsetTop;
                    domScroller.value.addNode(top, el);
                }
            };

            // 加载完成后触发
            onMounted(() => {
                initScroll();
            });

            return {
                domScroller,
                isBottom,
                historyBtnDisplay,
                loadHistory,
            }
        },
        watch: {
            /**
             *   current 是布尔类型，如果在setup 直接使用 `watch()` 函数监听会警告
             * @param newVal
             * @param oldVal
             */
            current(newVal, oldVal) {
                // 是否是当前窗口
                if (newVal) {
                    /**
                     *  如果原先就是在底部，新消息就自动往下滚动
                     * @type {default.computed.isBottom|(function(): (null|default.computed.isBottom|(function())|*))}
                     */
                    let reset = this.isBottom;
                    this.domScroller.refresh();
                    if (reset) {
                        this.domScroller.scrollToBottom();
                    }
                }
                // 新旧窗口交替
                if (!newVal && oldVal) {
                    // 清空未读
                    this.domScroller.read();
                }
            },
            /**
             * 这里通过 watch unread 进行双向绑定，省去了在流程中手动去调用 onUnread 。
             * 当前这会造成性能上的消耗，但这更好维护！
             *  "domScroller.unread"  可以分解为以下代码
             * computed:{
         *      unread() {
         *        const { unread = 0 } = this.domScroller || {};
         *       return unread;
         *      },
         * },
             * unread(newVal){
         *  this.onUnread(newVal);
         *  }
             * @returns {number}
             */
            "domScroller.unread"(newVal) {
                this.onUnread(newVal);
            }
        },
        methods: {
            // 计算是否已经加载,避免没加载完计算 scroll
            calcLoaded() {
                let el = this.$el;
                if (!el) return;
                let width = el.clientWidth
                //有宽度表示页面被显示了,并且只会触发一次。
                if (width > 0) {
                    if (!this.loaded) {
                        this.loaded = true;
                        this.domScroller.refresh();
                    }
                } else {
                    this.loaded = false;
                }
            },
            // 拉取历史记录
            handleHistory() {
                //锁住拉取
                this.loadHistory = true;
                // this.$emit("loadHistory");
            },
        },
        updated() {
            // 解决聊天窗口发生变化，滚动条不会自动计算问题。
            this.calcLoaded()
        },
        render() {
            let {list, onTalkClick} = this;
            const el_talk_list = renderList(list, (item) => {
                return h(TalkItem, {
                    item,
                    onTalkClick,
                });
            });

        const el_talk = (
          <div
            class={{
              "im-chat-content": true,
              listActive: false,
            }}
            ref="scroller"
          >
            <ul ref="main" class="talk-list">
              {el_talk_list}
            </ul>
          </div>
        );
        return el_talk;
  },
};
</script>
