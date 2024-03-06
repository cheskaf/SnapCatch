/*
 * main.js
 *
 * This file contains the client-side JavaScript code such as AJAX requests and form submission handling.
 *
 *
 */

$(document).ready(function () {
    // Update the AJAX request to use FormData for file upload
    $("#registrationForm").submit(function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Extract form data including file
        var formData = extractFormData(); // Invoke the function
        
        console.log("Extracted Form Data:", formData); // Log the FormData object

        // Send form data to Node.js server using AJAX with multipart/form-data
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/create-list-item/CNECustomerRegistrationForm",
            data: formData,
            contentType: false,
            processData: false,
            // Update the success callback function
            success: function (response) {
                // Show the success modal
                $('#successModal').modal('show');
                // when the success modal is dismissed, hard reload the site
                $('#successModal').on('hidden.bs.modal', function () {
                    location.reload(true);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                // Optionally, handle error
            },
        });
    });
    
    // Event listener for clicking the addNewRegistrationSubmit button
    $('#addNewRegistrationSubmit').click(function () {
        // Extract form data including file
        var formData = extractFormData(); // Invoke the function
        
        console.log("Extracted Form Data:", formData); // Log the FormData object

        // Send form data to Node.js server using AJAX with multipart/form-data
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/create-list-item/CNECustomerRegistrationForm",
            data: formData,
            contentType: false,
            processData: false,
            // Update the success callback function
            success: function (response) {
                // Show the success modal
                $('#successModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                // Optionally, handle error
            },
        });
    });
    
    // Event listener for clicking the addNewTrainingSubmit button
    $('#addNewTrainingSubmit').click(function () {
        // Extract form data including file
        var formData = extractTrainingFormData(); // Invoke the function
        
        console.log("Extracted Form Data:", formData); // Log the FormData object

        // Send form data to Node.js server using AJAX with multipart/form-data
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/api/create-list-item/TrainingList",
            data: formData,
            contentType: false,
            processData: false,
            // Update the success callback function
            success: function (response) {
                // Show the success modal
                $('#successModal').modal('show');
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                // Optionally, handle error
            },
        });
    });
    
    // Event listener for clicking the .alertsuccess button
    $('.alertsuccess').click(function () {
        // Hide the offcanvas
        $('#offcanvasAddUser').offcanvas('hide');
        // Reload the current page
        location.reload();
    });
    
    // Event listener for update button click
    $('.updateRegistrationButton').click(function () {
        // Get the registrationId from the data attribute
        var updateItemId = $(this).data("record-id"); // Use "record-id" instead of "record-Id"

        // Find the parent modal of the clicked button
        var modal = $(this).closest('.modal');

        // Get the values from input fields within the modal
        var lastName = modal.find('#lastName').val();
        var firstName = modal.find('#firstName').val();
        var email = modal.find('#email').val();
        var contactNumber = modal.find('#contactNumber').val();
        var companyName = modal.find('#companyName').val();

        // Create the updatedItem object
        const updatedItem = {
            __metadata: { type: 'SP.Data.CNECustomerRegistrationFormListItem' },
            LastName: lastName,
            FirstName: firstName,
            Email: email,
            ContactNumber: contactNumber,
            CompanyName: companyName
        };


        console.log("Item ID to Update:", updateItemId);
        console.log("Updated Item:", updatedItem);
        updateListItem(updateItemId, updatedItem);

        // Close the modal
    });
    // Event listener for update TrainingList
    $('.updateTrainingListButton').click(function () {
        // Get the registrationId from the data attribute
        var updateItemId = $(this).data("record-id"); // Use "record-id" instead of "record-Id"

        // Find the parent modal of the clicked button
        var modal = $(this).closest('.modal');

        // Get the values from input fields within the modal
        var title = modal.find('#title').val();
        var location = modal.find('#location').val();
        var dateFrom = modal.find('#dateFrom').val();
        var dateTo = modal.find('#dateTo').val();

        // Create the updatedItem object
        const updatedItem = {
            __metadata: { type: 'SP.Data.TrainingListListItem' },
            Title: title,
            Location: location,
            DateFrom: dateFrom,
            DateTo: dateTo,
        };


        console.log("Item ID to Update:", updateItemId);
        console.log("Updated Item:", updatedItem);
        updateTrainingListItem(updateItemId, updatedItem);

        // Close the modal
    });

});

