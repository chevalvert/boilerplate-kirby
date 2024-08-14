<?php
  use \Kirby\Image\Focus;
  if (!($image ?? null)) return;

  $attributes ??= [];
  $preset ??= 'default';
  $lazyload ??= true;
  $photoswipe ??= false;
  $caption ??= $image->caption()->kirbytext();

  $alt = isset($alt)
    ? Escape::html($alt)
    : Str::slug($site->title() . '_' . $image->parent()->title()) . '_' . $image->filename();

  $full = $image->thumb('default');
  $preset = option("thumbs.presets.$preset", option('thumbs.presets.default'));
  $thumb = $image->thumb($preset);
  $width = $thumb->width();
  $height = $thumb->height();

  $focus = Focus::parse($image->focus()) ?? [0.5, 0.5];
?>

<figure
  <?= attr($attributes) ?>
  class='image <?= $attributes['class'] ?? '' ?>'
>
  <img
    <?= attr([
      'data-lazyload' => $lazyload,
      'data-src' => $lazyload ? $thumb->url() : null,
      'src' => $lazyload
        ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 $width $height'%3E%3C/svg%3E"
        : $thumb->url(),
      'alt' => $alt,
      'width' => $width,
      'height' => $height,
      'data-full-width' => $full->width(),
      'data-full-height' => $full->height(),
      'data-full-src' => $full->url(),
      'data-photoswipe' => $photoswipe,
      'draggable' => 'false',
      'style' => implode(';', [
        '--focus-x: ' . ($focus[0] ?? 0.5) * 100 . '%',
        '--focus-y: ' . ($focus[1] ?? 0.5) * 100 . '%'
      ])
    ]) ?>
  >
  <figcaption>
    <?= $caption ?>
  </figcaption>

  <noscript>
    <img src='<?= $full->url() ?>' alt='<?= $alt ?>'>
  </noscript>
</figure>
