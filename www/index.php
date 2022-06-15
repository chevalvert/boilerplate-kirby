<?php

require __DIR__ . '/kirby/bootstrap.php';

// Fix blank panel on Kirby 3.6.2 with kirby-webpack
// Related: https://github.com/brocessing/kirby-webpack/issues/72
if (($_SERVER['HTTP_X_FORWARDED_FOR'] ?? null) === 'webpack') {
  $_SERVER['SERVER_PORT'] = 8080;
}

echo (new Kirby)->render();
