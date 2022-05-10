<template>
  <div :style="{maxWidth: maxWidth}" class="col-md-12 col-sm-12">
    <div class="cursor-pointer text-h5">
      <q-icon color="primary" name="mdi-pencil" />
      {{ labelText }}
      <q-popup-edit v-slot="scope" v-model="labelText" auto-save>
        <q-input v-model="labelText" dense autofocus counter clearable maxlength="80" @keyup.enter="scope.set" />
      </q-popup-edit>
    </div>
    <q-field :model-value="inputVal" :rules="rules" borderless hide-bottom-space>
      <template #control>
        <q-editor
          ref="myRef"
          v-model="inputVal"
          :name="name"
          :toolbar="toolbar"
          :min-height="minHeight"
          class="col-grow"
          @paste="evt => pasteCapture(evt)"
        />
      </template>
    </q-field>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {

  name: 'Editor',
  emits: ['update:value', 'update:label'],
  setup()
  {
    const myRef = ref(null);
    let isPasting = false;
    return {
      myRef,
      pasteCapture(evt)
      {
        if (isPasting)
        {
          return;
        }
        isPasting = true;
        // Let inputs do their thing, so we don't break pasting of links.
        if (evt.target.nodeName === 'INPUT') return;
        let text, onPasteStripFormattingIEPaste;
        evt.preventDefault();
        if (evt.originalEvent && evt.originalEvent.clipboardData.getData)
        {
          text = evt.originalEvent.clipboardData.getData('text/plain');
          myRef.value.runCmd('insertText', text);
        }
        else if (evt.clipboardData && evt.clipboardData.getData)
        {
          text = evt.clipboardData.getData('text/plain');
          myRef.value.runCmd('insertText', text);
        }
        else if (window.clipboardData && window.clipboardData.getData)
        {
          if (!onPasteStripFormattingIEPaste)
          {
            onPasteStripFormattingIEPaste = true;
            myRef.value.runCmd('ms-pasteTextOnly', text);
          }
          onPasteStripFormattingIEPaste = false;
        }
        setTimeout(() =>
        {
          isPasting = false;
        }, 1000);
      }

    };
  },
  props: {
    label: {
      require: false,
      default: null,
      type: String
    },
    value: {
      require: false,
      default: null,
      type: String
    },
    name: {
      require: false,
      default: null,
      type: String
    },
    toolbar: {
      type: Array,
      default: () =>
      {
        return [
          ['left', 'justify'],
          ['bold', 'italic'],
          ['token', 'hr', 'link'],
          ['quote', 'unordered', 'ordered'],
          ['undo', 'redo']
        ];
      }
    },
    minHeight: {
      type: String,
      default: '200px'
    },
    maxWidth: {
      type: String,
      default: '800px'
    },
    rules: {
      require: false,
      default: null,
      type: Array
    }
  },
  data()
  {
    return {
      inputVal: '',
      labelText: ''
    };
  },
  watch: {
    value(val)
    {
      this.inputVal = val;
      this.$emit('update:value', val);
    },
    inputVal(val)
    {
      this.$emit('update:value', val);
    },
    label(val)
    {
      this.labelText = val;
    },
    labelText(val)
    {
      this.$emit('update:label', val);
    },

  },
  mounted()
  {
    if (this.name != null)
    {
      //this.myRef = this.name;
    }
  },
  created()
  {
    if (this.value)
    {
      this.inputVal = this.value;
    }
    if (this.label)
    {
      this.labelText = this.label;
    }
  },
  methods: {
    inputEditor(evt)
    {

    }
  }
};
</script>
