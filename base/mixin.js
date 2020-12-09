import {clearHours} from '../util';

export default {
    name: 'PanelTable',
    props: {
        tableDate: {type: Date, required: true},
        disabledDate: {type: Function},
        selectionMode: {type: String, required: true},
        value: {type: Array, required: true},
        focusedDate: {type: Date, required: true,},
        rangeState: {
            type: Object,
            default: () => ({
                from: null,
                to: null,
                selecting: false
            })
        },
    },
    computed: {
        dates() {
            const {selectionMode, value, rangeState} = this;
            const rangeSelecting = selectionMode === 'range' && rangeState.selecting;
            return rangeSelecting ? [rangeState.from] : value;
        },
    },
    methods: {
        handleClick(cell, e) {
            if(this.selectionMode === 'week'){
                if (cell.type !== 'weekLabel') return
                this.$emit('on-pick', cell);
                this.$emit('on-pick-click');
            }
            e.stopPropagation();
            if (cell.disabled || cell.type === 'weekLabel') return;
            this.$emit('on-pick', new Date(clearHours(cell.date)));
            this.$emit('on-pick-click');
        },
        handleMouseMove(cell) {
            if (!this.rangeState.selecting) return;
            if (cell.disabled) return;
            const newDate = cell.date;
            this.$emit('on-change-range', newDate);
        },
    }
};
