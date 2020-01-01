<template>
  <div>
    <coc-watch-my-window v-model = "windowWatcher"/>
    <coc-master-nav :actions = "actions">
      <slot
        slot = "nav-title"
        name = "nav-title"/>
      <slot
        slot = "nav-middle"
        name = "nav-middle"/>
      <slot
        slot = "nav-actions"
        name = "nav-actions"/>
    </coc-master-nav>
    <main>
      <slot name = "default"/>
      <coc-layout-docker
        v-if = "!hideDocker" 
        :window-watcher = "windowWatcher" 
        v-bind = "docker"/>
    </main>
    <coc-master-footer>
      <slot name = "footer"/>
    </coc-master-footer>
  </div>
</template>

<script>
import CocMasterNav from '../Partials/CocMasterNav.vue'
import CocMasterFooter from '../Partials/CocMasterFooter.vue'
export default {
  name: 'CocMainMaster',
  components: {
    CocMasterNav,
    CocMasterFooter
  },
  props: {
    docker: {
      type: Object,
      default: null
    },
    actions: {
      type: Array,
      default: null
    },
    hideDocker: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      windowWatcher: null
    }
  }
}
</script>

<style lang="css" scoped>
</style>
