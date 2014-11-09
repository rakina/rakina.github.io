jQuery.ajaxPrefilter(function( options ) {
    options.global = true;
});

$(document).ready(function(){
	var numOfContests = 0;
	var contestsPerPage = 10;
	var numOfPages = 0;
	var contests;
	var div2Contests, div1Contests, specialContests;
	div2Contests = div1Contests = specialContests = [];

	$.ajax({
		url: "http://codeforces.com/api/contest.list?gym=false&jsonp=?",
		dataType: 'jsonp',
		async: false,
		cache: false,
		success: function(data){
			if (data.status != "OK"){
				//something wrong happened!
			   	alert("Failed to load contest. Please reload.");
			  }
			contests = data.result;
			numOfContests = data.result.length;
			numOfPages = numOfContests/contestsPerPage;
			if (numOfContests % contestsPerPage > 0)
				numOfPages++;
			separate();
		}
	});

	function separate(){
		// separate div 1 contest, div 2 contest, and special contests
		for (var i = 0; i < numOfContests; ++i){

		}
	}

	function toDate(secs){
		var t = new Date(1970,0,1);
		t.setSeconds(secs);
		return t.getDate()+"/"+ (t.getMonth()+1) + "/"+t.getFullYear();
	}

	function printRow(idx){
		return "<tr><td><a href = 'contest.html?id="+contests[idx].id
		+"'><div>"+contests[idx].name+"</div></a></td><td>"
		+toDate(contests[idx].startTimeSeconds)+"</td></tr>";
	}

	function printContests(page){
		$(".contestsTable").html("<tr><th>Name</th><th>Date</th></tr>");

		for (var i = (page-1)*contestsPerPage; i < page*contestsPerPage; ++i)
			$(".contestsTable").append(printRow(i));
	}

	 $(document).ajaxStop(function(){
		printContests(1);

		$('#pagination-demo').twbsPagination({
	        totalPages: numOfPages,
	        visiblePages: 5,
	        onPageClick: function (event, page) {
	           printContests(page);
	        }
	    });
	});

});
	
