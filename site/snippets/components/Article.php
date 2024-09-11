<?php
  $attributes ??= [];
  $attributes['class'] = 'article ' . ($attributes['class'] ?? '');

  $title = $title ?? $slots->title() ?? null;
  $cover = $cover ?? $slots->cover() ?? null;
  $content = $content ?? $slots->content() ?? null;
  $footer = $footer ?? $slots->footer() ?? null;
?>

<article <?= attr($attributes) ?>>
  <header class='article__header'>
    <?php if ($title) : ?>
      <h2 class='article__title'><?= $title ?></h2>
    <?php endif ?>
  </header>

  <section class='article__content'>
    <?php snippet('html/image', [
      'image' => $cover,
      'lazyload' => false,
      'preset' => 'prose',
      'attributes' => [
        'class' => 'article__cover'
      ]
    ]) ?>

    <?= $content ?>
  </section>

  <?php if ($footer) : ?>
    <footer class='article__footer'>
      <?= $footer ?>
    </footer>
  <?php endif ?>
</article>

