import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const datePicker = document.querySelector('#datetime-picker');
const refs = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

const btnStart = document.querySelector('button[data-start]');
const timerHtml = document.querySelector('.timer');

btnStart.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < new Date()) {
            Notiflix.Notify.failure('Please choose a date in the future');
            btnStart.disabled = true;
        } else {
            btnStart.disabled = false;
        }
    },
};

flatpickr(datePicker, options);

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
};

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
};

btnStart.addEventListener('click', () => {
    let timer = setInterval(() => {
        let countdown = new Date(datePicker.value) - new Date();
        btnStart.disabled = true;
        if (countdown >= 0) {
            let timeObject = convertMs(countdown);
            refs.days.textContent = addLeadingZero(timeObject.days);
            refs.hours.textContent = addLeadingZero(timeObject.hours);
            refs.minutes.textContent = addLeadingZero(timeObject.minutes);
            refs.seconds.textContent = addLeadingZero(timeObject.seconds);
            if (countdown <= 10000) {
                timerHtml.style.color = 'tomato';
            }
        } else {
            Notiflix.Notify.success('Countdown finished');
            timerHtml.style.color = 'black';
            clearInterval(timer);
        }
    }, 1000);
});

