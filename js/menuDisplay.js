$(document).ready(function() {
    $("#navToggle a").click(function(e){
        e.preventDefault();
		//e.stopPropagation();
        $("header > nav").slideToggle("medium");
        $("#logo").toggleClass("menuUp menuDown");
    });
	
	$("header > nav").click(function(e){
    	e.stopPropagation();
	});
	
	/*$(document).click(function(){ 		// se clicco fuori dal menu il menu scompare
     	if ($(window).width() < 600) { 		// ciò accade solo su mobile
			$("header > nav").slideUp();
		}
	});*/
    
    $(window).resize(function() {
        if($( window ).width() >= "600") {
            $("header > nav").css("display", "block");
            
            if($("#logo").attr('class') == "menuDown") {
                $("#logo").toggleClass("menuUp menuDown");
            }
        }
        else {
            $("header > nav").css("display", "none");
        }
    });
    
    $("header > nav > ul > li > a").click(function(e) {
        if($( window ).width() <= "600") {
            if($(this).siblings().size() > 0 ) {
                $(this).siblings().slideToggle("fast")
				$(this).children(".toggle").html($(this).children(".toggle").html() == '-' ? '+' : '-');
            }
        }
    });	
});