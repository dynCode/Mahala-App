<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-Type: application/json; charset=UTF-8");

    // mysql database settings
    $dbuser = "mahaln_1";
    $dbuserpass = "skGcmmR8";
    $dbname = "mahaln_db1";
    $dbhost = "dedi1111.nur4.host-h.net";

    //$dbuser = "root";
    //$dbuserpass = "";
    //$dbname = "mahala";
    //$dbhost = "127.0.0.1";

    // Connect to mysql database
    $mysqli = new mysqli($dbhost,$dbuser,$dbuserpass,$dbname);
    // check connection 
    if ($mysqli->connect_errno) {
        printf("Connect failed: %s\n", $mysqli->connect_error);
        exit();
    }    
    $SQL = "SELECT partner_category FROM discount_partner GROUP BY partner_category ORDER BY partner_category ASC";
    $dd_results = $mysqli->query($SQL);
    
    $outp = "[";
    while($rs = $dd_results->fetch_array(MYSQLI_ASSOC)) {
        if ($outp != "[") {$outp .= ",";}
        $outp .= '{"Id":"'.$rs["partner_category"].'",';
        $outp .= '"Name":"'.$rs["partner_category"].'"}'; 
    }
    $outp .="]";
    
    $mysqli->close(); 
    echo($outp);