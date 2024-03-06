$(document).ready(function() {
    $('#DataTables_Table_0').DataTable();

    var table = $('#DataTables_Table_0').DataTable();

    // Event listener for selectTraining dropdown
    $('#selectTraining').on('change', function() {
        var training = $(this).val();

        // If "All Trainings" is selected, show all rows
        if (training === "") {
            table.rows().every(function() {
                $(this.node()).show();
            });
            return;
        }

        // Filter the table based on the selected training
        table.rows().every(function() {
            var row = this.node();
            if ($(row).hasClass(training)) {
                $(row).show();
            } else {
                $(row).hide();
            }
        });
    });
});