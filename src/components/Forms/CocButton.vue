<template>
  <Button
    :type = "type"
    :ghost = "plain"
    :shape = "circle ? 'circle': null"
    :round = "round"
    :loading = "isLoading"
    :class = "classes"
    :icon = "icon"
    :size = "size"
    :long = "long"
    v-bind = "bind"
    :disabled = "disabled"
    @click = "construct()">
    <slot
      name = "default">
      <template v-if = "placeholder && placeholder.length">{{ placeholder }}</template>
    </slot>
    <coc-axios
      v-if = "!local"
      v-bind = "request"
      v-model = "retriever"
      :scope = "scope"
      prevent-on-mount
      @success = "handleSubmit($event)"
      @catch = "handleCatch($event)"/>
  </Button>
</template>
<script>
export default {
  name: 'CocButton',
  props: {
    request: {
      type: Object,
      default: null
    },
    scope: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'primary'
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    classes: {
      type: [Array, Object, String],
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    local: {
      type: Boolean,
      default: false
    },
    ignore: {
      type: Boolean,
      default: false
    },
    computed: {
      type: Boolean,
      default: false
    },
    denotifi: {
      type: Boolean,
      default: false
    },
    sucessAt: {
      type: Array,
      default: null
    },
    long: {
      type: Boolean,
      default: false
    },
    bind: {
      type: Object,
      default: null
    },
    successMessage: {
      type: Object,
      default: () => {
        return {
          body: 'Your have submited successfuly',
          title: 'Success',
          type: 'success'
        }
      }
    },
    resolveSuccessMessage: {
      type: Function,
      default: err => {
        return {
          body: 'Submited Successfuly',
          title: 'Done'
        }
      }
    },
    resolveErrorMessage: {
      type: Function,
      default: err => {
        return {
          body:
            err.response && err.response.data
              ? err.response.data
              : 'Request Faild.',
          title: 'Whoops!'
        }
      }
    },
    errorAt: {
      type: Array,
      default: null
    },
    unclearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    precondition: {
      type: Boolean,
      default: null
    },
    validationMessage: {
      type: [Object, Function],
      default() {
        return instance => ({
          render: h =>
            instance.errorStack && instance.errorStack.length
              ? h('div', [
                  h(
                    'b',
                    {
                      class: 'coc-error-text'
                    },
                    `${instance.errorStack.length} errors was found`
                  ),
                  h('br'),

                  h('br'),
                  h(
                    'coc-collapse',
                    {
                      props: {
                        contentSlot: 'default',
                        title: 'Errors',
                        togglerClass: 'transparent coc-border-0',
                        regularClass: 'coc-error-text coc-text-heading left',
                        icon: 'ivu-icon'
                      }
                    },
                    [
                      h(
                        'div',
                        instance.errorStack.map(error => [
                          h('b', `${error.component.placeholder}: `),
                          error.description.message,
                          h('br'),
                          h('br')
                        ])
                      )
                    ]
                  )
                ])
              : h('span', [
                  'There are some fields you need to complete first.'
                ]),
          title: 'Whoops!'
        })
      }
    },
    beforeSubmit: {
      type: [Promise, Function],
      default: null
    },
    resolveResponse: {
      type: Function,
      default: () => true
    },
    preconditionMessage: {
      type: Object,
      default: () => {
        return {
          body: 'There`re some fields you need to complete.',
          title: 'Whoops!'
        }
      }
    },
    reset: {
      type: Boolean,
      default: false
    },
    validationTolerenceTime: {
      type: Number,
      default: 750
    }
  },
  data() {
    return {
      exists: true,
      retriever: { loading: false },
      onSubmit: false,
      errorStack: [],
      waitingLocalResponse: false,
      networkErrors: null,
      checkedFormMembers: null
    }
  },
  computed: {
    eventController() {
      return new this.$coc.FormController({
        api: this.$root,
        type: 'button',
        isReciever: true,
        scope: this.scope,
        model: this.model,
        component: {
          placeholder: this.placeholder,
          domId: this.componentId,
          type: 'button',
          val: this.input
        }
      })
    },
    hasErrors() {
      return this.errorStack && this.errorStack.length > 0
    },
    isLoading() {
      return this.retriever.loading || this.waitingLocalResponse
    },
    submitData() {
      return this.xdata
    },
    model() {
      return {
        control: {
          click: this.construct,
          submit: this.submit,
          register: this.register
        },
        meta: {
          hasErrors: this.hasErrors,
          errorStack: this.errorStack,
          loading: this.isLoading,
          networkErrors: this.networkErrors,
          response: this.retriever.response,
          progress: this.retriever.progress,
          xdata: this.xdata,
          retriever: this.retriever
        }
      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler() {
        this.emit()
      }
    }
  },
  mounted() {
    // console.log('btn mnt')
    this.exists = true
    this.emit()
    const vm = this
    this.eventController.Start()
    this.eventController.ReceiveMeta('valid', payloads => {
      if (!vm.exists) return
      if (payloads.credentials === false || payloads.pennding) {
        vm.errorStack.push(payloads)
      }
      vm.checkedFormMembers[payloads.component.domId] = true
      const unreceivedItems = vm.$_.pickBy(
        vm.checkedFormMembers,
        (val, key) => !val
      )
      if (!Object.keys(unreceivedItems).length) {
        vm.waitingLocalResponse = false
        if (vm.hasErrors) {
          if (typeof vm.validationMessage === 'function') {
            vm.notifi(vm.validationMessage(vm))
          } else {
            vm.notifi(vm.validationMessage)
          }
          vm.emit('coc-validation-refused')
          vm.onSubmit = false
          return
        } else {
          vm.emit('coc-validation-passed')
          vm.submit()
        }
      }
    })
    this.eventController.ReceiveScope('COCFormItemRegister', this.register)
  },
  beforeDestroy() {
    // console.log('btn des')
    this.exists = false
    this.$root.$off(['COCFormController', 'COCFormItemRegister', 'COCFormMeta'])
    this.checkedFormMembers = null
  },
  methods: {
    construct() {
      if (this.onSubmit) return
      this.onSubmit = true
      if (this.beforeSubmit) {
        this.waitingLocalResponse = true
        this.beforeSubmit()
          .then(() => {
            this.click()
          })
          .catch(err => {
            this.waitingLocalResponse = false
            this.$Message.error({ content: 'Some thing went wrong' })
          })
      } else {
        this.click()
      }
    },
    click() {
      this.emit('clicked')
      //Check the precondition
      if (this.precondition !== null && this.precondition == false) {
        this.notifi(this.preconditionMessage)
        this.emit('coc-validation-refused', this.errorStack)
        this.onSubmit = false
        return
      }
      this.errorStack = []
      this.checkedFormMembers = {}
      if (!this.ignore) {
        this.waitingLocalResponse = true
        this.eventController.Send(null, 'COCFormAskForRegister')
        setTimeout(() => {
          this.eventController.Send({
            controller: 'validate',
            credentials: 'meta'
          })
        }, this.validationTolerenceTime)
      }
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    submit() {
      if (!this.local) {
        this.retriever.retrieve()
        this.onSubmit = false
      } else {
        if (!this.hasErrors) {
          this.onSubmit = false
          if (this.reset) {
            this.eventController.Send({
              scope: this.scope,
              controller: 'reset',
              credentials: null
            })
          }
        }
      }
      //Check and Call the aruguments callback
      if (typeof arguments[arguments.length - 1] == 'function') {
        arguments[arguments.length - 1]()
      }
    },
    notifi(message) {
      if (this.denotifi) {
        return
      }
      const type = message.type === undefined ? 'error' : message.type
      if (type === 'success') {
        this.$Notice.success({
          title: message.title === undefined ? 'Whoops!' : message.title,
          render: message.render,
          desc:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      } else {
        this.$Notice.error({
          title: message.title === undefined ? 'Whoops!' : message.title,
          render: message.render,
          desc:
            message.body === undefined
              ? 'There`re some messing fields.'
              : message.body
        })
      }
    },
    resolveMessage(message, type) {
      const defaultMessage = {
        type,
        body: '',
        title: type === 'success' ? 'Done' : 'Whoops!'
      }
      if (typeof message === 'string') {
        return {
          ...defaultMessage,
          body: message
        }
      } else if (typeof message === 'object') {
        return {
          ...defaultMessage,
          ...message
        }
      }
    },
    handleSubmit(e) {
      this.onSubmit = false
      this.networkErrors = null
      if (!this.resolveResponse || this.resolveResponse(e.response)) {
        if (this.local) {
          this.notifi({ ...this.successMessage, ...{ type: 'success' } })
        } else {
          this.notifi(
            this.resolveMessage(
              this.resolveSuccessMessage(e.response),
              'success'
            )
          )
        }
        this.emit('coc-submit-accepted')
        if (this.reset) {
          this.eventController.Send({
            scope: this.scope,
            controller: 'reset',
            credentials: null
          })
        }
        return
      }
    },
    handleCatch(e) {
      this.onSubmit = false
      if (this.resolveErrorMessage) {
        this.notifi(
          this.resolveMessage(this.resolveErrorMessage(e.errors), 'error')
        )
      }
    },
    emit() {
      this.$emit('input', this.model)
      if (arguments.length > 0) this.$emit(arguments[0], this.model)
    },
    register(e) {
      if (!this.checkedFormMembers) this.checkedFormMembers = {}
      this.checkedFormMembers[e.id] = false
    }
  }
}
</script>

<style lang="css" scoped>
</style>
