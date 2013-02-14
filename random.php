<?php

$i = 1;
$lines = rand(5,23);
echo '<ol class="content">';
while($i < $lines) {
  echo '<li>'.md5(rand(111,99999).$i.$lines.$_GET['rt']).'</li>'."\n";
  time_nanosleep(0, 100000000);
  $i++;
}
echo '</ol>';

?>