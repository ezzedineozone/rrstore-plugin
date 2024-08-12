jQuery(document).ready(function($) {
    console.log('image library loaded');
    // Initialize a variable to hold the media uploader instance
    var mediaUploader;

    // Function to handle the button click event
    $('#my_image_button').click(function(e) {
        e.preventDefault(); // Prevent the default button action

        // Check if the media uploader is already created
        if (mediaUploader) {
            mediaUploader.open(); // Open the existing media uploader
            return;
        }

        // Create a new media uploader instance
        mediaUploader = wp.media({
            title: 'Select Image',
            button: {
                text: 'Use this image'
            },
            multiple: false // Allow only one image to be selected
        });

        // Event handler for when an image is selected
        mediaUploader.on('select', function() {
            var attachment = mediaUploader.state().get('selection').first().toJSON(); // Get the selected image details
            $('#my_image_attachment_id').val(attachment.id); // Set the image ID in the text input field
            $('#my_image_preview').html('<img src="' + attachment.url + '" style="max-width: 100%; height: auto;" />'); // Display the selected image in the preview area
        });

        // Open the media uploader
        mediaUploader.open();
    });
});
