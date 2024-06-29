document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("LFMzea5ZuxD1gkCAB");
    
    const form = document.getElementById('infoForm');
    const submitBtn = document.getElementById('submitBtn');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeSelect = document.createElement('select'); // Create select element for time

    const phoneInput = document.getElementById('phone');

    // Function to format phone number
    function formatPhoneNumber(input) {
        // Remove non-numeric characters
        const cleaned = ('' + input).replace(/\D/g, '');

        // Apply formatting: XXX-XXX-XXXX
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return match[1] + '-' + match[2] + '-' + match[3];
        }
        return input; // Return original input if no match
    }

    // Function to handle input event
    function handlePhoneInput(event) {
        const input = event.target.value;
        const formatted = formatPhoneNumber(input);
        event.target.value = formatted;
    }

    // Attach input event listener to phone input
    phoneInput.addEventListener('input', handlePhoneInput);

    // Set Min Date to 1 Week from Today and Max Date to 3 Months from Today
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);

    const minDateString = minDate.toISOString().split('T')[0];
    const maxDateString = maxDate.toISOString().split('T')[0];

    eventDateInput.setAttribute('min', minDateString);
    eventDateInput.setAttribute('max', maxDateString);

    // Generate Time Options in 15-Minute Intervals
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0); // Start at midnight
    const endTime = new Date();
    endTime.setHours(23, 45, 0, 0); // End at 11:45 PM

    const timeOptions = generateTimeOptions(startTime, endTime, 15); // Generate options

    timeOptions.forEach(function(option) {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', option.value);
        optionElement.textContent = option.label;
        eventTimeSelect.appendChild(optionElement);
    });

    // Replace old event-time input with generated select element
    eventTimeSelect.setAttribute('id', 'event-time');
    eventTimeSelect.setAttribute('name', 'event_time');
    eventTimeSelect.setAttribute('required', 'true');
    eventTimeSelect.classList.add('form-control'); // Optional: Add Bootstrap class for styling
    eventTimeSelect.addEventListener('change', function() {
        validateForm(); // Validate form on time selection change
    });

    const currentEventTimeInput = document.getElementById('event-time');
    currentEventTimeInput.parentNode.replaceChild(eventTimeSelect, currentEventTimeInput);

    const messageInput = document.getElementById('message');
    const messageCounter = document.getElementById('message-counter');

    // Function to handle input event
    function handleInput(event) {
        const maxLength = event.target.maxLength;
        const currentLength = event.target.value.length;
        const remaining = maxLength - currentLength;

        // Update counter text
        messageCounter.textContent = `${remaining} characters remaining`;

        // Enable or disable submit button based on message length
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = currentLength === 0;
    }

    // Attach input event listener to message input
    messageInput.addEventListener('input', handleInput);

    // Initial setup on page load
    handleInput({ target: messageInput });

    // Enable Submit Button if All Required Fields are Filled
    form.addEventListener('input', validateForm);

    // Handle Form Submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the form from submitting the traditional way

        const templateParams = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            event_date: document.getElementById('event-date').value,
            people_count: document.getElementById('people-count').value,
            event_time: eventTimeSelect.value, // Use select element value
            saree_material: document.getElementById('saree-material').value,
            draping_style: document.getElementById('draping-style').value,
            message: document.getElementById('message').value
        };

        emailjs.send('drape', 'drapes', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                document.querySelector('.form-container').style.display = 'none';
                document.getElementById('confirmationMessage').style.display = 'block';
            })
            .catch(function(error) {
                console.log('FAILED...', error);
            });
    });

    // Function to generate time options in specified intervals
    function generateTimeOptions(startTime, endTime, intervalMinutes) {
        const timeOptions = [];
        let currentTime = new Date(startTime);

        while (currentTime <= endTime) {
            const hours24 = currentTime.getHours().toString().padStart(2, '0');
            const hours12 = (hours24 % 12 || 12).toString(); // Convert 24hr to 12hr format
            const minutes = currentTime.getMinutes().toString().padStart(2, '0');
            const period = hours24 < 12 ? 'AM' : 'PM';
            const timeLabel = `${hours12}:${minutes} ${period}`;
            timeOptions.push({ value: `${hours24}:${minutes}`, label: timeLabel });

            currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        }

        return timeOptions;
    }

    // Function to validate form and enable/disable submit button
    function validateForm() {
        let allFilled = true;

        // Check all required input fields and select element
        form.querySelectorAll('input[required], select[required]').forEach(function(input) {
            if (input.value === '') {
                allFilled = false;
            }
        });

        // Enable or disable the submit button based on the fields' status
        submitBtn.disabled = !allFilled;
    }
});
