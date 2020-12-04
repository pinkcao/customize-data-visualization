<template>
  <div>
    <div class="title-box-page">页面设置</div>
  </div>
</template>

<script>
import { maker } from '@form-create/element-ui'

export default {
  name: 'pageSet',
  data() {
    return {
      fApi: {},
      model: {},
      //表单生成规则
      rule: [maker.input('商品名称', 'goods_name'), maker.date('创建时间', 'created_at')],
      //组件参数配置
      option: {
        //表单提交事件
        onSubmit: function(formData) {
          alert(JSON.stringify(formData))
        }
      }
    }
  },
  computed: {},

  created() {},
  mounted() {},

  methods: {}
}
</script>

<style lang="less">
.title-box-page {
  width: 100%;
  height: 30px;
  background-color: #333b45;
  color: #bcc9d4;
  text-align: center;
  font-size: 12px;
  line-height: 30px;
}
</style>
