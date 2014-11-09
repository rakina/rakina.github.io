jQuery.ajaxPrefilter(function( options ) {
    options.global = true;
});

$(document).ready(function(){
	var numOfContestants = 0;
	var contestantsPerPage = 20;
	var numOfPages = 0;
	var contestants;
	var chosenCountry = "";
	getStandings();
	alert("UDAH");

	function getStandings(){
		$.ajax({
			url: "http://codeforces.com/api/contest.standings?contestId="+getID()+"&jsonp=?",
			dataType: 'jsonp',
			async: false,
			cache: false,
			success: function(data){
				if (data.status != "OK"){
					//something wrong happened!
				   	alert("Failed to load standings. Please reload.");
				  }
				
				contestants = [];
				numOfContestants = data.result.rows.length;
				var handles = "";
				for (var i = 0; i < numOfContestants; ++i){
					contestants.push({handle:data.result.rows[i].party.members[0].handle,points:data.result.rows[i].points});
					if (i < 10000){
						if (i != 0) handles += ";";
						handles += contestants[i].handle;
					}
				}
				alert("HMM");
				numOfPages = numOfContestants/contestantsPerPage;
				if (numOfContestants % contestantsPerPage > 0)
					numOfPages++;
				alert("WOYYY~");
				$.ajax({
					url: "http://codeforces.com/api/user.info?handles="+handles+"&jsonp=?",
					dataType: 'jsonp',
					async: false,
					cache: false,
					success: function(data){
						alert("SUKSES");
						for (var i = 0; i < numOfContestants; ++i){
							contestants[i].country = data.result[i].country;
							contestants[i].rank = data.result[i].rank;
						}
					}
				});
			}
		});
		
	}
	
	function getID(){
		var url = window.location.href;
		alert(url+ " "+ url.indexOf("="));
		alert(url.substring(url.indexOf("=")+1)+"~");
		return parseInt(url.substring(url.indexOf("=")+1));
		//parseInt(window.location.href.slice(window.location.href.indexOf("=")+1));
	}

	function printRow(idx){
		return "<tr><td>"+(idx+1)+"</td><td>"+contestants[idx].handle+"</td><td>"
		+contestants[idx].points+"</td></tr>";
	}

	function printContestants(page){
		$(".standingsTable").html("<tr><th>rank</th><th>handle</th><th>points</th></tr>");
		var lowerBound = (page-1)*contestantsPerPage;
		var upperBound = lowerBound + contestantsPerPage;
		var counter = 0;

		for (var i = 0; i < numOfContestants && counter < upperBound; ++i)
			if (isIncluded(i)){
				if (counter >= lowerBound)
					$(".standingsTable").append(printRow(i));
				++counter;
			}
	}

	function isIncluded(idx){

		if (chosenCountry == "") return true;
		//if (idx < 5) alert(chosenCountry+" "+contestants[i].handle+" "+contestants[i].country)
		return chosenCountry == contestants[idx].country;
	}

	function countIncluded(){
		var ret = 0;
		for (var i = 0; i <numOfContestants; ++i)
			ret += isIncluded(idx);
		return ret;
	}

	 $(document).ajaxStop(function(){
		
		printContestants(1);
		
		$('#pagination-demo').bootpag({
            total: numOfPages, maxVisible: 5
        }).on("page", function(event, /* page number here */ num){
             printContestants(num); 
             
        });

        $("#country").change(function(){
            chosenCountry = $(this).val();
            var numOfValidContestants = countIncluded();
            numOfPages = numOfValidContestants/contestantsPerPage;
            if (numOfValidContestants % contestantsPerPage != 0)
            	numOfPages++;
            $('#pagination-demo').bootpag({total: numOfPages});
            printContestants(1);
        });
        
	});

});
	
