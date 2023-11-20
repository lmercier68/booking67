document.addEventListener('DOMContentLoaded', (event) => {
	const datepickerEl = document.getElementById('booking67-datepicker');
	let dateAvailabilityCache = {};  // Cache pour stocker la disponibilité des dates

	function checkDateAvailability(date, callback) {
		let formattedDate = jQuery.datepicker.formatDate('yy-mm-dd', date);

		if (dateAvailabilityCache[formattedDate]) {
			callback(dateAvailabilityCache[formattedDate]);
			return;
		}

		jQuery.ajax({
			url: '/wp-json/booking67/v1/date_availability',
			data: { date: formattedDate },
			success: function(data) {
				dateAvailabilityCache[formattedDate] = data.availability;
				callback(data.availability);
			},
			error: function() {
				callback('error');
			}
		});
	}

	if (datepickerEl) {
		jQuery(datepickerEl).datepicker({
			beforeShowDay: function(date) {
				let availability = 'noSlots';

				checkDateAvailability(date, function(result) {
					availability = result;
				});

				if (availability === 'available') {
					return [true, 'availableDate', 'Des créneaux sont disponibles'];
				} else if (availability === 'fullyBooked') {
					return [true, 'fullyBookedDate', 'Tous les créneaux sont réservés'];
				} else {
					return [true, 'noSlotsDate', 'Aucun créneau disponible'];
				}
			},
			onSelect: function(dateText, datePickerInstance) {
				fetchAvailableTimeSlots(dateText);
			}
		});
	}

	function fetchAvailableTimeSlots(date) {
		jQuery.ajax({
			url: '/wp-json/booking67/v1/available_slots',
			data: { date: date },
			success: function(data) {
				openTimeSlotModal(date, data.slots);
			},
			error: function() {
				alert("Erreur lors de la récupération des créneaux horaires.");
			}
		});
	}

	function openTimeSlotModal(date, slots) {
		let slotElements = slots.map(slot => {
			return `<div class="time-slot" data-time="${slot}">${slot}</div>`;
		}).join('');

		const modalContent = `
            <div id="timeslot-modal" title="Créneaux disponibles pour ${date}">
                ${slotElements}
            </div>
        `;

		jQuery('body').append(modalContent);

		jQuery(".time-slot").on('click', function() {
			const selectedTime = jQuery(this).data("time");
			bookTimeSlot(date, selectedTime);
		});

		jQuery("#timeslot-modal").dialog({
			modal: true,
			width: 400,
			close: function(event, ui) {
				jQuery(this).remove();
			}
		});
	}

	function bookTimeSlot(date, time) {
		jQuery.ajax({
			url: '/wp-json/booking67/v1/book_slot',
			method: 'POST',
			data: {
				date: date,
				time: time
			},
			success: function(data) {
				if (data.success) {
					alert("Votre réservation a été prise en compte!");
					jQuery("#timeslot-modal").dialog("close");
				} else {
					alert("Erreur lors de la réservation.");
				}
			},
			error: function() {
				alert("Erreur lors de la réservation.");
			}
		});
	}
});
