<template>
  <q-dialog :model-value="modelValue" maximized @update:modelValue="close">
    <q-card flat class="bg-third column overflow-hidden">
      <q-bar class="bg-primary text-white">
        <q-btn-toggle
          v-model="mode"
          toggle-color="secondary"
          :options="[
            {value: 'mobile', slot: 'one', icon: 'mdi-cellphone'},
            {value: 'desktop', slot: 'two', icon: 'mdi-monitor'},
            {value: 'screen', slot: 'three', icon: 'mdi-fullscreen'}
          ]"
          class="preview-buttons"
        >
          <template #one>
            <q-tooltip :delay="400">{{ $t('tooltip.mobile') }}</q-tooltip>
          </template>
          <template #two>
            <q-tooltip :delay="400">{{ $t('tooltip.desktop') }}</q-tooltip>
          </template>
          <template #three>
            <q-tooltip :delay="400">{{ $t('tooltip.fullscreen') }}</q-tooltip>
          </template>
        </q-btn-toggle>
        <q-btn class="z-top" dense icon="mdi-eyedropper-variant">
          <q-popup-proxy v-model="dlgColor" transition-show="scale" transition-hide="scale" style="max-height: none !important; transform: translateY(50px);">
            <q-color v-model="color" no-header no-footer class="z-top" default-view="palette" style="max-width: 250px;" @change="dlgColor = false" />
          </q-popup-proxy>
          <q-tooltip :delay="400">{{ $t('tooltip.colorize') }}</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn v-close-popup dense icon="mdi-close" class="z-top" name="close">
          <q-tooltip :delay="400">{{ $t('label.close') }}</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section :class="'col-grow overflow-hidden row q-pa-md mx-auto '+mode">
        <iframe id="jobpreview" class="col-grow q-mx-auto rounded-borders fixed-center" :style="frameStyle" :srcdoc="htmlCode" data-cy="the-frame" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { GET_FORM, GET_LOGO, GET_HEADER, GET_META } from 'src/store/names';
import { mapGetters } from 'vuex';
import { DEFAULT_LOGO } from 'src/assets/default_logo_base64.js';

