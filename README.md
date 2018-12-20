




# COC.JS Nuxt-iView
<p align="center">
<img width="200" height="200" src="https://avatars2.githubusercontent.com/u/44804821?s=400&u=c2252c15889114f4fa1128f60b3156e9f1f2131e&v=4">
</p>

## Install with npm 

```
npm install coc-nuxt-iview
```

## GET STARTED

After installing from npm, create `coc.js` file in `/plugins` directory.
in `coc.js` add the following

```
import COC from 'coc-nuxt-iview'
import moment from 'moment'
import lodash from 'lodash'
import pkg from '~/package'
import Vue from 'vue'
export default ({ env }, inject) => {
  // Init COC
  COC.Init({
    Vue,
    lodash,
    moment
  })
  // Config app data
  COC.ConfigApp({
    name: pkg.name,
    version: pkg.version,
    repository: pkg.repository,
    mode: env.mode
  })
  inject('coc', COC)
}
```

Then you can add the default COC theme by adding
`coc-nuxt-iview/dist/index.css` in your `nuxt.config.js` under the `css` attribute.
You can also use **[COC-Theme-Builder](https://github.com/CocJS/COC-Theme-Builder.git)** just clone the repo and start customizing your own COC theme.
## What is COC.JS Nuxt-iView

VUE assistant based on COC core engine and designed to work with (Nuxt, iView) environment

- Coc is providing the developer with a data structures helpers for
arrays, objects and collection.
- For Nuxt environment we're making it easy to use moment.js and
lodash,  you don't need to add them in a special plugins or modules
in your project.
- You will also have extra 13 components designed to work with iView
UI.
- Coc Forms components are designed to build a complex forms with a
minimal code and many features

### UI Design Concepts
COC is using different components from many UI libraries to cover most of the UI developers needs.
**External resources**
- [MaterializeCss - Grid System](https://materializecss.com/grid.html)
- [MaterializeCss - Colors](https://materializecss.com/color.html)
- [MaterializeCss - Shadow](https://materializecss.com/shadow.html)
- [AnimateCss](https://daneden.github.io/animate.css/)
- [Bulma - Buttons](https://bulma.io/documentation/elements/button/)

**Resources By COC**
- Typography Styles
- Borders Styling and colors

### COC Custom Components 
**Based on iView**.
- Forms -  Input
- Forms -  Select
- Forms -  Radio/Checkbox
- Forms -  Datepicker
- Forms -  Button

**COC Pure**
- Coc-Axios
- Coc-ShowKeys
- Coc-Collapse
- Coc-Form Item
- Coc-Form


### Check our full template
[COCJS Ready Template for Nuxt-iView-COC](https://cocjs.github.io/Nuxt-iView-Template/)

## CSMA (**Coc Standard model API**)
Coc Components are using a powerful standard for modeling the components
every `v-model` will give you an object that includes three main sections 

- val
- control
- meta

Every CSMA has a `control` section where you can access all the CSMA controllers from.
Accessing this controllers locally is being done by a very simple calls using CSMA API, for example here's how to use update controller  
`myModel.control.update('myVal')`.  
`myModel.control.reset()`  
`myModel.control.copy()`  
`myModel.control.clear()`  
`myModel.control.select()`  
`myModel.control.focus()`  
`myModel.control.blur()`  
`myModel.control.meta('isFired')`  

You can also pass a callback function for any controller, eg :  
`myModel.control.reset(myCallback)` 
or 
`myModel.control.update('foo' , ()=>{ //some code })`

For calling CSMA controllers remotely we're using VUE custom events.

The API structure is very simple, but also you need to be explicit about your scopes and the controllers you need, you need to tell `COC` what scope do you need to respond, the controller you need to access, and the arguments that you need to pass it 'credentials'.  
Here's the general rule for using CSMA events for this component.

    $nuxt.$emit('COCFormController', {  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar'  
    })

The previous API is the general case for any CSMA, its recommended to be explicit about your remote calls anyway. for example :


    $nuxt.$emit('COCFormController',{
    type : 'input' ,
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar'  
    })


If you didn't mention a specific type, all the components will react to this event, which is not recommended, as it will be more load and also you may call an undefined controllers for some components, in this case `COC` will handle it for you.  
**Passing Callbacks**
in remote events is the same as local usage, all you need to do is to add the callback attribute to your call, and you're all set!


    $nuxt.$emit('COCFormController' ,{  
    type : 'input' ,  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar' ,  
    callback : myCallback 
    })

OR

    $nuxt.$emit('COCFormController', {  
    type : 'input' ,  
    scope : ['myScope'] ,  
    controller : 'foo' ,  
    credentials : 'bar' ,  
    callback : ()=>{ //some code }
    })

Note : COC is validating the events arguments for you, so incase you have orderd a controller that does not exist COC will inform you using console warnings.

Here's a real example that you can try right now, in the next lines we'll be calling update controller to change the value of the upper COC EL INPUT, just copy it and paste it in your console to check it out!

    $nuxt.$emit('COCFormController', { type : 'input' ,  
    scope : ['elform'] ,  
    controller : 'update' ,  
    credentials : 'foo' ,  
    callback : ()=>{ alert('Hello World') }  
    })`

**Ask For Meta API** is a kind of conversations between components, or even between the root and a child component, if you need to get some meta of a specific component remotly, you can ask it, and it will reply with required meta if exists, otherwise `COC` will handle it for you and also warn you about it in your console.  
**Setup**  
Asking for meta is a regular controller, all you need to do is to select `meta` controller and pass your meant attribute as a `credentials` for example  






    $nuxt.$emit('COCFormController' ,  {
    type : 'input' , 
    scope : ['elform'] , 
    controller : 'meta' , 
    credentials : 'fired' 
    })

After this, the component will emit an event back, so you need to recieve the response and handle it to get your info.  
For Example  

    $nuxt.$on('COCFormMeta' ,(payloads)=>{  
    console.log(payloads)  
    })


So here's how to recieve it, now but this code in your console, and then ask for meta using the previous code in your console, and check the result.  
, simply the field name will be under `meta` attribute, and the value will be under `credentials`.  
the payloads will also carry the meant scope as you can handle when to react on those components using them.

## Components

Code Sample

    <coc-main-master>
    <div class="container coc-margin-top-1rem">
      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border">
        <h3 class = "text-title coc-content-text">Form</h3>
        <coc-form
          :fields = "[
            {
              step: 'Step One',
              content: 'Your name',
              fields: [
                {
                  type: 'input',
                  ref: 'fname',
                  props: {
                    placeholder: 'First name',
                    required: true,
                  }
                },
                {
                  type: 'input',
                  ref: 'lname',
                  props: {
                    placeholder: 'Last name',
                  }
                },
                {
                  type: 'select',
                  ref: 'gender',
                  props: {
                    placeholder: 'Gender',
                    multiple: true,
                    options: [
                      'Male',
                      'Female',
                      {
                        group: true,
                        label: 'Others',
                        options: [
                          { value: 'transgender', label : 'Transgender', icon: 'ivu-icon ivu-icon-ios-person' },
                        ]
                      }
                    ]
                  }
                },
                {
                  type: 'button',
                  ref: 'submit',
                  bind: { class: 'col s12' },
                  props: {
                    placeholder: 'Submit',
                    local: true,
                    classes: 'full-width'
                  }
                }
              ]
            }
        ]"/>
      </div>


      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border coc-margin-y-10px">
        <h3 class = "text-title coc-content-text">Coc Input</h3>
        <coc-input
          v-model = "input"
          :maxlen = "12"
          :minlen = "3"
          :scope = "['form']"
          placeholder = "COC Input"
          icon = "ios-person"
          required/>
        <p class = "text-subtitle coc-content-text text-code">
          Controls
        </p>
        <ButtonGroup v-if = "input">
          <Button 
            v-for="(method, index) in input.control" 
            :key = "index"
            class = "text-code"
            @click = "input.control[index]()"> {{ index }} </Button>
        </ButtonGroup>

      </div>

      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border coc-margin-y-10px">
        <h3 class = "text-title coc-content-text">Coc Select</h3>
        <coc-select
          v-model = "select"
          :options = "[
            {
              label: 'Web',
              group: true,
              options: [
                { label: 'HTML', value: 'html', icon: 'ivu-icon ivu-icon-logo-html5 orange-text' },
                { label: 'JavaScript', value: 'js', icon: 'ivu-icon ivu-icon-logo-javascript yellow-text' },
                { label: 'CSS', value: 'css', icon: 'ivu-icon ivu-icon-logo-css3 blue-text' },
              ]
            },
            {
              label: 'Mobile',
              group: true,
              options: [
                { label: 'IOS', value: 'ios', icon: 'ivu-icon ivu-icon-ios-appstore blue-text text-darken-3' },
                { label: 'Andriod', value: 'andriod', icon: 'ivu-icon ivu-icon-logo-android green-text' },
              ]
            }
          ]"
          :scope = "['form']"
          :max_picks = "4"
          :min_picks = "2"
          placeholder = "COC Select, Select a programming flavour"
          icon = "ios-code"
          required
          multiple/>
        <p class = "text-subtitle coc-content-text text-code">
          Controls
        </p>
        <ButtonGroup v-if = "select">
          <Button 
            v-for="(method, index) in select.control" 
            :key = "index"
            class = "text-code"
            @click = "select.control[index]()"> {{ index }} </Button>
        </ButtonGroup>

      </div>

      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border coc-margin-y-10px">
        <h3 class = "text-title coc-content-text">Coc Radio</h3>
        <coc-radio
          v-model = "radio"
          :options = "[

            { label: 'HTML', value: 'html', icon: 'ivu-icon ivu-icon-logo-html5 orange-text' },
            { label: 'JavaScript', value: 'js', icon: 'ivu-icon ivu-icon-logo-javascript yellow-text' },
            { label: 'CSS', value: 'css', icon: 'ivu-icon ivu-icon-logo-css3 blue-text' },
            { label: 'IOS', value: 'ios', icon: 'ivu-icon ivu-icon-ios-appstore blue-text text-darken-3' },
            { label: 'Andriod', value: 'andriod', icon: 'ivu-icon ivu-icon-logo-android green-text' },
          ]"
          :scope = "['form']"
          placeholder = "COC Select, Select a programming flavour"
          icon = "ios-code"
          required/>
        <p class = "text-subtitle coc-content-text text-code">
          Controls
        </p>
        <ButtonGroup v-if = "radio">
          <Button 
            v-for="(method, index) in radio.control" 
            :key = "index"
            class = "text-code"
            @click = "radio.control[index]()"> {{ index }} </Button>
        </ButtonGroup>

      </div>

      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border coc-margin-y-10px">
        <h3 class = "text-title coc-content-text">Coc Checkbox</h3>
        <coc-radio
          v-model = "cb"
          :options = "[

            { label: 'HTML', value: 'html', icon: 'ivu-icon ivu-icon-logo-html5 orange-text' },
            { label: 'JavaScript', value: 'js', icon: 'ivu-icon ivu-icon-logo-javascript yellow-text' },
            { label: 'CSS', value: 'css', icon: 'ivu-icon ivu-icon-logo-css3 blue-text' },
            { label: 'IOS', value: 'ios', icon: 'ivu-icon ivu-icon-ios-appstore blue-text text-darken-3' },
            { label: 'Andriod', value: 'andriod', icon: 'ivu-icon ivu-icon-logo-android green-text' },
          ]"
          :scope = "['form']"
          :max_picks = "4"
          :min_picks = "2"
          placeholder = "COC Select, Select a programming flavour"
          icon = "ios-code"
          required
          multiple/>
        <p class = "text-subtitle coc-content-text text-code">
          Controls
        </p>
        <ButtonGroup v-if = "cb">
          <Button 
            v-for="(method, index) in cb.control" 
            :key = "index"
            class = "text-code"
            @click = "cb.control[index]()"> {{ index }} </Button>
        </ButtonGroup>
      </div>

      <div class="coc-background-bg coc-padding-10px coc-standard-border-radius coc-border-1 coc-border-border coc-margin-y-10px">
        <h3 class = "text-title coc-content-text">Coc Button</h3>
        <coc-button
          v-model = "btn"
          :bind = "{ long: true }"
          :scope = "['form']"
          classes = "text-mg-lg text-thin"
          placeholder = "Submit Coc Button"
          size = "large"
          circle/>
        <p class = "text-subtitle coc-content-text text-code">
          Controls
        </p>
        <ButtonGroup v-if = "btn">
          <Button 
            v-for="(method, index) in btn.control" 
            :key = "index"
            class = "text-code"
            @click = "btn.control[index]()"> {{ index }} </Button>
        </ButtonGroup>

      </div>
    </div>
    </coc-main-master>
