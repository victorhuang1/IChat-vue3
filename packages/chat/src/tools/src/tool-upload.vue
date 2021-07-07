<template>
             <span class="im-chat-tool-item" title="发送图片">
                  <i class="i-icon-picture"></i>
                <input ref="uploadImage" type="file" @change="uploadChange"/>
            </span>
</template>

<script>

    export default {
        name: "tool-upload",
        componentName: "ToolUpload",
        props: {
            // 文件上传
            bindUpload: {
                type: Function,
                default: () => {
                }
            },
        },
        inject: ["rootChat"],
        methods: {
            // 上传图片
            uploadChange(type) {
                const input = this.$refs.uploadImage;
                const file = input.files[0];
                const val = input.value;
                if (!val) {
                    return;
                }
                this.$refs.uploadImage.value = '';
                let ext = this.rootChat.config.fileExt | "";
                //校验文件
                switch (type) {
                    case 'file': //一般文件
                        if (ext && !RegExp('\\w\\.(' + ext + ')$', 'i').test(escape(val))) {
                            console.log("不支持该文件格式")
                            return input.value = '';
                        }
                        type = 'file';
                        break;
                    case 'video': //视频文件
                        if (!RegExp('\\w\\.(' + (ext || 'avi|mp4|wma|rmvb|rm|flash|3gp|flv') + ')$', 'i').test(escape(val))) {
                            console.log("不支持该视频格式")
                            return input.value = '';
                        }
                        break;
                    case 'audio': //音频文件
                        if (!RegExp('\\w\\.(' + (ext || 'mp3|wav|mid') + ')$', 'i').test(escape(val))) {
                            console.log("不支持该音频格式")
                            return input.value = '';
                        }
                        break;
                    default: //图片文件
                        if (!RegExp('\\w\\.(' + (ext || 'jpg|png|gif|bmp|jpeg') + ')$', 'i').test(escape(val))) {
                            console.log("不支持该图片格式")
                            return input.value = '';
                        }
                        type = 'img';
                        break;
                }
                // 上传文件
                this.bindUpload(type,file);
            }
        }
    }

</script>