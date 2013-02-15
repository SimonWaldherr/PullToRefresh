<?php

$i = 1;
$lines = rand(5,23);

$html = array('<b>bold</b>', '<code>code</code>', '<i>italic</i>', '<div>div</div>', '<big>big</big>', '<sup>sup</sup>', '<sub>sub</sub>', '<small>small</small>', '<span>span</span>', '<strong>strong</strong>');

echo '<ol class="content">';
while($i < $lines) {
  $htmlr = rand(0,9);
  echo '<li>'.$html[$htmlr].'</li>'."\n";
  time_nanosleep(0, 100000000);
  $i++;
}
echo '</ol>';

?>