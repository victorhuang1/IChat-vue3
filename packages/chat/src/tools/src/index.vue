<template>
    <div class="im-chat-toolbar">
        <div class="im-chat-tools">
            <tool-emoji :bindEmoji="bindEmoji"></tool-emoji>
            <tool-upload :bind-upload="bindUpload"></tool-upload>
        </div>
    </div>
</template>

<script>
    import ToolEmoji from './tool-emoji';
    import ToolUpload from './tool-upload'

    export default {
        name: "tools-index",
        componentName: "toolsIndex",
        components: {
            ToolEmoji,
            ToolUpload,
        },
        props: {
            // 绑定表情
            bindEmoji: {
                type: Function,
                default: () => {
                }
            },
            // 文件上传
            bindUpload: {
                type: Function,
                default: () => {
                }
            },
        }
    };
</script>

<style scoped>


</style>