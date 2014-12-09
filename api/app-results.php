<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    header("Content-Type: application/json; charset=UTF-8");

    require_once('lib/nusoap.php');
    require_once('lib/class.phpmailer.php');
    
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
    
    function getMemberBalance($acc_no, $password) 
    {
        // get token
        $client = new nusoap_client('http://rent.loyaltyplus.co.za/Loyalty/rent/webConnect?wsdl', false);

        $err = $client->getError();

        if ($err) 
        {
          echo '<h2>Constructor error</h2><pre>' . $err . '</pre>';
          echo '<h2>Debug</h2><pre>' . htmlspecialchars($client->getDebug(), ENT_QUOTES) . '</pre>';
          exit();
        }

        $params = '
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:loy="loyaltyplus.rent" xmlns:loy1="loyaltyplus.gen">
         <soapenv:Header/>
         <soapenv:Body>
            <loy:Logon>
               <loy1:LoyaltyConnectionToken>
                  <mOrgId>rent</mOrgId>
                  <mProductId>rent</mProductId>
                  <mSystemUser>'.$acc_no.'</mSystemUser>
                  <mSystemPassword>'.$password.'</mSystemPassword>
                  <mLanguage></mLanguage>
                  <mSessionId></mSessionId>
               </loy1:LoyaltyConnectionToken>
            </loy:Logon>
         </soapenv:Body>
        </soapenv:Envelope>
        ';

        $result1 = $client->send($params);

        $mSessionId = $result1['LoyaltyConnectionToken']['mSessionId'];

        $params = '
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:loy="loyaltyplus.rent">
         <soapenv:Header/>
         <soapenv:Body>
            <loy:MemberBalanceRetrieve>
               <loy:MemberKey>
                  <mCommToken>
                     <mOrgId></mOrgId>
                     <mProductId></mProductId>
                     <mSystemUser></mSystemUser>
                     <mSystemPassword>mahala</mSystemPassword>
                     <mLanguage>en</mLanguage>
                     <mSessionId>'.$mSessionId.'</mSessionId>
                  </mCommToken>
                  <mMPAcc>'.$acc_no.'</mMPAcc>
                  <mAccAlias></mAccAlias>
                  <mCIS></mCIS>
               </loy:MemberKey>
            </loy:MemberBalanceRetrieve>
         </soapenv:Body>
        </soapenv:Envelope>
        ';

        $result2 = $client->send($params);

        $result2['mSessionId'] = $mSessionId;

        return $result2;
    }

    //mailing function
    function sendEmail ($emailAddress, $head, $body, $emailSubject, $emailHeader) {
        // Retrieve the email template required 
        $message = file_get_contents('html/emailer.html'); 
        // Replace the % with the actual information 
        $message = str_replace('%emailHeader%', $head, $message); 
        $message = str_replace('%emailContent%', $body, $message);
        
        $mail = new PHPMailer(); // defaults to using php "mail()"
        $mail->IsSMTP();  // telling the class to use SMTP
        $mail->SMTPAuth = true; // enable SMTP authentication
        $mail->Host = "smtp.myitmanager.co.za"; // sets GMAIL as the SMTP server
        $mail->Port = 587; // set the SMTP port for the GMAIL server
        $mail->Username = "llewellyn.dawson@myitmanager.co.za"; // GMAIL username
        $mail->Password = "PlAnKiE101"; // GMAIL password

        $mail->SetFrom('admin@mahalas.co.za', 'Mahala Mobile Request');
        
        $mail->AddAddress($emailAddress, $emailHeader);

        $mail->Subject = $emailSubject;

        $mail->AltBody = "To view the message, please use an HTML compatible email viewer!"; // optional, comment out and test

        $mail->MsgHTML($message);
        
        $mail->Send();
        
        // Clear all addresses for next loop
        $mail->ClearAddresses();
    }
    
    // The request is a JSON request.
    // We must read the input.
    // $_POST or $_GET will not work!

    $data = file_get_contents("php://input");

    $objData = json_decode($data);
    
    $service = $objData->reqType;
    
    if ($service == 'login') {
        $user = $objData->user;
        $pass = $objData->pass;
        
        $member = getMemberBalance($user, $pass);
        
        $CurrentBalance = $member['LoyaltyMemberSummary']['mCurrentBalance'];
        $UsedUnits = $member['LoyaltyMemberSummary']['mUsedUnits'];
        $CurrTierDescription = $member['LoyaltyMemberSummary']['mCurrTierDescription'];
        $SessionId = $member['mSessionId'];
        $Community = $member['LoyaltyMemberSummary']['mCommunity'];
        $CardNumber = $member['LoyaltyMemberSummary']['mCardNumber'];
        
        if ($SessionId != 0) {
            $array = array("html" => 'You have been logged in', "error" => 0, 'CurrentBalance' => $CurrentBalance, 'UsedUnits' => $UsedUnits, 'CurrTierDescription' => $CurrTierDescription, 'Community' => $Community, 'CardNumber' => $CardNumber);
        } else {
            $array = array("html" => 'Your login details could not be verified, please try again!', "error" => 1); 
        }
    } else if ($service == 'redeemAir') {
        $card = $objData->cardNum;
        $cellNum = $objData->mobile;
        
        $mailHead = "Mahala Redemption Request";
        $mailBody = '
            <p>Dear Call Center Rep,</p>
            <p>Please process the following redemption</p>
            <p>Member Card Number: <b>'.$card.'</b><br/>Cell Number: <b>'.$cellNum.'</b><br />Redepmtion Type: <b>Airtime</b></p>
            <p>Regards,<br />Mahala Mobile</p>';

        sendEmail('info@mahalas.co.za', $mailHead, $mailBody, "Mahala Redemption Request", "Mahala Redemption Request");
        
        $array = array("html" => 'Your request has been sent, thank you.', "error" => 0);
    } else if ($service == 'redeemElc') {
        $card = $objData->cardNum;
        $cellNum = $objData->mobile;
        
        $mailHead = "Mahala Redemption Request";
        $mailBody = '
            <p>Dear Call Center Rep,</p>
            <p>Please process the following redemption</p>
            <p>Member Card Number: <b>'.$card.'</b><br/>Cell Number: <b>'.$cellNum.'</b><br />Redepmtion Type: <b>Electricity</b></p>
            <p>Regards,<br />Mahala Mobile</p>';

        sendEmail('info@mahalas.co.za', $mailHead, $mailBody, "Mahala Redemption Request", "Mahala Redemption Request");
        
        $array = array("html" => 'Your request has been sent, thank you.', "error" => 0);
    } else if ($service == 'redeemFood') {
        $card = $objData->cardNum;
        $cellNum = $objData->mobile;
        
        $mailHead = "Mahala Redemption Request";
        $mailBody = '
            <p>Dear Call Center Rep,</p>
            <p>Please process the following redemption</p>
            <p>Member Card Number: <b>'.$card.'</b><br/>Cell Number: <b>'.$cellNum.'</b><br />Redepmtion Type: <b>Groceries</b></p>
            <p>Regards,<br />Mahala Mobile</p>';

        sendEmail('info@mahalas.co.za', $mailHead, $mailBody, "Mahala Redemption Request", "Mahala Redemption Request");
        
        $array = array("html" => 'Your request has been sent, thank you.', "error" => 0);
    } else if ($service == 'redeemMovie') {
        $card = $objData->cardNum;
        $cellNum = $objData->mobile;
        
        $mailHead = "Mahala Redemption Request";
        $mailBody = '
            <p>Dear Call Center Rep,</p>
            <p>Please process the following redemption</p>
            <p>Member Card Number: <b>'.$card.'</b><br/>Cell Number: <b>'.$cellNum.'</b><br />Redepmtion Type: <b>Nu Metro Movie Tickets</b></p>
            <p>Regards,<br />Mahala Mobile</p>';

        sendEmail('info@mahalas.co.za', $mailHead, $mailBody, "Mahala Redemption Request", "Mahala Redemption Request");
        
        $array = array("html" => 'Your request has been sent, thank you.', "error" => 0);
    } else if ($service == "PointPartnerName") {
        
        $partnerName = $objData->partnerName;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM discount_partner WHERE partner_name LIKE '%".$mysqli->real_escape_string($partnerName)."%'";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "PointPartnerCat") {
        
        $partnerCat = $objData->partnerCat;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM discount_partner WHERE partner_category = '".$mysqli->real_escape_string($partnerCat)."' ORDER BY partner_name ASC";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "PointPartnerCity") {
        
        $partnerCity = $objData->partnerCity;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM discount_partner WHERE partner_suburb = '".$mysqli->real_escape_string($partnerCity)."' ORDER BY partner_name ASC";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "PartnerVoucher") {
        $partnerId = $objData->partnerId;
        
        $SQL = "SELECT dp.partner_tel, dp.partner_address, dp.partner_logo, dv.voucher_description FROM discount_partner dp LEFT OUTER JOIN discount_info dv ON dp.partner_id = dv.partner_id WHERE dp.partner_id = '".$mysqli->real_escape_string($partnerId)."'";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "DiscountPartnerName") {
        
        $partnerName = $objData->partnerName;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM partner_info WHERE partner_name LIKE '%".$mysqli->real_escape_string($partnerName)."%'";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "DiscountPartnerCat") {
        
        $partnerCat = $objData->partnerCat;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM partner_info WHERE partner_category = '".$mysqli->real_escape_string($partnerCat)."' ORDER BY partner_name ASC";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "DiscountPartnerCity") {
        
        $partnerCity = $objData->partnerCity;
        
        $SQL = "SELECT partner_id, partner_category, partner_name, partner_province, partner_suburb, partner_address, partner_logo FROM partner_info WHERE partner_suburb = '".$mysqli->real_escape_string($partnerCity)."' ORDER BY partner_name ASC";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "DiscountPartnerVoucher") {
        $partnerId = $objData->partnerId;
        
        $SQL = "SELECT pi.partner_tel, pi.partner_address, pi.partner_logo, pv.voucher_description FROM partner_info pi LEFT OUTER JOIN partner_voucher pv ON pi.partner_id = pv.partner_id WHERE pi.partner_id = '".$mysqli->real_escape_string($partnerId)."'";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "contactUs") {
        $accountType = $objData->accountType;
        $perks = $objData->perks;
        $comments = $objData->comments;
        $cName = $objData->cName;
        $cSurname = $objData->cSurname;
        $cCell = $objData->cCell;
        $cEmail = $objData->cEmail;
        
        $SQL = "INSERT INTO contact_request (id,name,surname,cell,email,account,perks,comments) VALUES (NULL,'$cName','$cSurname','$cCell','$cEmail','$accountType','$perks','$comments')";
        $mysqli->query($SQL);
        
        $mailHead = "Mahala Contact Request";
        $mailBody = '
            <p>Dear Call Center Rep,</p>
            <p>Please process the following contact request</p>
            <p>Name: <b>'.$cName.'</b><br/>Surname: <b>'.$cSurname.'</b><br />Cell: <b>'.$cCell.'</b><br />Email: <b>'.$cEmail.'</b><br />Mahala Silver & Gold: <b>'.$accountType.'</b><br />Mahala Perks: <b>'.$perks.'</b><br />Comments: <b>'.$comments.'</b></p>
            <p>Regards,<br />Mahala Mobile</p>';

        sendEmail('llewellyn@myitmanager.co.za', $mailHead, $mailBody, "Mahala Contact Request", "Mahala Contact Request");
        
        $array = array("html" => 'Your request has been sent, thank you.', "error" => 0);
    } else if ($service == "listDiscountCat") {
        $catName = $objData->partnerCat;
        
        $SQL = "SELECT pi.partner_name, pi.partner_logo, pv.voucher_description FROM partner_info pi LEFT OUTER JOIN partner_voucher pv ON pi.partner_id = pv.partner_id WHERE pi.partner_category = '$catName' GROUP BY pi.partner_name";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    } else if ($service == "listPointCat") {
        $catName = $objData->partnerCat;
        
        $SQL = "SELECT pi.partner_name, pi.partner_logo, pv.voucher_description FROM discount_partner pi LEFT OUTER JOIN discount_info pv ON pi.partner_id = pv.partner_id WHERE pi.partner_category = '$catName' GROUP BY pi.partner_name";
        $results = $mysqli->query($SQL);
        $array = array();
        while($rs = $results->fetch_array(MYSQLI_ASSOC)) {
            $array[] = $rs; 
        }
    }
    $mysqli->close();
    echo json_encode($array);