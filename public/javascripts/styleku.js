//UNTUK MENU SAMPING SEMBUNYI-MUNCUL
$("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
  });


 $(document).ready(function(){

//UNTUK MENU SAMPING SCROLLSPY
    $('.scrollspy').scrollSpy({
    	scrollOffset: 80
    });

	$(".dropdon").dropdown();


//datepicker
	$('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 10 // Creates a dropdown of 10 years to control year
	});
        
//MENAMBAH ROW TABEL DAN ISINYA DENGAN ENTER KEY
  var t = document.getElementById("tab-sementara");
  var receiving = "receiving";
  $('#nomet').on('keyup', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $('#tab-sementara').append('<tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><a class="btn-floating red"><i class="material-icons" onclick="deleteRow(this)">delete</i></a></td></tr></tbody>');
        $('#tab-sementara tr:last td:first').html($('#tanggal').val());
        $('#tab-sementara tr:last td:nth-child(2)').html($('#no-order').val());
        $('#tab-sementara tr:last td:nth-child(3)').html((t.rows.length)-1);
        $('#tab-sementara tr:last td:nth-child(4)').html($(this).val());
        $('#tab-sementara tr:last td:nth-child(5)').html($('#lokasi').val());
        $('#tab-sementara tr:last td:nth-child(6)').html($('#pengirim').val());
        $('#tab-sementara tr:last td:nth-child(7)').html(receiving);
        var jenisAlat;
        var nomet = $(this).val();
        switch (true){
            case (0 <= nomet &&  nomet < 500000):
                jenisAlat = "Dimensi";
                break;
            case (500000 <= nomet &&  nomet < 800000):
                jenisAlat = "Mekanik";
                break;
            case (800000 <= nomet &&  nomet < 900000):
                jenisAlat = "Elektrik";
                break;
            case (nomet >= 930000):
                jenisAlat = "Elektrik";
                break;
            case (900000 <= nomet &&  nomet < 930000):
                jenisAlat = "Temperatur";
                break;
        }
        $('#tab-sementara tr:last td:nth-child(8)').html(jenisAlat);
        $(this).focus().select();
    }
   });
     //tooltip

     $('.selesai').tooltip({delay: 20, position:"right", html:true});
     $('.terakhir').tooltip({delay: 20, tooltip:"lihat order terakhir!", position:"right", html:true});
     $('.ambil').tooltip({delay: 20, tooltip:"Ambil dan simpan direceiving!", position:"right", html:true});
     $('.cari').tooltip({delay: 20, tooltip:"cari berdasarkan order, nomet,atau lokasi", position:"right", html:true});
     $('.close').tooltip({delay: 20, tooltip:"close", position:"right", html:true});
     $('.ter-alat').tooltip({delay: 20, position:"down", html:true});
     $('.ter-persen').tooltip({delay: 20, position:"right", html:true});
     $('.ygselesai').tooltip({delay: 20, position:"down", html:true});
  });

//MENGHAPUS ROW PADA TABEL SEMENTARA
 function deleteRow(r) {
    var i = r.parentNode.parentNode.parentNode.rowIndex;
    var t = document.getElementById("tab-sementara");
    t.deleteRow(i);


     for(var j=1;j<t.rows.length; j++)
      {
       /// Index Row Numbers
       var tr = t.rows[j];

       if(tr.children[2].textContent)
          tr.children[2].textContent = j;
      }

}

//MENGIRIM DATA TABEL(dirubah keJSON) KE db.metmasuk
$('#convert-table').click( function() {
    var table = $('#tab-sementara').tableToJSON();
    console.log(table);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "http://localhost:8000");
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xmlhttp.send(JSON.stringify(table));
    alert("berhasil");
});

//mengambil value nomet dan hasil yes
$(".use-address").click(function() {
    var $row = $(this).closest("tr");    // Find the row
    var $text = $row.find(".nr").text(); // Find the text
    var $hasil = "pass";
    // Let's test it out
    document.getElementById("nomets").value = $text;
    document.getElementById("hasil").value = $hasil;
    $("#second").click();
});

//mengambil value nomet dan hasil no
$(".use-add").click(function() {
    var $row = $(this).closest("tr");    // Find the row
    var $text = $row.find(".nr").text(); // Find the text
    var $hasil = "failed";
    // Let's test it out
    document.getElementById("nomets").value = $text;
    document.getElementById("hasil").value = $hasil;
    $("#second").click();
});

//mengambil value nomet2
$(".use-close").click(function() {
    var $row = $(this).closest("tr");    // Find the row
    var $text = $row.find(".nn").text(); // Find the text

    // Let's test it out
    document.getElementById("nomett").value = $text;
    $("#second").click();
});

//TABEL PENCARIAN
function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("cari-nomet");
    filter = input.value.toUpperCase();
    table = document.getElementById("tab-cari");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function myFunction1() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("cari-order");
    filter = input.value.toUpperCase();
    table = document.getElementById("tab-cari");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function myFunction2() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("cari-lokasi");
    filter = input.value.toUpperCase();
    table = document.getElementById("tab-cari");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function myFunction3() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("cari-orders");
    filter = input.value.toUpperCase();
    table = document.getElementById("tab-lab");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}