export default
{
  name: 'DialogPreview',
  props:
  {
    modelValue:
    {
      type: Boolean,
      default: false
    },
  },
  emits: ['update:modelValue'],
  data()
  {
    return {
      canvas: null,
      countryImage: '',
      color: '#5498D7',
      dlgColor: false,
      mode: this.$q.platform.is.mobile ? 'fullscreen' : 'desktop'
    };
  },
  computed:
    {
      ...mapGetters([GET_FORM, GET_LOGO, GET_HEADER, GET_META]),
      country()
      {
        return this[GET_META].country;
      },
      frameStyle()
      {
        return this.mode === 'mobile'
          ? 'width: 25.5%; margin-top: 0.2vw; height: 53.2vw; max-width: 481px; max-height: 854px;'
          : this.mode === 'desktop'
            ? 'width: 60%; margin-top: -2.5vw; height: 38vw;'
            : 'width: 100%; height: 80%';
      },
      htmlLogo()
      {
        return (typeof this[GET_LOGO] === 'object')
          ? `<img src="${process.env.YAWIK_JOB_URL}${this[GET_LOGO].data.url}" class="img_logo">`
          : this[GET_LOGO]
            ? `<img src="${this[GET_LOGO]}" class="img_logo">`
            : `<img src="${DEFAULT_LOGO}" class="img_logo">`;
      },
      htmlHeaderImage()
      {
        return (typeof this[GET_HEADER] === 'object')
          ? `<div class="flex" style="width: 100%; padding: 16px 0 0;"><img src="${process.env.YAWIK_JOB_URL}${this[GET_HEADER].data[0].url}" class="img_header mx-auto"></div>`
          : this[GET_HEADER]
            ? `<div class="flex" style="width: 100%; padding: 16px 0 0;"><img src="${this[GET_HEADER]}" class="img_header mx-auto"></div>`
            : '';
      },
      htmlApply()
      {
        return this[GET_FORM].applyPost
          ? this.$t('apply_postmail')
          : this[GET_FORM].applyURL
            ? `<a href="${this[GET_FORM].applyURL}" class="mx-auto" target="_blank" rel="noopener noreferrer">${this.$t('apply_text')}</a>`
            : this[GET_FORM].applyEmail ? `<a href="mailto:${this[GET_FORM].applyEmail}">${this.$t('apply_text')}</a>` : '';
      },
      htmlIntro()
      {
        return this[GET_FORM].intro ? `<section><header>${this[GET_FORM].introLabel}</header><div>${this[GET_FORM].intro}</div></section>` : '';
      },
      htmlTasks()
      {
        return this[GET_FORM].tasks ? `<section class="six columns"><header>${this[GET_FORM].taskLabel}</header><div>${this[GET_FORM].tasks}</div></section>` : '';
      },
      htmlProfile()
      {
        return this[GET_FORM].profile ? `<section class="six columns"><header>${this[GET_FORM].profileLabel}</header><div>${this[GET_FORM].profile}</div></section>` : '';
      },
      htmlOffer()
      {
        return this[GET_FORM].offer ? `<section class="six columns"><header>${this[GET_FORM].offerLabel}</header><div>${this[GET_FORM].offer}</div></section>` : '';
      },
      htmlContacts()
      {
        return this[GET_FORM].contactInfo ? `<section class="six columns"><header>${this[GET_FORM].contactInfoLabel}</header><div>${this[GET_FORM].contactInfo}</div></section>` : '';
      },
      htmlWorkKind()
      {
        return this[GET_META].workKind.length > 0
          ? this[GET_META].workKind.map(item => `${this.$t('label.' + item)}`).join(', ')
          : '';
      },
      htmlWorkDuration()
      {
        return this[GET_META].workDuration.length > 0
          ? '<svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M17 11.5V13H11V7H12.5V11.5H17Z" /></svg>' +
          this[GET_META].workDuration.map(item => `${this.$t('label.' + item)}`).join(', ')
          : '';
      },
      htmlSalary()
      {
        return !this[GET_META].salaryVisibility
          ? '<li><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z" /></svg>' +
          this[GET_META].salary.value.split('|').map(item => item + '.000€').join(' - ') + '</li>'
          : '';
      },
      htmlRemoteWork()
      {
        return this[GET_META].remoteWork
          ? '<li><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z" /></svg>' +
          this[GET_META].remoteWorkPercentage + '%</li>'
          : '';
      },

      htmlCode()
      {
        return `<!DOCTYPE html><html lang="${this.$root.$i18n.locale}">
<head>
  <title>${this[GET_FORM].jobTitle}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script type="application/ld+json">${JSON.stringify(this.jsonLD)}` + '<' + `/script>
  <style>
    body
    {
      background: #fff;
    }
    a
    {
      color: ${this.color};
      text-decoration: none;
    }
    a:hover
    {
      text-decoration: underline;
    }
    .button a
    {
      color: #fff;
      text-decoration: none;
    }
    a:hover
    {
      text-decoration: none;
    }
    .flex
    {
      display: flex;
    }
    .mx-auto
    {
      margin-left: auto;
      margin-right: auto;
    }
    .img_logo
    {
      overflow: hidden;
      max-width: 30vh;
      max-height: 30vh;
      display: inline-block;
    }
    .img_header
    {
      width: 100%;
      text-align: center;
      max-height: 220px;
    }
    section
    {
      padding-bottom: 16px;
    }
    section header
    {
      font-weight: bold;
      line-height: 1.75;
    }
    article
    {
      margin: 0 auto;
      width: 100%;
    }
    .job
    {
      border: 1px solid ${this.color}66;
      margin: 0 auto;
      max-width:1200px;
      -webkit-box-shadow: 0px 10px 28px 0px rgb(50 50 50 / 41%);
      -moz-box-shadow: 0px 10px 28px 0px rgba(50, 50, 50, 0.41);
      box-shadow: 0px 10px 28px 0px rgb(50 50 50 / 41%);
    }
    .intro {
      border: 1px solid ${this.color}66;
      background-color: ${this.color}11;
    }
    .intro ul {
      list-style-type: none;
    }
    ul {
      list-style: inside;
      list-style-type: disc;
    }
    li {
      margin-bottom: 0;
    }
    .info svg {
      color: ${this.color}88;
      vertical-align: bottom;
      margin-right: 5px;
    }
    .jobdetails {
      border: 1px solid ${this.color}66;
    }
    h1 {
      color: ${this.color}
    }
    .button.button-primary, button.button-primary {
      color: #FFF;
      background-color:  ${this.color};
      border-color:  ${this.color}55;
    }
    .button.button-primary:hover, button.button-primary:hover {
      color: #FFF;
      background-color:  ${this.color}DD;
      border-color:  ${this.color}11;
    }
    .row.intro,
    .row.details {
      padding: 0 12px;
    }
    #apply: {
      text-align: center;
    }
    /* Larger than phablet */
    @media (min-width: 550px) {
      .row.intro,
      .row.details {
        padding: 0 24px;
      }
      .intro ul {
        columns: 2;
      }
      .column,
      .columns
      {
        margin-left: 1% !important;
      }
      .img_logo
      {
        max-width: 30vh;
        max-height: 30vh;
      }
    }
  </style>
</head>
<body>
  <div class="job">
    <div class="row intro">
      <article>
        <div class="three columns">${this.htmlLogo}</div>
        <div class="nine columns">
          <h5>${this[GET_FORM].organization || ''}</h5>
          <h1>${this[GET_FORM].jobTitle}</h1>
          <ul class="info">
            <li>
              <svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>
              ${[this[GET_META].country?.label || '', this[GET_FORM].location.addressLocality ? this[GET_FORM].location.addressLocality : (this[GET_FORM].location.addressRegion ? this[GET_FORM].location.addressRegion : this[GET_FORM].location.addressCountry) || ''].filter(val => val).join(', ')}
            </li>
            <li>
              <svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H10V20.09L12.09,18H6V16H14.09L16.09,14H6V12H18.09L20,10.09V8L14,2H6M13,3.5L18.5,9H13V3.5M20.15,13C20,13 19.86,13.05 19.75,13.16L18.73,14.18L20.82,16.26L21.84,15.25C22.05,15.03 22.05,14.67 21.84,14.46L20.54,13.16C20.43,13.05 20.29,13 20.15,13M18.14,14.77L12,20.92V23H14.08L20.23,16.85L18.14,14.77Z" /></svg>
              ${this.htmlWorkKind}
            </li>
            <li>${this.htmlWorkDuration}</li>
            ${this.htmlRemoteWork}
            ${this.htmlSalary}
          </ul>
        </div>
        ${this.htmlHeaderImage}
      </article>
    </div>
    <div class="row details">
      <article class="border">
        <!-- Parameters -->
        ${this.htmlIntro}
        ${this.htmlTasks}
        ${this.htmlProfile}
        ${this.htmlOffer}
        ${this.htmlContacts}
        <div align="center">
          <h5>${this[GET_FORM].reference ? 'Ref: ' + this[GET_FORM].reference : ''}</h5>
          <div id="apply" class="button button-primary">
            ${this.htmlApply}
          </div>
        </div>
      </article>
    </div>
  </div>
  <div align="center">powered by <a href="https://jobwizard.yawik.org" target="_blank">jobwizard</a></div>
</body>
</html>`;
      },
      jsonLD()
      {
        const today = new Date();
        const expires = this.addDays(today, this[GET_FORM].meta.publishDays);
        const result = {
          '@context': 'https://schema.org/',
          '@type': 'JobPosting',
          title: this[GET_FORM].jobTitle,
          description: '<p>' + this[GET_FORM].intro + '</p><p><b>' + this[GET_FORM].taskLabel + '</b><br>' + this[GET_FORM].tasks + '</p><p><br><b>' + this[GET_FORM].profileLabel + '</b><br>' + this[GET_FORM].profile + '</p><p><br><b>' + this[GET_FORM].offerLabel + '</b><br>' + this[GET_FORM].offer + '</p><p><b>' + this[GET_FORM].contactInfoLabel + '</b><br>' + this[GET_FORM].contactInfo + '</p>',
          identifier:
            {
              '@type': 'PropertyValue',
              name: this[GET_FORM].organization,
              value: this[GET_FORM].reference,
            },
          datePosted: this.dateText(today),
          validThrough: this.dateText(expires),
          hiringOrganization: {
            '@type': 'Organization',
            name: this[GET_FORM].organization,
          },
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: this[GET_FORM].location.addressLocality,
              streetAddress: this[GET_FORM].location.streetAddress,
              addressRegion: this[GET_FORM].location.addressRegion,
              addressCountry: this[GET_META].country,
            }
          },
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: {
              '@type': 'QuantitativeValue',
              minValue: this[GET_META].salary.value.split('|').map(item => item + '000')[0],
              maxValue: this[GET_META].salary.value.split('|').map(item => item + '000')[1],
              unitText: 'YEAR'
            }
          },
          jobLocationType: this[GET_META].remoteWorkPercentage === 100 ? 'TELECOMMUTE' : ''
        };
        if (this.employment.length > 0) result.employmentType = this.employment;
        if (this[GET_FORM].applyURL) result.directApply = true;
        return result;
      },
      employment()
      {
        return this[GET_META].workKind.map(item => ({
          freelance: 'OTHER',
          contract: 'CONTRACTOR',
        }[item])).concat(this[GET_META].workDuration.map(item => ({
          fulltime: 'FULL_TIME',
          parttime: 'PART_TIME',
        }[item])));
      },
    },
  created()
  {
    this.canvas = document.createElement('canvas');
  },
  methods:
    {
      close()
      {
        this.$emit('update:modelValue', false);
      },
      dateText(value)
      {
        return value.toISOString().slice(0, 10);
      },
      addDays(date, days)
      {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
    }
};
</script>

