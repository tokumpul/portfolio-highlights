Vue.component('wattodo-logo', {
  props: {
    src: String,
    alt: String
  },
  template:
  `<div class='columns has-text-centered'>
    <div class='column'>
      <img class='wattodo-logo' :src='src' :alt='alt'/>
    </div>
  </div>`
})

new Vue({
  el: '#logo',
})

Vue.component('wattodo-category', {
  props: {
    category: String,
  },
  template:
  `<div class='column is-3-desktop is-6-mobile'>
    <h1 class='is-size-5 drop-shadow'>{{ category }}</h1>
  </div>`
})

new Vue({
  el: '#categories',
  data: {
    categories: [
      { id: 0, title: 'Restaurants', },
      { id: 1, title: 'Movies' },
      { id: 2, title: 'Activities' },
      { id: 3, title: 'Recipes' }
    ],
    filters: null,
    selected: null,
    show: null,
    texts: [
      { id: 0, text: '' },
      { id: 1, text: 'What would you like to do?' },
      { id: 2, text: 'Changed your mind? Be bold! Stick with your decisions!' },
      { id: 3, text: 'Oh, come on now?! Do I have to pick the category for you as well?!' },
      { id: 4, text: '*sigh* Hi, again... what would you like to do?' }
    ],
    view: 1,
    wattodo: null
  },
  created() {
    this.texts[0].text = this.texts[1].text;
  },
  computed: {
    showOnMap() {
      // get URL and make it SEO friendly
      const url = `https://www.google.com/maps/search/?api=1&query=${this.wattodo.name}+${this.wattodo.address}+${this.wattodo.postcode}+${this.wattodo.postoffice}`
      .toLowerCase()
      .replace(/\s/g,'%20')
      .replace(/&/g,'%26')
      .replace('%26','&')
      .replace(/'/g,'%27')
      .replace(/ä/g,'a')
      .replace(/ö/g,'o');
      return url;
    }
  },
  methods: {
    showCategory(id) {
      if (this.view === 1) {
        // update this.view
        this.view = 2;
        // update this.show to match the selected category
        for (const i in this.categories) {
          if (id === parseInt(i)) {
            this.show = this.categories[parseInt(i)].title;
          }
        }
        // get data of the selected category
        const category = this.show.toLowerCase();
        axios.get(`./scripts/json/${category}.json`).then(data => {
          // set data
          this.wattodo = data.data[category];
          // get filters into a separate array
          let filters = [];
          for (const i in this.wattodo) {
            for (const ii in this.wattodo[i].category) {
              filters.push(this.wattodo[i].category[ii]);
            }
          }
          // remove duplicates from the array with a Set object
          filters = [...new Set(filters)].sort();
          // add an "Anything" filter to the beginning of the array
          filters.unshift('Anything');
          // set "Anything" as the default selection
          this.selected = filters[0];
          // set filters
          this.filters = filters;
        })
      } else if (this.view === 2) {
        // update this.view
        this.view = 1;
        // a fun little easter egg :)
        if (this.texts[0].text === this.texts[1].text) {
          this.texts[0].text = this.texts[2].text;
        } else if (this.texts[0].text === this.texts[2].text) {
          this.texts[0].text = this.texts[3].text;
        } else if (this.texts[0].text === this.texts[3].text) {
          this.texts[0].text = this.texts[4].text;
        }
      } else if (this.view === 3) {
        // update this.view
        this.view = 1;
        // reset easter egg text
        if (this.texts[0].text !== this.texts[1].text) {
          this.texts[0].text = this.texts[1].text;
        }
      } 
    },
    showWattodo() {
      // update this.view
      this.view = 3;
      // get all wattodos that match the selected filter into a separate array
      let filtered = [];
      if (this.selected === 'Anything') {
        filtered = this.wattodo;
      } else {
        for (const i in this.wattodo) {
          for (const ii in this.wattodo[i].category) {
            if (this.wattodo[i].category[ii] === this.selected) {
              filtered.push(this.wattodo[i]);
            }
          }
        }
      }
      // get a random wattodo from the array
      const wattodo = Math.floor((Math.random()*filtered.length));
      // set wattodo
      this.wattodo = filtered[wattodo];
    }
  }
})

// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js').then(() => {
    console.log('Service Worker is registering...');
  });
}