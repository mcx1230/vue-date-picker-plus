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

```vue
<template>
    <div style="width: 100%; text-align: center">
      年-首天
      <datePickerPlus type="year" format="yyyy-MM-dd" style="width: 120px" v-model="yearDate" @on-change="handleDateChange('year')"/>
      {{yearRange[0]}}~{{yearRange[1]}}<br>
      季-首天
      <datePickerPlus type="quarter" format="yyyy-MM-dd" style="width: 120px" v-model="quarterDate" @on-change="handleDateChange('quarter')"/>
      {{quarterRange[0]}}~{{quarterRange[1]}}<br>
      月-首天
      <datePickerPlus type="month" format="yyyy-MM-dd" style="width: 120px" v-model="monthDate" @on-change="handleDateChange('month')"/>
      {{monthRange[0]}}~{{monthRange[1]}}<br>
      周-首天
      <datePickerPlus type="week" format="yyyy-MM-dd" style="width: 120px" v-model="weekDate" @on-change="handleDateChange('week')"/>
      {{weekRange[0]}}~{{weekRange[1]}}<br>
      日-当天
      <datePickerPlus type="date" format="yyyy-MM-dd" style="width: 120px" v-model="date" @on-change="handleDateChange('date')"/>
      {{dateRange[0]}}~{{dateRange[1]}}<br>
    </div>
</template>
<script>

    import datePickerPlus from './iview-date-picker-plus'
    export default {
        data:{
            return:{
                date: '2020-12-01',
                dateRange: '',
                yearDate: '2020-12-01',
                yearRange: [],
                weekDate: '2020-11-30',
                weekRange: [],
                monthDate: '2020-12-01',
                monthRange: [],
                quarterDate: '2020-10-01',
                quarterRange: [],
            }
        },
        methods: {
            handleDateChange(type) {
                let y, m, d, format = 'yyyy-MM-dd hh:mm:ss'
                switch (type) {
                    case 'year':
                        y = this.yearDate.getFullYear()
                        this.yearRange = [new Date(y, 0, 1).format(format), new Date(y, 11, 31, 23, 59, 59).format(format)]
                        break
                    case 'quarter':
                        y = this.quarterDate.getFullYear()
                        m = this.quarterDate.getMonth()
                        this.quarterRange = [new Date(y, m, 1).format(format), new Date(y, m + 3, 0, 23, 59, 59).format(format)]
                        break
                    case 'month':
                        y = this.monthDate.getFullYear()
                        m = this.monthDate.getMonth()
                        this.monthRange = [new Date(y, m, 1).format(format), new Date(y, m + 1, 0, 23, 59, 59).format(format)]
                        break
                    case 'week':
                        y = this.weekDate.getFullYear()
                        m = this.weekDate.getMonth()
                        d = this.weekDate.getDate()
                        this.weekRange = [new Date(y, m, d).format(format), new Date(y, m, d + 6, 23, 59, 59).format(format)]
                        break
                    case 'date':
                        y = this.date.getFullYear()
                        m = this.date.getMonth()
                        d = this.date.getDay() - 1
                        this.dateRange = [new Date(y, m, d).format(format), new Date(y, m, d, 23, 59, 59).format(format)]
                }
            },
        },
        mounted:{
            let types = ['year', 'quarter', 'month', 'week', 'date']
            types.forEach(item => {
                this.handleDateChange(item)
            })
        }
    }
</script>
```
更多参考[DatePickerPlus](https://www.iviewui.com/components/date-picker)


