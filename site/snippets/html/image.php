<?php
  use \Kirby\Image\Focus;
  if (!($image ?? null)) return;

  $lazyload ??= true;
  $caption ??= $image->caption()->kirbytext();
  $alt ??= Escape::html($alt ?? ($image->parent()->title() . ' (' . $site->title()) . ')');
  $attributes ??= [];

  $sizes ??= option('thumbs.sizes.default');
  $focus = Focus::parse($image->focus());
?>

<figure
  <?= attr($attributes) ?>
  class='image <?= $attributes['class'] ?? '' ?>'
>
  <img <?= attr([
    'loading' => $lazyload ? 'lazy' : false,
    'alt' => $alt,
    'data-src' => $image->thumb(option('thumbs.srcsets.default.1920w'))->url(),
    'src' => $image->thumb(option('thumbs.srcsets.default.800w'))->url(),
    'srcset' => $image->srcset(),
    'sizes' => $sizes,
    'width' => $image->resize(1920)->width(),
    'height' => $image->resize(1920)->height(),
    'decoding' => 'async',
    'draggable' => 'false',
    'style' => [
      "--focus-x: " . ($focus[0] ?? 0.5) * 100 . '%;',
      '--focus-y: ' . ($focus[1] ?? 0.5) * 100 . '%;'
    ]
  ])?>>

  <figcaption><?= $caption ?></figcaption>
</figure>
