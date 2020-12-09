<style lang="less">
  .classes {
    margin-top: 14px;

    span {
      width: 70px;
      height: 28px;
      line-height: 28px;
      margin: 10px 12px;
      border-radius: 3px;

      em {
        width: 70px;
        height: 28px;
        line-height: 28px;
        margin: 0;
      }
    }
  }
</style>

<template>
  <div :class="classes" class="classes">
        <span :class="getCellCls(cell)" v-for="cell in cells" @click="handleClick(cell, $event)" @mouseenter="handleMouseMove(cell)">
            <em>{{ cell.text }}</em>
        </span>
  </div>
</template>
<script>
    import {clearHours} from '../util';
    import {deepCopy} from '../utils/assist';
    import Locale from '../mixins/locale';
    import mixin from './mixin';
    import prefixCls from './prefixCls';

    export default {
        mixins: [Locale, mixin],
        props: {/* in mixin */},
        computed: {
            classes() {
                return [
                    `${prefixCls}`,
                    `${prefixCls}-quarter`
                ];
            },
            cells() {
                let cells = [];
                const cell_tmpl = {text: '', selected: false, disabled: false};
                const tableYear = this.tableDate.getFullYear();
                const selectedDays = this.dates.filter(Boolean).map(date => clearHours(new Date(date.getFullYear(), date.getMonth(), 1)));
                const focusedDate = clearHours(new Date(this.focusedDate.getFullYear(), this.focusedDate.getMonth(), 1));

                for (let i = 0; i < 4; i++) {
                    const cell = deepCopy(cell_tmpl);
                    cell.date = new Date(tableYear, 3 * i , 1)
                    cell.text = this.tCell(i + 1);
                    const day = clearHours(cell.date);
                    cell.disabled = typeof this.disabledDate === 'function' && this.disabledDate(cell.date) && this.selectionMode === 'quarter';
                    cell.selected = selectedDays.includes(day);
                    cell.focused = day === focusedDate;
                    cells.push(cell);
                }
                return cells;
            }
        },
        methods: {
            getCellCls(cell) {
                return [
                    `${prefixCls}-cell`,
                    {
                        [`${prefixCls}-cell-selected`]: cell.selected,
                        [`${prefixCls}-cell-disabled`]: cell.disabled,
                        [`${prefixCls}-cell-focused`]: cell.focused,
                        [`${prefixCls}-cell-range`]: cell.range && !cell.start && !cell.end
                    }
                ];
            },
            tCell(nr) {
                return this.t(`i.datepicker.quarters.q${nr}`);
            }
        }
    };
</script>
