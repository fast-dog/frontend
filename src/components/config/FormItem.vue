<template>
  <div class="row">
    <div class="col-lg-12">
      <div class="x_panel">
        <div class="x_title">form name</div>
        <div class="x_content">
          <div class="tabs-container">
            <ul class="nav nav-tabs bar_tabs">
              <li><a href="#">tab 1</a></li>
            </ul>
            <div class="tab-content">
              <div class="panel-body">
                <div class="col-sm-9">
                  <div class="col-sm-6">
                    <div class="fields"></div>
                  </div>
                  <div class="col-sm-6">
                    <div class="fields"></div>
                  </div>
                  <div class="col-sm-12">
                    <div class="fields"></div>
                  </div>
                </div>
                <div class="col-sm-3">
                  <div class="fields"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Provide, Watch} from 'vue-property-decorator'


    declare let $: any;

    @Component({
        name: 'FormItem',
        components: {}
    })

    export default class FormItem extends Vue {

    }
</script>

<style scoped lang="scss">
.fields{
  min-height: 60px;
  border: 1px dashed #1c84c6;
  margin: 2px;
  background: rgba(0, 136, 249, 0.09);
}
</style>
