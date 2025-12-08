<?php
  if (!($video ?? null)) return;

  $attributes ??= [];
  $lazyload ??= true;
  $autoplay ??= true;
  $controls ??= false;
  $loop ??= true;
  $muted ??= $autoplay;

  $caption ??= $video->caption()->kirbytext();

  $alt = isset($alt)
    ? Escape::html($alt)
    : Str::slug($site->title() . '_' . $video->parent()->title()) . '_' . $video->filename();

  $poster ??= $video->poster();
  $width ??= $poster?->width();
  $height ??= $poster?->height();
?>

<figure
  <?= attr($attributes) ?>
  class='video <?= $attributes['class'] ?? '' ?>'
>
  <video
    <?= attr([
      'playsinline' => true,
      'autoplay' => $autoplay,
      'controls' => $controls,
      'loop' => $loop,
      'muted' => $muted,
      'preload' => $lazyload ? 'none' : 'auto',
      'onmouseenter' => $lazyload ? 'event.target.setAttribute("preload", "metadata")' : null,
      'alt' => $alt,
      'width' => $width,
      'height' => $height,
      'draggable' => 'false',
      'data-src' => $video->url(),
      'poster' => $poster?->url()
    ]) ?>
  >
    <?php foreach ($video->optimizedSources() as $source) echo $source ?>
  </video>
  <figcaption>
    <?= $caption ?>
  </figcaption>
</figure>
