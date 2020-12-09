import {oneOf} from '../../utils/assist';
import {initTimeDate} from '../../util';


export default {
    props: {
        showTime: {type: Boolean, default: false},
        format: {type: String, default: 'yyyy-MM-dd'},
        shortcuts: {type: Array, default: () => []},
        disabledDate: {type: Function, default: () => false},
        value: {type: Array, default: () => [initTimeDate(), initTimeDate()]},
        timePickerOptions: {default: () => ({}), type: Object,},
        showWeekNumbers: {type: Boolean, default: false},
        startDate: {type: Date},
        pickerType: {type: String, require: true},
        focusedDate: {type: Date, required: true},
        selectionMode: {
            type: String,
            validator(value) {
                return oneOf(value, ['year', 'quarter', 'month', 'week', 'date', 'time']);
            },
            default: 'date'
        },
    },
    computed: {
        isTime() {
            return this.currentView === 'time';
        }
    },
    methods: {
        handleToggleTime() {
            this.currentView = this.currentView === 'time' ? 'date' : 'time';
        },
    }
};
