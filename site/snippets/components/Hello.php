<?php
  $firstname ??= 'world';
  if (!$firstname) return;
?>

<div class='hello'>Hello <span class='hello__firstname'><?= $firstname ?></span> !</div>
