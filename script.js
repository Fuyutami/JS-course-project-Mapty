'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

class Workout {
    date = new Date()
    id = (Date.now() + '').slice(-10)

    constructor(coords, distnce, duration) {
        this.coords = coords
        this.distnce = distnce // km
        this.duration = duration // min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration)
        this.cadence = cadence
        this.calcPace()
    }

    calcPace() {
        // min/km
        this.pace =this.duration / this.distance
        return this.pace
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration)
        this.elevationGain = elevationGain
        this.calcSpeed()
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }
}

// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycling1 = new Cycling([39, -12], 27, 95, 523)


///////////////////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
    #map
    #mapEvent

    constructor() {
        this._getPosition()

        form.addEventListener('submit', this._newWorkout.bind(this))
        
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition() {
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {   // binding 'this' keyword
             alert('Could not get your position')
        })
    }

    _loadMap(position) {
        const {latitude} = position.coords
        const {longitude} = position.coords
        const coords = [latitude, longitude]
        
        this.#map = L.map('map').setView(coords, 13); // we need HTML element with an ID of "map"
    
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }

    _newWorkout(e) {
        e.preventDefault()
        // Clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = ''
        // Display marker
            const {lat, lng} = this.#mapEvent.latlng
    
            L.marker([lat, lng], 'riseOnHover').addTo(this.#map).bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            })).setPopupContent('Workout').openPopup();
    }
}


const app = new App()


