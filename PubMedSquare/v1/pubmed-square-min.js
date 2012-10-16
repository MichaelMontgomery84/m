function pubmedSearch(a){moveSearchBarToTheTop();current_query=a;$.ajax({type:"GET",async:true,url:"http://eutils.ncbi.nlm.nih.gov/entrez/eutils/espell.fcgi?",data:{db:"pubmed",term:a},success:function(a){var b=$(a).find("CorrectedQuery").text();if(b!=""){$("#spelling-text").html("Do you mean <span id='corrected-text'>"+b+"</span> ?");$("#spelling-text").show();$("#corrected-text").click(function(){$("#search-bar-input").val(b);$("#spelling-text").hide();$("#search-button").click()})}},error:function(){$("#service-down").show();$("#loading").hide()}});var b;if(isReviewQuery){b=window_reviews;a="("+a+') "review"[Filter]'}else{b=window_articles}$.ajax({type:"GET",async:true,url:"http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",data:{db:"pubmed",retmax:b+20,term:a}}).done(function(a){var c=[];$(a).find("IdList Id").each(function(){c.push($(this).text())});if(c.length==0){$("#loading").hide();$("#loading-small").hide();$("#filter-box").show();$("#warning-text").show();turnOffQueryButton()}var d=$(a).find("eSearchResult > Count").text();var e=[];var f=false;for(var g=b;g<b+20;g++){if(c[g]!=undefined){e.push(c[g])}else{f=true}}if(f){if(isReviewQuery){noMoreReviews=true}else{noMoreArticles=true}}if(isReviewQuery){window_reviews=window_reviews+e.length}else{window_articles=window_articles+e.length}if(e[0]!=undefined){$.ajax({type:"GET",async:true,url:"http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",data:{db:"pubmed",id:e.join(","),rettype:"full",retmode:"xml"}}).done(function(a){$("#loading").hide();$("#loading-small").hide();$("#filter-box").show();$("#warning-text").show();if(f){turnOffQueryButton()}else{turnOnQueryButton()}$(a).find("PubmedArticle").each(function(){var a=$(this).find('[PubStatus="entrez"] Year').text();var b=$(this).find('[PubStatus="entrez"] Month').text();var c=$(this).find('[PubStatus="entrez"] Day').text();var d=parseInt(a)*365+parseInt(b)*30+parseInt(c);var e=a+" "+getMonth(b)+" "+c;var f="";var g=0;var h=$(this).find("AuthorList Author").each(function(){var a=$(this).find("LastName").text();var b=$(this).find("Initials").text();if(g<10){if(f==""){f=a+" "+b}else{f+=", "+a+" "+b}g++}else if(g==10){f+="...";g++}});var i=[];$(this).find("PublicationTypeList PublicationType").each(function(){var a=$(this).text();i.push(a.toLowerCase())});var j=$(this).find("AbstractText").text();var k=$(this).find("ArticleTitle").text();var l=$(this).find("ISSNLinking").text();var m=$(this).find("MedlineCitation > PMID").text();var n=$(this).find("Affiliation").text();var o=$(this).find("MedlineTA").text();var p=getCitation(l);var q=new Article;q.setImpact(p);q.title=k;q.pmid=m;q.affiliation=n;q.abbrevJournal=o;q.date=d;q.dateString=e;q.authors=f;q.publicationTypes=i;q.isReview=isReview(i);q.abstractText=j;q.registerClick($container);if(!isReviewQuery&&!q.isReview){q.render($container,renderingMethod)}else if(isReviewQuery&&q.isReview){q.render($container,renderingMethod)}})})}})}function isReview(a){for(var b in a){if(a[b]=="review"){return true}}return false}function moveSearchBarToTheTop(){$("#out").animate({top:"0%"},200)}function turnOffQueryButton(){$("#more-results .button-filter").addClass("loading");$("#more-results .button-filter").html("No more results");$("#more-results .button-filter").addClass("blocked")}function turnOnQueryButton(){$("#more-results .button-filter").html("More results");$("#more-results .button-filter").removeClass("loading")}function getMonth(a){var b="month";switch(parseInt(a)){case 1:b="Jan";break;case 2:b="Feb";break;case 3:b="Mar";break;case 4:b="Apr";break;case 5:b="May";break;case 6:b="Jun";break;case 7:b="Jul";break;case 8:b="Aug";break;case 9:b="Sep";break;case 10:b="Oct";break;case 11:b="Nov";break;case 12:b="Dec";break}return b}$(document).ready(function(){current_query=$("#search-bar-input").val();$("#search-bar-input").val(help_text);$("#search-button").click(function(){var a=$("#search-bar-input").val();if(a!=help_text&&a!=""){if(a!=current_query){isReviewQuery=false;$(".article").remove();$("#sort-citations > .button-filter").removeClass("clicked");$("#sort-date > .button-filter").addClass("clicked");window_articles=0;window_reviews=0;noMoreReviews=false;noMoreArticles=false;$container.isotope("remove",$(".article"));renderingMethod="append";if(firstQuery==true){$("#loading").show();firstQuery=false}$("#loading-small").show();$("#spelling-text").hide();var b=new RegExp("#review");if(a.match(b)){var c=a.replace("#review","");c="("+c+') "review"[Filter]';a=c}pubmedSearch(a)}}});$(document).keyup(function(a){if(a.keyCode==13){$("#search-button").click()}});$("#search-bar-input").focus(function(){if($(this).val()==help_text){$(this).val("");$(this).removeClass("indication")}});$("#search-bar-input").focusout(function(){if($(this).val()==""){$(this).val(help_text);$(this).addClass("indication")}});$("#container").isotope({masonry:{columnWidth:163},getSortData:{citation:function(a){return parseInt(a.attr("citation"),10)},date:function(a){return parseInt(a.attr("date"),10)}}}).isotope({sortBy:"date",sortAscending:false});$("#expand-all").click(function(){$("#loading-small").show(function(){$(".article").each(function(){if($(this).hasClass("small")){animateToBig($(this))}});$("#loading-small").hide()});return false});$("#collapse-all").click(function(){$("#loading-small").show(function(){$(".article").each(function(){if($(this).hasClass("big")){animateToSmall($(this))}});$("#loading-small").hide()});return false});$("#sort-citations").click(function(){$("#sort-date > .button-filter").removeClass("clicked");$("#sort-citations > .button-filter").addClass("clicked");$("#container").isotope({sortBy:"citation",sortAscending:false});return false});$("#logo-text").click(function(){$("#explanations").fadeIn("slow");$("#container").hide()});$("#question-mark").click(function(){$("#explanations").fadeIn("slow");$("#container").hide()});$("#close-explanations").click(function(){$("#container").show();$("#explanations").fadeOut("slow")});$("#sort-date").click(function(){$("#sort-citations > .button-filter").removeClass("clicked");$("#sort-date > .button-filter").addClass("clicked");$("#container").isotope({sortBy:"date",sortAscending:false});return false});$("#show-review").toggle(function(){$("#container").isotope({filter:".review"});$("#show-review > .button-filter").addClass("clicked");isReviewQuery=true;if(noMoreReviews==true){turnOffQueryButton()}else{turnOnQueryButton()}if($(".review").length==0){$("#more-results").click()}return false},function(){$("#container").isotope({filter:"*:not(.review)"});$("#show-review > .button-filter").removeClass("clicked");isReviewQuery=false;if(noMoreArticles==true){turnOffQueryButton()}else{turnOnQueryButton()}});$("#more-results").click(function(){if(!$("#more-results .button-filter").hasClass("loading")){$("#loading-small").show();$("#more-results .button-filter").html("Loading articles...");$("#more-results .button-filter").addClass("loading");renderingMethod="insert";pubmedSearch(current_query)}return false})});var $container=$("#container");var window_articles=0;var window_reviews=0;var current_query;var help_text="Type some keywords (e.g. 'cancer' or 'apoptosis regulation')";var renderingMethod="append";var firstQuery=true;var isReviewQuery=false;var noMoreReviews=false;var noMoreArticles=false