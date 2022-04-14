<template>
  <div>
    <q-list dense class="rounded-borders">
      <q-item v-for="(file, id) in list" :key="id" v-ripple clickable>
        <q-item-section avatar @click="downloadAttachment">
          <q-icon color="primary" name="download" />
        </q-item-section>
        <q-item-section @click="downloadAttachment">
          {{ file.name }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { exportFile, useQuasar } from 'quasar';

const $q = useQuasar();

export default {
  name: 'AttachmentList',
  props:
    {
      files:
        {
          type: Array,
          default: null
        },
    },
  setup()
  {
    return {
      downloadAttachment(data)
      {
        // naive encoding to csv format
        const content = '123';
        console.log('DOWNLOAS', data);

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        );

        if (status !== true)
        {
          $q.notify({
            message: 'Browser denied file download...',
            color: 'negative',
            icon: 'warning'
          });
        }
      }

    };
  },
  computed:
  {
    list:
    {
      get()
      {
        return this.files;
      }
    },
  },
  methods:
  {
    icon(file)
    {
      return file.size;
    }
  }
};
</script>
