<?php if ($video = Html::video($block->url())): ?>
  <figure class='video'>
    <div class='wrapper'>
      <?= $video ?>
    </div>

    <?php if ($block->caption()->isNotEmpty()) : ?>
      <figcaption><?= $block->caption() ?></figcaption>
    <?php endif ?>
  </figure>
<?php endif ?>
