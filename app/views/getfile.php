<?php
    $dir    = '.';
    
    $files1 = glob("*.html");
    foreach ($files1 as $value) {
        echo '<p><a href="'. $value .'" target="_blank">'.$value.'</a></p>';
    }
    
?>