document.addEventListener('DOMContentLoaded', function() {
    // Select all delete buttons by class
    const deleteButtons = document.querySelectorAll('.delete-record');

    // Add click event listener to each delete button
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Extract record ID from data attribute
            const recordId = button.getAttribute('data-record-id');
            const listTitle = "CNECustomerRegistrationForm"

            // Call delete function with record ID
            deleteRecord(listTitle, recordId);
        });
    });

    // Select all delete buttons by class
    const deleteTrainingButtons = document.querySelectorAll('.delete-training');

    // Add click event listener to each delete button
    deleteTrainingButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Extract record ID from data attribute
            const recordId = button.getAttribute('data-record-id');
            const listTitle = "TrainingList"

            // Call delete function with record ID
            deleteRecord(listTitle, recordId);
        });
    });
});

function updateListItem(itemId, updatedItem) {
    console.log("Updating item with ID:", itemId);
    fetch(`http://localhost:3000/api/update-list-item/CNECustomerRegistrationForm/${itemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem) // Convert to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}\n${JSON.stringify(response.body)}`);
        }
        return response.json();
    })
    .then(data => {
        if (data === undefined) {
            console.error("Error: Item update response is undefined.");
            return;
        }
        console.log("Item updated successfully.");
        
        // Close all modals with id starting with editModal_
        $('div[id^="editModal_"]').modal('hide');            
        
        // Reload the page to reflect the changes
        location.reload();
    })
    .catch(error => {
        console.error("Error updating item:", error.message); // Log the error message
    });    
}

//UPDATE TRAINING LIST 

function updateTrainingListItem(itemId, updatedItem) {
    console.log("Updating item with ID:", itemId);
    fetch(`http://localhost:3000/api/update-list-item/TrainingList/${itemId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem) // Convert to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}\n${JSON.stringify(response.body)}`);
        }
        return response.json();
    })
    .then(data => {
        if (data === undefined) {
            console.error("Error: Item update response is undefined.");
            return;
        }
        console.log("Item updated successfully.");
        
        // Close all modals with id starting with editModal_
        $('div[id^="editModal_"]').modal('hide');            
        
        // Reload the page to reflect the changes
        location.reload();
    })
    .catch(error => {
        console.error("Error updating item:", error.message); // Log the error message
    });    
}


function extractFormData() {
    try {
        // Extract data and trim string inputs
        let title = $("#lastName").val();
        let lastName = $("#lastName").val();
        let firstName = $("#firstName").val();
        let email = $("#email").val();
        let contactNumber = $("#contactNumber").val();
        let companyName = $("#companyName").val();

        // Extract file from input field
        const file = $('#fileInput')[0].files[0];

        console.log("Last Name:", lastName);
        console.log("First Name:", firstName);
        console.log("Email:", email);
        console.log("Contact Number:", contactNumber);
        console.log("Company Name:", companyName);
        console.log("File:", file); // Log the file object

        // Extract training details from hidden input fields
        let trainingId = $("#trainingId").val();

        // Construct the form data object
        let formData = new FormData();
        formData.append('Title', title);
        formData.append('LastName', lastName);
        formData.append('FirstName', firstName);
        formData.append('Email', email);
        formData.append('ContactNumber', contactNumber);
        formData.append('CompanyName', companyName);
        formData.append('TrainingScheduleId', trainingId);
        formData.append('file', file); // Append the file to the FormData object

        return formData;
    } catch (error) {
        handleSubmissionError(error);
        // Log and handle the error
        console.error("Error extracting form data:", error);
        alert("An error occurred while submitting the form. Please try again later.");
    }
}

function extractTrainingFormData() {
    try {
        // Extract data and trim string inputs
        let title = $("#title").val();
        let dateFrom = $("#dateFrom").val();
        let dateTo = $("#dateTo").val();
        let location = $("#location").val();

        console.log("Title:", title);
        console.log("Date From:", dateFrom);
        console.log("Date To:", dateTo);
        console.log("Location:", location);

        // Construct the form data object
        let formData = new FormData();
        formData.append('Title', title);
        formData.append('DateFrom', dateFrom);
        formData.append('DateTo', dateTo);
        formData.append('Location', location);

        return formData;
    } catch (error) {
        handleSubmissionError(error);
        // Log and handle the error
        console.error("Error extracting form data:", error);
        alert("An error occurred while submitting the form. Please try again later.");
    }
}


// Function to send AJAX request to delete record
function deleteRecord(listTitle, recordId) {
    // Send AJAX request to backend endpoint
    fetch(`/api/delete-list-item/${listTitle}/${recordId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete record');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        console.log('Record deleted successfully');
        // You may want to update the UI after successful deletion

        // Close all modals with id starting with deleteModal_
        $('div[id^="deleteModal_"]').modal('hide');            
        
        // Reload the page to reflect the changes
        location.reload();
    })
    .catch(error => {
        // Handle error
        console.error('Error deleting record:', error);
        // You may want to show an error message to the user
    });
}