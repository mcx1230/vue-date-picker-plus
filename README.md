# iview-date-picker-plus


## 使用方法


###1. main.js
```js
import Vue from 'vue'
import iviewDatePickerPlus from 'iview-date-picker-plus'
Vue.component('iview-date-picker-plus', iviewDatePickerPlus)
```
###2. 页面vue文件
```js
<template lang="html">
<div>
    <iview-date-picker-plus type='week' :value="value3" confirm multiple show-week-numbers placeholder="请选择第几周" type="date" style="width:550px;" @on-change="value3 = $event"></iview-date-picker-plus>
</div>
</template>

<script>
export default {
    data() {
        return {
            value3: ['2019-02-20]
        }
    }
}
</script>
```  
更多参考[DatePickerPlus](https://www.iviewui.com/components/date-picker)


