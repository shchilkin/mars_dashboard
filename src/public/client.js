/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable valid-jsdoc */
// TODO: Add Immutable.js
const store = {
  app: {name: 'Mars Dashboard'},
  user: {name: 'Student'},
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  roverData: {},
  activeRover: undefined,
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};


// create content
const App = (state) => {
  const {rovers, roverData, activeRover} = state;

  return `
        ${renderNavbar(state)}
        ${renderRoverInfo(state)}
        <main>
            <div class="d-flex justify-content-center">
                <div id="rover-group" class="btn-group" role="group" 
                aria-label="Basic example">
                    ${ rovers && renderRovers(rovers)}
                </div>
            </div>
            <section id='photos'>
                ${RoverCard(activeRover)}
                ${getRoverInformation(roverData)}
            </section>
        </main>
    `;
};

/**
 * Renders navbar
 * @param {object} state Application state
 * @return {string} Navbar HTML Markup
 */
const renderNavbar = (state) => {
  const {app} = state;

  return (`
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">${app.name}</span>
            </div>
        </nav>
    `);
};

const renderRoverInfo = (state) => {
  const {activeRover} = state;

  if (typeof activeRover !== undefined) {
    // await getRoverData()
    return '';
  }

  return 0;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

const RoverCard = (roverIndex) => {
  const {rovers} = store;
  return `<h1>Rover Information: ${rovers[roverIndex]}</h1>`;
};

const setRover = (roverName) => {
  const roverIndexes = {
    Curiosity: 0,
    Opportunity: 1,
    Spirit: 2,
  };

  switch (roverName) {
    case 'Curiosity':
      getRoverData('curiosity');
      updateStore(store, {activeRover: roverIndexes.Curiosity});
      break;
    case 'Opportunity':
      getRoverData('opportunity');
      updateStore(store, {activeRover: roverIndexes.Opportunity});
      break;
    case 'Spirit':
      getRoverData('spirit');
      updateStore(store, {activeRover: roverIndexes.Spirit});
      break;
    default:
      return null;
  }
};

/**
 *
 * @param {array} rovers - an array of available rovers
 * @return rovers
 */
const renderRovers = (rovers) => {
  let htmlContent = '';
  rovers.forEach((rover) => {
    htmlContent += `<button type="button"
    onclick="setRover('${rover}')" 
    id="${rover + 'Button'}"
    class="btn btn-primary">${rover}</button>`;
  });
  return htmlContent;
};

/**
 * Returns rover data object
 * @param {object} data - latest_photos data from NASA API
 * @return {object} rover - information about rover
 */
const getRoverInformation = (data) => {
  const isRoverDataEmpty = Object.keys(data).length === 0;
  // Handle empty object
  if (!isRoverDataEmpty) {
    return data['latest_photos'][0].rover;
  };
};

// ------------------------------------------------------  API CALLS

const getRoverData = (roverName) => {
  fetch(`/rover/${roverName}`)
      .then((res) => res.json())
      .then((roverData) => {
        updateStore(store, {roverData});
        // TODO: Call render method
        renderPhotos(roverData);
      });
};


const renderPhotos = (roverData) => {
  console.log('Render Photos', roverData);

  const photoSection = document.getElementById('photos');

  // Clean DOM
  while (photoSection.firstChild) {
    photoSection.removeChild(photoSection.lastChild);
  }

  // Add photos to DOM
  roverData.latest_photos.map((photo) => {
    console.log(photo);
    // TODO: use component
    const image = document.createElement('img');
    image.src = photo.img_src;
    photoSection.appendChild(image);
  });
  return roverData;
};
