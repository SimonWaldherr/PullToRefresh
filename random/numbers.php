<?php

$i = 1;
$lines = rand(5,23);
echo '<ol class="content">';
while($i < $lines) {
  echo '<li>'.rand(111,99999).$i.rand(111,99999).$lines.rand(111,99999).rand(111,99999).'</li>'."\n";
  time_nanosleep(0, 100000000);
  $i++;
}
echo '</ol>';

?>