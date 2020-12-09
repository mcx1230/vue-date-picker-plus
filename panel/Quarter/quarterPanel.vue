<template>
  <div :class="classes" @mousedown.prevent>
    <div :class="[prefixCls + '-body']">
      <div :class="[datePrefixCls + '-header']" v-show="currentView !== 'time'">
        <span :class="iconBtnCls('prev', '-double')" @click="changeYear(-1)"><Icon type="ios-arrow-back"></Icon></span>
        <date-panel-label :date-panel-label="datePanelLabel" :current-view="pickerTable.split('-').shift()" :date-prefix-cls="datePrefixCls"/>
        <span :class="iconBtnCls('next', '-double')" @click="changeYear(+1)"><Icon type="ios-arrow-forward"></Icon></span>
      </div>
      <div :class="[prefixCls + '-content']">
        <component :is="pickerTable" ref="pickerTable" v-if="currentView !== 'time'" :table-date="panelDate" :show-week-numbers="showWeekNumbers"
                   :value="dates" :selection-mode="selectionMode" :disabled-date="disabledDate" :focused-date="focusedDate" @on-pick="panelPickerHandlers"
                   @on-pick-click="handlePickClick"/>
      </div>
      <Confirm v-if="confirm" :show-time="showTime" :is-time="isTime" @on-pick-toggle-time="handleToggleTime" @on-pick-clear="handlePickClear"
               @on-pick-success="handlePickSuccess"/>
    </div>
  </div>
</template>
<script>
    import Icon from '../../icon/icon.vue';
    import DateTable from '../../base/date-table.vue';
    import YearTable from '../../base/year-table.vue';
    import QuarterTable from '../../base/quarter-table.vue'
    import MonthTable from '../../base/month-table.vue';
    import Confirm from '../../base/confirm.vue';
    import Mixin from '../panel-mixin';
    import QuarterMixin from './quarter-panel-mixin';
    import Locale from '../../mixins/locale';
    import datePanelLabel from '../Date/date-panel-label.vue'

    import {siblingMonth, formatDateLabels} from '../../util';

    const prefixCls = 'ivu-picker-panel';
    const datePrefixCls = 'ivu-date-picker';

    export default {
        name: 'DatePickerPanel',
        mixins: [Mixin, Locale, QuarterMixin],
        components: {Icon, DateTable, YearTable, QuarterTable, MonthTable, Confirm, datePanelLabel},
        props: {
            // more props in the mixin
            multiple: {type: Boolean, default: false}
        },
        computed: {
            print() {
                return params => {
                    console.log(params)
                    return params
                }
            },
            classes() {
                return [
                    `${prefixCls}-body-wrapper`,
                    {
                        [`${prefixCls}-with-sidebar`]: this.shortcuts.length
                    }
                ];
            },
            panelPickerHandlers() {
                return this.pickerTable === `${this.currentView}-table` ? this.handlePick : this.handlePreSelection;
            },
            datePanelLabel() {
                const locale = this.t('i.locale');
                const datePanelLabel = this.t('i.datepicker.datePanelLabel');
                const date = this.panelDate;
                const {labels, separator} = formatDateLabels(locale, datePanelLabel, date);

                const handler = type => {
                    return () => this.pickerTable = this.getTableType(type);
                };

                return {
                    separator: separator,
                    labels: labels.map(obj => ((obj.handler = handler(obj.type)), obj))
                };
            },
            timeDisabled() {
                return !this.dates[0];
            }
        },
        data() {
            const {selectionMode, value} = this;

            const dates = value.slice().sort();
            return {
                prefixCls: prefixCls,
                datePrefixCls: datePrefixCls,
                currentView: selectionMode || 'date',
                pickerTable: this.getTableType(selectionMode),
                dates: dates,
                panelDate: this.startDate || dates[0] || new Date()
            };
        },
        watch: {
            value(newVal) {
                this.dates = newVal;
                const panelDate = this.multiple ? this.dates[this.dates.length - 1] : (this.startDate || this.dates[0]);
                this.panelDate = panelDate || new Date();
            },
            currentView(currentView) {
                this.$emit('on-selection-mode-change', currentView);
            },
            selectionMode(type) {
                this.currentView = type;
                this.pickerTable = this.getTableType(type);
            },
            focusedDate(date) {
                const isDifferentYear = date.getFullYear() !== this.panelDate.getFullYear();
                const isDifferentMonth = isDifferentYear || date.getMonth() !== this.panelDate.getMonth();
                if (isDifferentYear || isDifferentMonth) {
                    if (!this.multiple) this.panelDate = date;
                }
            }
        },
        methods: {
            reset() {
                this.currentView = this.selectionMode;
                this.pickerTable = this.getTableType(this.currentView);
            },
            changeYear(dir) {
                if (this.selectionMode === 'year' || this.pickerTable === 'year-table') {
                    this.panelDate = new Date(this.panelDate.getFullYear() + dir * 10, 0, 1);
                } else {
                    this.panelDate = siblingMonth(this.panelDate, dir * 12);
                }
            },
            getTableType(currentView) {
                return currentView.match(/^time/) ? 'time-picker' : `${currentView}-table`;
            },
            changeMonth(dir) {
                this.panelDate = siblingMonth(this.panelDate, dir);
            },
            handlePreSelection(value) {
                this.panelDate = value;
                if (this.pickerTable === 'year-table') this.pickerTable = 'quarter-table';
                else this.pickerTable = this.getTableType(this.currentView);
            },
            handlePick(value, type) {
                const {selectionMode, panelDate} = this;
                if (selectionMode === 'year') value = new Date(value.getFullYear(), 0, 1);
                else if (selectionMode === 'month') value = new Date(panelDate.getFullYear(), value.getMonth(), 1);
                else value = new Date(value);

                this.dates = [value];
                this.$emit('on-pick', value, false, type || selectionMode);
            },
        },
    };
</script>
