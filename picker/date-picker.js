import Picker from '../picker.vue';
import quarterPanel from '../panel/Quarter/quarterPanel.vue'
import DatePickerPanel from '../panel/Date/date.vue';
import RangeDatePickerPanel from '../panel/Date/date-range.vue';

import {oneOf} from '../utils/assist';

export default {
    name: 'CalendarPicker',
    mixins: [Picker],
    props: {
        type: {
            validator(value) {
                return oneOf(value, ['year', 'quarter', 'month', 'week', 'date', 'daterange', 'datetime', 'datetimerange']);
            },
            default: 'date'
        },
    },
    components: {DatePickerPanel, RangeDatePickerPanel, quarterPanel},
    computed: {
        panel() {
            if (this.type === 'time') this.confirm = true
            if (this.type === 'week') this.showWeekNumbers = true
            const isRange = this.type === 'daterange' || this.type === 'datetimerange';
            return this.type === 'quarter' ? 'quarterPanel' : (isRange ? 'RangeDatePickerPanel' : 'DatePickerPanel');
        },
        ownPickerProps() {
            return this.options;
        }
    },

    //Todo 原控件使用起来不方便的地方， 1.显示的数据和value绑定返回的数据格式不一致 2.时间选择框没有默认confirm
};