<style>

  .desktop
  {
    background-image: url("../assets/images/macbook-mockup.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: 80%;
  }

  .mobile
  {
    background-image: url("../assets/images/iphone-mockup.png");
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: 30%;
  }

  .mobile .preview-buttons
  {
    display: none;
  }
</style>

<i18n>
  {
    "en": {
      "jobad_wizard": "Jobad Wizard",
      "intro": "Intro",
      "tasks": "Tasks",
      "profile": "Profile",
      "offer": "Offer",
      "contacts": "Contact info",
      "apply_postmail": "Apply by regular post",
      "apply_text": "apply now",
      "tooltip": {
        "mobile": "Mobile",
        "desktop": "Desktop",
        "fullscreen": "Fullscreen",
        "colorize": "Here you can adjust the main colour of your job advertisement."
      }
    },
    "de": {
      "jobad_wizard": "Anzeigen Assistent",
      "intro": "Einleitung",
      "tasks": "Aufgaben",
      "profile": "Profil",
      "offer": "Angebot",
      "contacts": "Kontakt Info",
      "apply_postmail": "Bewerbung per Post",
      "apply_text": "jetzt bewerben",
      "tooltip": {
        "mobile": "Smartphone",
        "desktop": "Desktop",
        "fullscreen": "Fullscreen",
        "colorize": "Hier können sie die Hauptfarbe ihrer Stellenanzeige anpassen."
      }
    }
  }
</i18n>
