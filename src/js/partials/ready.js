$(function() {
	console.log('Ready!');

	$('#btnModal').click(function(){
		$("#myModal").modal('show');
	});
	$('[data-toggle="tooltip"]').tooltip(); 
});