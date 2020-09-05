jQuery(document).ready(function($) {
    $(window).scroll(function(){
        if ($(window).width()<765){
            if ($(this).scrollTop()>200){
                $('.cat').addClass('sticky');  
            }
            else{
                $('.cat').removeClass('sticky');
            }
        }
        else{
            if ($(this).scrollTop()>150){
                $('.cat').addClass('sticky');  
            }
            else{
                $('.cat').removeClass('sticky');
            }   
        }
    });

    
    $(".page-link").on("click",function(event){
        var tabindex = $(this).attr("tabindex");
        var category = $(this).attr("href");
        $(this).hide();
        $(".loader").show();
        if ($("#access-check").val()=="Graphican"|| $("#access-check").val()=="update_check"){
            var access = "True";
        }
        else{
            var access="False";
        }
        var new_tabindex = parseInt(tabindex)+1;
        $.ajax({
            type:"POST",
            url:"/pagination",
            data: JSON.stringify({ "tabindex":tabindex ,"category":category,"access":access}),
            contentType:"application.json;charset=utf-8",
            datatype:"json"
        })
        .done(function(data){
            if (data.error){
                $(".loader").hide();
                $(".page-link").remove();
            }
            else{
            $(".loader").hide();
            $(".page-link").show();
                if(data.page==true){
                $(".page-link").attr("tabindex",new_tabindex);
                $("#show_content").append(data.next_set);
                }
                else{
                $(".loader").hide();
                $(".page-link").remove();
                }
            }
            
        });
        event.preventDefault();
    });
//use $(document) in place of selector for making this block effect to the dynamically added content
// $(document).attr("title") is used to access the title of the webpage
    $(document).on("click",".Graph",function(event){
    var srn = $(this).attr("alt");
                $('.describe').hide();
                $('#category').hide();
                $('#up_date').hide();
                $('#by').hide();
                $("#download").attr("href", "");
                $("#category").attr("href", "");
                $("#update").attr("href", "");
                $("#delete").attr("href", "");
        $.ajax({
            type: "POST",
            url: "/img_data",
            data: JSON.stringify({ "num" : srn } ),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function(data){
            if (data.error){
                $('#error').text(data.error).show();
            }
            else{
            if (data.editable==false){
                $('.describe').html(data.desc).show();
                $('#category').text(data.category).show();
                $('#up_date').text(data.up_date).show();
                $('#by').html("<a href='/user?srn="+data.usrn+"'>"+data.by+"</a>").show();
                $("#download").attr("href", data.url);
                $("#category").attr("href", "/filter/"+data.category);
                $("#update").remove();
                $("#delete").remove();
            }
            else{
                $('.describe').html(data.desc).show();
                $('#category').text(data.category).show();
                $('#up_date').text(data.up_date).show();
                $('#by').html("<a href='/user?srn="+data.usrn+"'>"+data.by+"</a>").show();
                $("#download").attr("href", data.url);
                $("#category").attr("href", "/filter/"+data.category);
                $("#update").attr("href", "/update_imgData/"+data.usrn+"/"+srn);
                $("#delete").attr("href", data.del_url);
             }
            }
        });
        event.preventDefault();
    });

    //This is used when we delete any photo while surfing trough the images
    $('#delete').click(function(event){
        var URL=$(this).attr("href");
        $.ajax({
            url: URL,
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        })
        .done(function(data){
            if (data.error){
                $.notice({
                    text: "Sorry! not deleted.",
                    type: "error"
                });
            }
            else{
                $.notice({
                    text:"Deleted successfully!",
                    type:"success"
                })
                $("div").remove("#"+data.id);
            }
        });
        event.preventDefault(); 
    });

// ayushi
$(".more-user").click(function(){
    var tabindex = $(this).attr("tabindex");
    var page = $(this).attr("href");
    var new_tabindex = parseInt(tabindex)+1;
    $(this).hide();
    $(".loader").show();
    $.ajax({
        type:"POST",
        url:"/request",
        data: JSON.stringify({"tabindex":tabindex,"page_type":page}),
        contentType:"application.json;charset=utf-8",
        datatype:"json"
    })
    .done(function(data){
        if (data.error){
            $(".loader").show();
            $(".more-user").remove();
        }
        else{
            var index = parseInt($("#index").val());
            type = "user"
            for(i=0;i<data.data.length;i++){
                $("#table").append("<tr id='"+data.data[i][0]+"'><td>"+(index+i+1)+"</td><td class='mobile_hide'><a href='mailto:"+data.data[i][1]+"' target='blank'>"+data.data[i][1]+"</a></td><td><a href='/user?srn="+data.data[i][0]+"' target='blank'>"+data.data[i][2]+"</a></td><td><b>D:</b>"+data.data[i][3]+"<br/><b>T:</b>"+data.data[i][4]+"</td><td><a href='/admin/delete/' tabindex='"+data.data[i][0]+"' onclick='return del(this,\"user\")'>Delete</a></td></tr>");
            }
            if (data.next==true){
                $(".more-user").show();
                $(".loader").hide();
                $("#index").val(index+i);
                $(".more-user").attr("tabindex",new_tabindex);
            }
            else{
                $(".loader").hide();
                $(".more-user").remove();
            }
        }
    });
    event.preventDefault();
});
// End


    jQuery('.more-content').on('click', function(event) {
        /* This is used to get the data from the server for serving the admin with data*/
        var tabindex = $(this).attr("tabindex");
        var category = $(this).attr('href');
        var page = document.title;
        var new_tabindex = parseInt(tabindex)+1;
        $(".more-content").hide();
        $(".loader").show();
        jQuery.ajax({
          url: '/request',
          type: 'POST',
          dataType: 'json',
          data:  JSON.stringify({"tabindex":tabindex, 'page_type':page, "category":category}),
          complete: function(xhr, textStatus) {
            jQuery(".more-content").html("Next");
          },
          success: function(data, textStatus, xhr) {
            //called when successful
            if (data.error){
                $(".loader").hide();
                $(".more-content").remove();
            }
            else{
                if(data.next==true){
                $(".more-content").attr("tabindex",new_tabindex);
                $("#list-table").append(data.template);
                $(".more-content").show();
                $(".loader").hide();
                }
                else{
                    if (data.more==true){
                        //This is to check if there is any data to append to the table
                        //if there is no data to append then skip this code
                       $("#list-table").append(data.template); 
                       $(".more-content").show();
                        $(".loader").hide();
                    }
                    $(".loader").hide();
                    $(".more-content").remove();
                }
            }

          },
          error: function(xhr, textStatus, errorThrown) {
            $(".more-content").remove();
          }
        });
        
        event.preventDefault();
        /* Act on the event */
    });


    jQuery("#send_feed").click(function(event) {
        var url = jQuery("#fform").attr('action');
        var rate = jQuery("input[name=rating]:checked").prop('value');
        var email = jQuery("input[name=feed_email]").prop('value');
        var msg = jQuery("textarea[name=msg]").prop('value');
        if (rate != undefined && email != ""){
            $("#fclose").click();
            jQuery.ajax({
              url: url,
              type: "POST",
              dataType: 'json',
              data: JSON.stringify({"email":email,"msg":msg,"rating":rate}),
              success: function(data, textStatus, xhr) {
                jQuery("#notify").show();
                // jQuery("#notify").html("Thanks for the feedback.&#128522");
                // jQuery("#notify").attr('class', 'notify');
                // jQuery("#notify").css({color: 'white'});
                if (data.status){
                    $.notice({
                    text:"Thanks for the feedback.&#128522",
                    type:"success"
                });
                $("#reset").click(); 
                }
                else{
                    $.notice({
                    text:"Feedback not sent!",
                    type:"error"
                });
                }
              },
              error: function(xhr, textStatus, errorThrown) {
              $.notice({
                text:"Feedback not sent!",
                type:"error"
              });
              }
            });
        }
        else{
            if(email == ""){
                $.notice({
                    text:"Please enter your email.&#128522",
                    type:"info"
                });
            }
            else{
                $.notice({
                    text:"Please give us rating.&#128522",
                    type:"info"
                });
            }
            
        }
        event.preventDefault();
    });

// self dropdown js for upload form
    $("#add-link").click(function(event) {
        /* Act on the event */
            if($("#add-options").css('display') == "block"){
                $("#add-options").css('display', 'none');
            }
            else{
                $("#add-options").css('display', 'block');
            }
        });

    $("#block-submit").click(function(event) {
        /* Act on the event */
        if($(this).attr('onclick') == "return false;"){
            $("#user").focus();
        }
    });
});


// function getFormData(form) {
//     // creates a FormData object and adds chips text
//     var formData = new FormData(document.getElementById(form));
// //    for (var [key, value] of formData.entries()) { console.log('formData', key, value);}
//     return formData
// }