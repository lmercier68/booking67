// fe_timeselect.js

jQuery(document).ready(function($) {
	const apiRoot = booking67ApiSettings.root;
	const apiNonce = booking67ApiSettings.nonce;
	let selectedSlot = null;

	$('.time-select-block .wp-block-datepicker').on('change', function() {
		const selectedDate = $(this).val();

		$.ajax({
			url: apiRoot + 'booking67/v1/get-times?date=' + selectedDate,
			method: 'GET',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-WP-Nonce', apiNonce);
			},
			success: function(data) {
				$(".available-time-slots").empty();

				data.forEach(slot => {
					let slotButton = $("<button>")
						.addClass("time-slot")
						.text(`${slot.start} - ${slot.end}`)
						.on('click', function() {
							selectedSlot = slot;
							$('.time-slot').removeClass('selected');
							$(this).addClass('selected');
						});

					$(".available-time-slots").append(slotButton);
				});
			},
			error: function() {
				console.error('Erreur lors de la récupération des créneaux horaires.');
			}
		});
	});

	$('.time-select-block .select-button').on('click', function() {
		if (selectedSlot) {
			$.ajax({
				url: apiRoot + 'booking67/v1/book-time',
				method: 'POST',
				data: {
					start_time: selectedSlot.start,
					end_time: selectedSlot.end,
					date: $('.time-select-block .wp-block-datepicker').val()
				},
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-WP-Nonce', apiNonce);
				},
				success: function() {
					alert('Créneau horaire réservé avec succès!');
				},
				error: function() {
					console.error('Erreur lors de la réservation du créneau horaire.');
				}
			});
		} else {
			alert("Veuillez d'abord choisir un créneau horaire.");
		}
	});
});
