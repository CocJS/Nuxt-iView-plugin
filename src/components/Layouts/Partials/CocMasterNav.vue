<template>
  <coc-nav :classes = "classes">
    <slot 
      slot = "title" 
      name = "nav-title">
      <nuxt-link
        to="/"
        class="text-super text-code coc-primary-text coc-nav-brand col coc-padding-0"
      >
        <coc-avatar
          v-coc-mouse-over="'jello'"
          v-coc-mouse-leave="'rubberBand'"
          :source="$coc.App.logo.primary"
          scale = "40px"
          class="logo col coc-padding-0 animated"/>
        <span
          class="name col coc-padding-x-15px coc-padding-y-0 coc-margin-0"
        >{{ $coc.App.brandName }}</span>
      </nuxt-link>
    </slot>
    <slot 
      slot = "middle" 
      name = "nav-middle">
      <coc-input
        v-model="cocPureInput"
        :status-classes = "{
          initHolder: 'house-keepe col s12'
        }"
        placeholder = "Search"
        size = "large"
        class = "coc-padding-y-18px"
        icon = "ivu-icon ivu-icon-ios-search"
      />
    </slot>
    <slot 
      slot = "actions" 
      name = "nav-actions">
      <div 
        v-if = "actions" 
        class="row house-keeper right">
        <Dropdown 
          v-for = "(action, a) in actions" 
          :key = "a"
          @on-click = "excuteCallback(action, $event)">
          <Button
            type="text"
            size = "large"
            style = "height: 70px; border-radius: 0">
            {{ action.label }}
            <Icon type="ios-arrow-down"/>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem 
              v-for = "(item, i) in action.items"
              :name = "item.label"
              :key = "i">{{ item.label }}
            </dropdownitem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </slot>
  </coc-nav>
</template>

<script>
export default {
  name: 'CocMasterNav',
  props: {
    actions: {
      type: Array,
      default: null
    },
    classes: {
      type: Object,
      default: () => {
        return {
          nav:
            'transparent coc-main-nav coc-primary-text coc-primary-hover-text row house-keeper',
          title: 'left col l3 s8 coc-nav-section house-keeper',
          middle: 'col l5 coc-nav-section hide-on-med-and-down house-keeper',
          actions: 'right col l3 s4 coc-nav-section house-keeper'
        }
      }
    }
  },
  data() {
    return {
      cocPureInput: null
    }
  },
  methods: {
    excuteCallback(action, e) {
      if (action.items) {
        const item = action.items.filter(i => i.label === e)
        if (
          item.length &&
          item[0].callback &&
          typeof item[0].callback === 'function'
        ) {
          item[0].callback()
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
.coc-main-nav {
  height: 70px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 123;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08) !important;
}
.coc-nav-brand {
  margin-left: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 40px;
}
.coc-nav-brand .logo {
  width: 40px !important;
  height: 40px !important;
  background-color: transparent;
}
.coc-nav-brand .name {
  height: 40px !important;
  line-height: 40px;
}
.coc-nav-section {
  height: 70px;
}
</style>
