<template>
  <div :class="classes" @mousedown.prevent>
    <!--左侧的快捷方式-->
    <div :class="[prefixCls + '-sidebar']" v-if="shortcuts.length">
      <div :class="[prefixCls + '-shortcut']" v-for="shortcut in shortcuts" @click="handleShortcutClick(shortcut)">{{ shortcut.text }}</div>
    </div>
    <!--日期时间及周次展示窗口-->
    <div :class="[prefixCls + '-body']">
      <!--顶部标题栏 《 < 2020年12月 > 》-->
      <div :class="[datePrefixCls + '-header']" v-show="currentView !== 'time'">
        <span :class="iconBtnCls('prev', '-double')" @click="changeYear(-1)"><Icon type="ios-arrow-back"></Icon></span>
        <span v-if="pickerTable === 'date-table' || pickerTable === 'week-table'" :class="iconBtnCls('prev')" @click="changeMonth(-1)"
              v-show="currentView === 'date' || currentView === 'week'"><Icon type="ios-arrow-back"/></span>
        <date-panel-label :date-panel-label="datePanelLabel" :current-view="pickerTable.split('-').shift()" :date-prefix-cls="datePrefixCls"/>
        <span :class="iconBtnCls('next', '-double')" @click="changeYear(+1)"><Icon type="ios-arrow-forward"></Icon></span>
        <span v-if="pickerTable === 'date-table' || pickerTable === 'week-table'" :class="iconBtnCls('next')" @click="changeMonth(+1)"
              v-show="currentView === 'date' || currentView === 'week'"><Icon type="ios-arrow-forward"/></span>
      </div>
      <!--日期选择窗口-->
      <div :class="[prefixCls + '-content']">
        <component :is="pickerTable" ref="pickerTable" v-if="currentView !== 'time'" :table-date="panelDate" :show-week-numbers="showWeekNumbers" :value="dates"
                   :selection-mode="selectionMode" :disabled-date="disabledDate" :focused-date="focusedDate" @on-pick="panelPickerHandlers"
                   @on-pick-click="handlePickClick"/>
      </div>
      <!--时间选择窗口-->
      <div :class="[prefixCls + '-content']" v-show="isTime">
        <time-picker ref="timePicker" v-if="currentView === 'time'" :value="dates" :format="format" :time-disabled="timeDisabled" :disabled-date="disabledDate"
                     :focused-date="focusedDate" v-bind="timePickerOptions" @on-pick="handlePick" @on-pick-click="handlePickClick"
                     @on-pick-clear="handlePickClear" @on-pick-success="handlePickSuccess" @on-pick-toggle-time="handleToggleTime"/>
      </div>
      <!--footer-->
      <Confirm v-if="confirm" :show-time="showTime" :is-time="isTime" @on-pick-toggle-time="handleToggleTime" @on-pick-clear="handlePickClear"
               @on-pick-success="handlePickSuccess"/>
    </div>
  </div>
</template>
<script>
    import Icon from '../../icon/icon.vue';
    import YearTable from '../../base/year-table.vue';
    import WeekTable from '../../base/week-table.vue';
    import MonthTable from '../../base/month-table.vue';
    import DateTable from '../../base/date-table.vue';
    import TimePicker from '../Time/time.vue';
    import Confirm from '../../base/confirm.vue';
    import datePanelLabel from './date-panel-label.vue';
    import Mixin from '../panel-mixin';
    import DateMixin from './date-panel-mixin';
    import Locale from '../../mixins/locale';
    import {siblingMonth, formatDateLabels} from '../../util';

    const prefixCls = 'ivu-picker-panel';
    const datePrefixCls = 'ivu-date-picker';

    export default {
        name: 'DatePickerPanel',
        mixins: [Mixin, Locale, DateMixin],
        components: {Icon, YearTable, MonthTable, WeekTable, DateTable, TimePicker, Confirm, datePanelLabel},
        props: {
            // more props in the mixin
            multiple: {type: Boolean, default: false}
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
        computed: {
            print() {
                return params => {
                    console.log(params.name, params)
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
                return {separator: separator, labels: labels.map(obj => ((obj.handler = handler(obj.type)), obj))};
            },
            timeDisabled() {
                return !this.dates[0];
            }
        },
        watch: {
            value(newVal) {
                this.dates = newVal;
                if (this.selectionMode.startsWith('date')) {
                    const panelDate = this.multiple ? this.dates[this.dates.length - 1] : (this.startDate || this.dates[0]);
                    this.panelDate = panelDate || new Date();
                } else {
                    this.panelDate = this.startDate || (this.multiple ? this.dates[this.dates.length - 1] : this.dates[0]) || new Date();
                }
            },
            currentView(currentView) {
                this.$emit('on-selection-mode-change', currentView);

                if (this.currentView === 'time') {
                    this.$nextTick(() => {
                        const spinner = this.$refs.timePicker.$refs.timeSpinner;
                        spinner.updateScroll();
                    });
                }
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
                if (this.pickerTable === 'year-table') this.pickerTable = 'month-table';
                else this.pickerTable = this.getTableType(this.currentView);

            },
            handlePick(value, type) {
                const {selectionMode, panelDate} = this;
                switch (selectionMode) {
                    case 'week':
                        value = this.getFirstDayOfWeek(value)
                        break
                    case 'year':
                        value = new Date(value.getFullYear(), 0, 1).format(this.format)
                        break
                    case 'month':
                        value = new Date(panelDate.getFullYear(), value.getMonth(), 1).format(this.format)
                        break
                    default:
                        value = new Date(value).format(this.format)
                }
                this.dates = [value];
                this.$emit('on-pick', value, false, type || selectionMode);
            },
            getFirstDayOfWeek(date) {
                const weekStartDay = Number(this.t('i.datepicker.weekStartDay'));
                let myDate = new Date(date.year, 0, 1)
                let week = myDate.getDay()
                return new Date(date.year, 0, (date.week - 2) * 7 + 8 - week + weekStartDay);
            }
        },
    };
</script>
