import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';

const refs = {
    input: document.querySelector('#datetime-picker'),
    btn: document.querySelector('[data-start]'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
};

let selectedTime;
let timerId = null;
refs.btn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < Date.now()) {
            Notiflix.Notify.failure('Please select date in future');
            refs.btn.disabled = true;
        } else {
            refs.btn.disabled = false;
        };
        selectedTime = selectedDates[0].getTime();
        clearInterval(timerId);
        fillMarkup({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    },
};

flatpickr('input#datetime-picker', options);

function fillMarkup({ days, hours, minutes, seconds }) {
    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
};

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
};

refs.btn.addEventListener('click', onBtnClick);

function onBtnClick() {
    timerId = setInterval(() => {
        const remainedTime = convertMs(selectedTime - Date.now());
        fillMarkup(remainedTime);
        stopCountdown(remainedTime);
    }, 1000);
};

function stopCountdown({ days, hours, minutes, seconds }) {
    if (days <0 ||  hours<0 || minutes<0 || seconds<0) {
        fillMarkup({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    };
};

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
}