Vue.component('sl3k-logo', {
  props: {
    src: String,
    alt: String
  },
  template:
  `<div class='column'>
    <h1 class='is-size-5 sl3k-logo-border'></h1>
    <span class='sl3k-logo-shader'></span>
    <span class='sl3k-logo'>
      <img :src='src' :alt='alt'/>
    </span>
    <h1 class='is-size-5 sl3k-logo-text'>{{ alt }}</h1>
  </div>`
})

new Vue({
  el: '#logo',
  data: {
    src: './images/sl3k-icon-transparent-512x512.png',
    alt: 'Super Lunchnator 3000'
  }
})

Vue.component('sl3k-restaurants', {
  props: {
    restaurant: String
  },
  template:
  `<div class='column is-6-mobile is-4-tablet'>
    <button class='button sl3k-button'>{{ restaurant }}</button>
  </div>`
})

new Vue({
  el: '#restaurants',
  data: {
    loading: true,
    menu: null,
    restaurants: [
      {
        id: 0,
        name: 'Bittipannu',
        address: 'Piippukatu 2',
        postcode: '40100',
        postoffice: 'Jyväskylä',
        warning: null,
        website: 'https://bit.ly/2YTs6kB'
      },
      {
        id: 1,
        name: 'Aimo',
        address: 'Asekatu 3',
        postcode: '40100',
        postoffice: 'Jyväskylä',
        warning: null,
        website: 'https://bit.ly/2sASDHu'
      },
      {
        id: 2,
        name: 'Fiilu',
        address: 'Piippukatu 11',
        postcode: '40100',
        postoffice: 'Jyväskylä',
        warning: 'Opiskelijalounaan tiedot nähtävissä vain Fiilun verkkosivuilla!',
        website: 'https://bit.ly/2EoQVeO'
      },
      {
        id: 3,
        name: 'Siltavouti',
        address: 'Matarankatu 4',
        postcode: '40100',
        postoffice: 'Jyväskylä',
        warning: null,
        website: 'https://bit.ly/2Prq2wX'
      },
      {
        id: 4,
        name: 'Foodora',
        warning: null,
        website: 'https://bit.ly/2O8THtU'
      },
      {
        id: 5,
        name: 'Wolt',
        warning: null,
        website: 'https://bit.ly/2reCqHy'
      }
    ],
    show: null,
    view: 1
  },
  created() {
    //this.registerSW();
  },
  computed: {
    getDate() {
      // initialize a date object
      const date = new Date();
      // format the date
      return `${date.getDate()}.${(date.getMonth()+1)}.${date.getFullYear()}`;
    },
    getLocation() {
      // get URL of the selected restaurant and make it SEO friendly
      for (const i in this.restaurants) {
        if (this.show === this.restaurants[parseInt(i)].name) {
          return `https://www.google.com/maps/search/?api=1&query=${this.restaurants[parseInt(i)].name}+${this.restaurants[parseInt(i)].address}+${this.restaurants[parseInt(i)].postcode}+${this.restaurants[parseInt(i)].postoffice}`
          .toLowerCase()
          .replace(/\s/g,'%20')
          .replace(/&/g,'%26')
          .replace('%26','&')
          .replace(/'/g,'%27')
          .replace(/ä/g,'a')
          .replace(/ö/g,'o');
        }
      }
    },
    getRestaurant() {
      return this.show === 'Aimo' || this.show === 'Fiilu' || this.show === 'Siltavouti';
    },
    getService() {
      return this.show === 'Foodora' || this.show === 'Wolt';
    },
    getWarning() {
      // get warnings of the selected restaurant
      if (this.menu !== '' && !this.loading) {
        for (const i in this.restaurants) {
          if (this.show === this.restaurants[parseInt(i)].name) {
            return this.restaurants[parseInt(i)].warning;
          }
        }
      }
    },
    getWebsite() {
      // get URL of the selected restaurant
      for (const i in this.restaurants) {
        if (this.show === this.restaurants[parseInt(i)].name) {
          return this.restaurants[parseInt(i)].website;
        }
      }
    },
    noMenu() {
      // check if the selected restaurant has a menu
      if (this.menu === '') {
        return 'Ei lounastietoja saatavilla';
      }
    }
  },
  methods: {
    changeView() {
      if (this.view === 1) {
        // update this.view
        this.view = 2;
      } else {
        // enable loading
        this.loading = true;
        // reset the menu
        this.menu = null;
        // update this.view
        this.view = 1;
      }
    },
    registerSW() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('./sw.js')
        .then(() => {
          console.log('SW is registered');
        });
      }
    },
    showMenu(id) {
      // update this.view
      this.changeView();
      // update this.show to match the selected restaurant
      for (const i in this.restaurants) {
        if (id === parseInt(i)) {
          this.show = this.restaurants[parseInt(i)].name;
        }
      }
      if (this.show === 'Foodora' || this.show === 'Wolt') {
        // disable this.loading
        this.loading = false;
        // set this.menu
        this.menu = 'Siirry palveluun';
      } else {
        // get menu of the selected restaurant
        const restaurant = this.show.toLowerCase();
        axios
        .get(`https://student.labranet.jamk.fi/~L5386/sl3k/scripts/php/${restaurant}.php`)
        .then(res => {
          // disable this.loading
          this.loading = false;
          // show menu of the selected restaurant
          if (this.show === 'Bittipannu') {
            // format the menu
            let menu = res.data.courses;
            if (menu !== null) {
              for (const i in menu) {
                // format the prices of the menu
                if (menu[i].price !== null && menu[i] !== undefined) {
                  menu[i].price = menu[i].price
                  .replace(/ *\s\/*/g,' ')
                  .replace(/ *\s€*/g,' ');
                }
              }
              // set this.menu
              this.menu = menu;
            } else {
              // set this.menu
              this.menu = '';
            }
          } else {
            // format the menu
            let menu = res.data.MenusForDays;
            if (menu.length !== 0) {
              menu = menu[0].SetMenus;
              if (menu.length !== 0) {
                // remove empty elements from the menu
                let hasEmptyElements = true;
                while (hasEmptyElements) {
                  const len = menu.length;
                  for (const i in menu) {
                    if (!menu[i].Components[0]) {
                      // get all elements on the right side of the empty element
                      const right = menu.splice(parseInt(i)+1,menu.length);
                      // get all elements on the left side of the empty element
                      const left = menu.splice(0,parseInt(i));
                      // merge both sides => a menu w/o the empty element
                      menu = [...left, ...right];
                    }
                  }
                  if (len === menu.length) hasEmptyElements = false;
                }
                for (const i in menu) {
                  if (this.show === 'Siltavouti' && menu[i].Name === 'Lounassalaatti') {
                    // get all elements on the right side of 'Lounassalaatti' element
                    const right = menu.splice(parseInt(i)+1,menu.length);
                    // get all elements on the left side of 'Lounassalaatti' element
                    const left = menu.splice(0,parseInt(i));
                    // merge both sides => a menu w/o 'Lounassalaatti' element
                    menu = [...left, ...right];
                    // remove the last element of menu => contains unwanted data
                    menu = menu.splice(0,menu.length-1);
                  }
                  // format the contents of the menu
                  if (menu[i].Components[0]) {
                    menu[i].Components[0] = menu[i].Components[0].replace(/ *\([^]*\)*/g,'');
                    if (menu[i].Components[1]) {
                      menu[i].Components[1] = menu[i].Components[1].replace(/ *\([^]*\)*/g,'');
                      if (menu[i].Components[2]) {
                        menu[i].Components[2] = menu[i].Components[2].replace(/ *\([^]*\)*/g,'');
                      }
                    }
                  }
                  // format the prices of the menu
                  if (menu[i].Price !== null && menu[i] !== undefined) {
                    if (this.show === 'Aimo') {
                      if (menu[i].Price.includes('7,40')) menu[i].Price = '2,60 7,40';
                      else if (menu[i].Price.includes('8,70')) menu[i].Price = '2,60 8,70';
                      else if (menu[i].Price.includes('9,20')) menu[i].Price = '2,60 9,20';
                      else if (menu[i].Price.includes('10,00')) menu[i].Price = '4,95 10,00';
                    } else if (this.show === 'Siltavouti') {
                      if (menu[i].Price.includes('1,85')) menu[i].Price = '1,85';
                      else if (menu[i].Price.includes('7,10')) menu[i].Price = '2,60 7,10';
                      else if (menu[i].Price.includes('8,40')) menu[i].Price = '2,60 8,40';
                      else if (menu[i].Price.includes('9,75')) menu[i].Price = '4,95 9,75';
                    }
                  } else if (this.show === 'Fiilu') menu[i].Price = '7,50';
                }
                // set this.menu
                this.menu = menu;
              } else {
                // set this.menu
                this.menu = '';
              }
            } else {
              // set this.menu
              this.menu = '';
            }
          }
        }).catch(error => {
          // log the error to the console
          console.log(error);
          // disable this.loading
          this.loading = false;
          // set this.menu
          this.menu = '';
        })
      }
    }
  }
})