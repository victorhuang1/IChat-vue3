<template>
    <div>
        <div class="im-chat-textarea">
      <textarea
              :placeholder="placeholder"
              v-model="currentContent"
              @keydown="handleKeyDownEvent"
      >
      </textarea>
        </div>
        <div class="im-chat-bottom">
            <div class="im-chat-btn-bar">
        <span class="im-btn-close" title="关闭对话框">
          关闭(<b class="_font">C</b>)
        </span>
                <span class="im-btn-send" :title="enterPrompt" @click="handleSend">
          发送(<b class="_font">S</b>)
        </span>
                <span class="im-send-set" ref="setting" @click="doToggle">
          <em class="icon-edge"></em>
        </span>
                <ul ref="reference" :class="['im-menu-box', setBoxDisplay ? 'display' : '']" >
                    <li :class="[enterType?'im-this':'']" @click="selectEnter(true)">
                        <i v-show="enterType" class="im-icon i-icon-select-bold"></i>
                        按Enter键发送消息
                    </li>
                    <li :class="[enterType?'':'im-this']" @click="selectEnter(false)">
                        <i class="im-icon i-icon-select-bold"></i>
                        按Ctrl+Enter键发送消息
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import {on, off} from '../../util/dom'

    export default {
        name: "enter-box",
        componentName: "EnterBox",
        props: {
            // 占位符
            placeholder: {
                type: String,
                default: "请输入内容...",
            },
            // 输入值
            value: {
                default: "",
            },
            // 回车发送事件
            onEnter: {
                type: Function,
                default: () => {
                }
            },
            // 对话关闭事件
            onChatClose:{
                type: Function,
                default: () => {
                }
            }
        },
        data() {
            return {
                currentContent: "",
                setBoxDisplay: false,
                // 发送模式
                enterType: true,
            };
        },
        emits: ["input", "submit"],
        computed: {
            // 提示
            enterPrompt() {
                return this.enterType
                    ? "按Enter发送，按住Ctrl+Enter换行"
                    : "按Ctrl+Enter发送，按住Enter换行";
            },
        },
        watch: {
            value: {
                handler() {
                    this.currentContent = this.value;
                },
                immediate: true,
            },
            currentContent: {
                handler(newval) {
                    const msg = newval;
                    this.$emit("input", msg);
                },
                immediate: true,
            },
        },
        methods: {
            doToggle() {
                this.setBoxDisplay = !this.setBoxDisplay;
            },
            selectEnter(flag) {
                this.enterType = flag;
            },
            // 输入框对焦
            handleInputFocus() {
                this.$refs.input.focus();
            },
            handleCloseEvent() {
                this.$emit("closeChat");
            },
            //  判断
            handleSetBoxDisplay(e) {
                let reference = this.$refs.reference;
                let setting = this.$refs.setting;
                if (
                    !setting ||
                    !reference ||
                    setting.contains(e.target) ||
                    reference.contains(e.target)
                )
                    return;
                this.setBoxDisplay = false;
            },
            // 数据格式往上抛
            handleSend() {
                if (!this.currentContent) return;
                this.onEnter(this.currentContent);
                this.$nextTick(() => {
                    this.currentContent = "";
                });
            },
            handleKeyDownEvent(ev) {
                let keyCode = ev.keyCode;
                let ctrlKey = ev.ctrlKey;
                if (ctrlKey && keyCode === 13 && !this.enterType) {
                    this.handleSend();
                }
                if (keyCode === 13 && this.enterType) {
                    if (ctrlKey) {
                        this.currentContent += "\n";
                    } else {
                        ev.preventDefault();
                        this.handleSend();
                    }
                }
            },
        },
        unmounted() {
            off(document, "click", this.handleSetBoxDisplay);
        },
        mounted() {
            // 监听 鼠标点击事件 判断setbox 的显示
            on(document, "click", this.handleSetBoxDisplay);
        },
    };
</script>

<style scoped>
    ._font {
        text-decoration: underline;
    }
</style>
